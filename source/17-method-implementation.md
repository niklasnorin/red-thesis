# Implementing Quarterdock
Quarterdock consists of a few moving parts:

1. A FUSE client that can expose a GPIOlib compatible interface
2. A real-time in-memory database which holds the state of the GPIO's
3. The Quarterdock control layer to configure and setup 1. and 2.
4. A Docker template for Quarterdock Clients that overrides the default GPIOlib with Quarterdock

The relation between these are shown in Figure \ref{10}.

![Quarterdock and FUSE \label{10}](source/figures/10.png)

## GPIOlib Compatible FUSE Client

### Golang
The implementation of the FUSE client was done in Golang, or just "Go" for short. Golang was created by Rob Pike and Ken Thompson at Google in 2009 [@go-history]. It is a compiled language that is strongly typed and garbage collected.

### go-fuse
As has been covered before, FUSE consists of a Kernel driver and a User space library. The reference implementation of the User space library for FUSE is called `libfuse` and is written in C [@libfuse]. Some FUSE libraries in other programming languages wrap this library and provides a translation layer on top into the local language [@fuse-node].

`go-fuse` is a native implementation of the FUSE interface in Go. It does not depend on `libfuse`, but aim to implement the same functionality from scratch. According to the author, its performance is almost on par (within 5%) of the `libfuse` implementation [@go-fuse].

`go-fuse` works by first telling the FUSE kernel driver to mount a certain volume and then it listens for any requests from the FUSE driver that pertains to that mount.

### GPIOlib Compatibility
GPIOlib API consists of the following file-based interface:

: GPIOlib API operations

| File                    | Operations              |
| ----------------------- | ----------------------- |
| `/gpio/export`          | `write`                 |
| `/gpio/unexport`        | `write`                 |
| `/gpio/gpioN/value`     | `read`, `write`, `poll` |
| `/gpio/gpioN/direction` | `read`, `write`         |
| `/gpio/gpioN/edge`      | `read`, `write`         |

The semantics and use of these has already been described in Chapter 5.

### Modifying go-fuse to support polling
`go-fuse` supports all of the above operations, in addition to many more, but with the notable exception of `poll`. Being able to setup an interrupt, and use `poll` to listen for it, is absolutely critical to efficiently listen to, and react to, changes in input. Without this, the reader of an input would have to manually poll the input value by looping over it continuously.

Early in the implementation of Quarterdock, `go-fuse` was "forked" from the main development branch. In this new branch, `poll` was implemented.

`go-fuse` already had a lot of the infrastructure in place for this. All filesystem operations are handled in a very similar way. Most of the work related to adding polling had to do with learning exactly how `go-fuse` works, and adding it in a idiomatic manner.

### RpcFS
The `go-fuse` API for a filesystem, and files in that filesystem, is quite extensive. The `FileSystem` interface contains 20+ functions and the `File` interface 10+ function any of which might, or might not, need to be implemented.

A abstraction layer was developed to better separate the challenges related to interfacing with FUSE and those of emulating GPIO:s. That abstraction layer is called `RpcFS`, for Remote Procedural Call FileSystem, and an overview is shown in Figure \ref{10_1_5}.

![RpcFS - from file write to function call \label{10_1_5}](source/figures/10_1_5.png)

The idea behind `RpcFS` is that each file is a simple object, called a `RpcFunction`. A `RpcFunction` is identified uniquely by its path, such as `/gpio1/value`, and can implement 3 functions:

1. `OnWrite` is called when writing to the file
2. `OnRead` is called when reading from the file
3. `OnPoll` is called when poll is called on the file

None of these functions are implemented by `RpcFS`, it simply intercepts the underlying `write`, `read` and `poll` requests and routes them to the relevant `RpcFunction`. When writing, it is simply passed an array of bytes as data. When reading it will simply return an array of bytes. When polling the call should block until it has some event to return.

`RpcFS` also takes care of the logic related to setting up the mount volume, navigating through the folder structure created by the paths, returning fixed sizes for files and more.

#### Fixed File Size
To keep with the interface of SysFS, the size of all files are set to fixed size of 4096 bytes, or one i386 "page". This is done so that all data can be read and written by passing a single 4096 byte buffer [@sysfs]. This is also something `RpcFS` does without any special configuration.

When a client issues a `read`, what happens is that X amount of bytes is returned, and then the next call returns that it read zero bytes, a signal that there is no more data to be read.

#### Bypassing the Page Cache
When opening a file, the Kernel normally opens it in a buffered mode [@linux-open]. In this mode, Linux assumes that since a file cannot change in between a filesystem write and a read and is free to cache any reads to any filesystem. This means that if you read a file twice, it might issue a read request to the filesystem the first time, but the second time it might return the a cached result of the first read.

This assumption does not hold true for input GPIO:s, which can change at any point in time. A first read might yield a `0` while the second read might yield a `1`, all depending on behavior external to the Kernel and the filesystem.

`RpcFS` makes sure files are opened with the `O_DIRECT` option to bypass the default page cache.  With `O_DIRECT` enabled, each `read` or `write` operation is always guaranteed to trigger a read or write to the underlying filesystem.

### GpioFS
While `RpcFS` is used to setup and interface with FUSE, `GpioFS` only concerns itself with exposing the GPIOlib interface. `GpioFS` does in fact not have any dependencies on `go-fuse` but only on `RpcFS`, as shown in Figure \ref{10_1_6}.

![GpioFS implemented on top of RpcFS \label{10_1_6}](source/figures/10_1_6.png)

`GpioFS` has the following responsibilities:

1. Handle exporting and unexporting GPIO:s
2. Export the same GPIO files as GPIOlib with default values
3. React on poll (input interrupt) requests based on `edge` configuration
4. Write changes to these files into a database

#### Exporting a GPIO
Before any GPIO has been exported, `GpioFS` only exports two files in on folder:

- `/export`
- `/unexport`

If an application wants to export GPIO 3, then it would write `3` to `/export`. What would happen then is that `GpioFS` would add three `RpcFunction`:s to the underlying `RpcFS` filesystem, one for each property of the GPIO.

The resulting folder and file structure would be GPIOlib compatible:

- `/export`
- `/unexport`
- `/gpio3/value`
- `/gpio3/direction`
- `/gpio3/edge`

The new GPIO files will by default be configured as an input with no active edge trigger.

Also note that the exported pins are local to the `GpioFS` instance.

#### Interrupt on Input
When `GpioFS` receives a `poll` request on the `/value`, it will look at the `/edge` configuration. It will then do a blocking wait until the value goes from 0 to 1, 1 to 0 or both, depending on the configuration, before returning with an event.

#### MemDB
A simple key-value store was developed to store the state of the GPIO:s. It only implements three public functions:

``` Golang
type DB interface {
	Get(key string) (string, error)
	Put(key string, value string) error
	Changed(key string) chan string
}
```

`MemDB` implements a simple string based key-value store that can be used to put in data, get data and listen to changes in the data.

##### GpioFS and MemDB
When creating a `GpioFS` instance, it is passed a `MemDB` instance which is used to save the state of the GPIO:s.

FUSE passes on the full mount path of any operation, something that `RpcFS` passes on to `GpioFS`. This means that if the application writes to `/gpio3/value`, `GpioFS` will get that full path as part of the call to the `OnWrite` function along with the data. This is something `GpioFS` exploits to use the path as a unique `MemDB` key.

For example, writing a `1` to `/gpio3/value`, is stored inside `MemDB` as a map data structure, where `/gpio3/value` is the key to get the value `1`.

##### Shared vs. Private State
The same `MemDB` is used to share state between multiple `GpioFS` instances. To support sharing the value while configuring the rest of the GPIO properties separately, a prefix system is used.

All `/value`:s are saved as is, without prefixing, and so is shared among all `GpioFS` instances that use the same `MemDB` instance.

All other GPIO files, `/direction` and `/edge`, are prefixed with the `GpioFS`'s mount path, which is unique among mounts. This means that changes in these are not shared, but private to each `GpioFS` instance.

Although not directly related, please note again that the exported pins are local to the `GpioFS` instance. Which pins are exported (and so visible in the filesystem) are not shared between `GpioFS` instances, even if the `MemDB` is shared.

### Quarterdock
While `GpioFS` provides the GPIOlib FUSE implementation and `MemDB` the storage, it is the Quarterdock CLI, Command Line Interface, which provides an interface to the user. In addition to this, it is also the part of the application which composes a complete working system out of these components. Figure \ref{10_1_7} shows an example run.

![A Quarterdock instance given two paths - one for the Target Application and one for the Emulated Hardware Application \label{10_1_7}](source/figures/10_1_7.png)

Quarterdock has a simple interface. It takes an arbitrary list of paths as input and sets up a GPIOlib compatible FUSE mount at these locations using `GpioFS`. All of these `GpioFS` instances share the same `MemDB`, and so the state of the pins.

For example, executing the command `./quarterdock /tmp/qa /tmp/qb` would setup two GPIOlib compatible mounts, one at `/tmp/qa` and one at `/tmp/qb`. If one would list the content of those folders, you would see the `export` and `unexport`, which is the signature of GPIOlib.

## Quarterdock Clients
The Quarterdock CLI produces arbitrary mount points which content is compatible with GPIOlib. However, for an embedded software application to be able to use it without modification, those mounts cannot reside in any location. They have to be exactly at `/sys/class/gpio`, which is where GPIOlib is located at a Target device.

There are at least two reasons why we would not want Quarterdock to mount directly to this location:

1. It would disrupt any access to GPIO:s across the entire host OS. The emulated GPIO:s would not only be visible to the Target Application, which we want to put into an emulated environment, but the entire system. This would mean that while Quarterdock was running, no part of the host would be able to access any GPIO:s. This is related to requirement **R12.**.

2. It is not possible to put both the GPIOlib mount exposed to the Target Application and mount exposed to the Emulated Hardware Application in the same path. This means that even if we did put the Emulated Hardware Application mount point at `/sys/class/gpio` on the host, the Emulated Hardware Application might not be able to use standard GPIO libraries, which assumes that GPIO:s are always located at `/sys/class/gpio`. This is related to requirements **R1.** and **R2.**.

Instead, we want to find a solution where the GPIOlib compatible mounts are exposed to the Target Application and the Emulated Hardware Application separately and at the same location, `sys/class/gpio`.

### Docker Container and Bind Mount
To be able to expose the two different applications, the Target Application and the Emulated Hardware Application, to two different environment we will use a combination of Docker containers and bind mounts, as illustrated in Figure \ref{10_2_1}.

![Bind mounting two different GPIOlib folders into the same location, `/sys/class/gpio`, in the two containers \label{10_2_1}](source/figures/10_2_1.png)

A Docker container can be used to run an application in a very controlled environment, which includes mounts. Docker provides native support to bind mount a folder from the host into the container. This exposes the content of the folders on the host to the container at a specified location. As has been mentioned before, if the folder already exists, the content is simply hidden from the container, and replaced by the content of the bind mount.

This technique can be used to e.g. make the `/tmp/qa` folder appear at `/sys/class/gpio` for the Target Application while in another container `/tmp/qb` can be exposed to the Emulated Hardware Application at the same location. This allows both applications to access the emulated GPIOlib is the same location as the real GPIOlib would reside.

#### Bind Mount Propagation
When using Quarterdock in Docker, we are using mounts within mounts. First, a folder from the Host OS is bind mounted into the Docker container. Inside this folder is the FUSE mount that is created by Quarterdock.

By default new mounts within the bind mounted volume are not propagated to the target folder inside the Docker container [@docker-bind-mount-propagation]. For Quarterdock, by default, this would mean that while the folder containing the quarterdock mount is available to the container, the mount itself is not.

To solve this the Quarterdock folders needs to be mounted with `rshared`. This means that any mount already mounted, or that gets mounted in the future, in the bind mounted folder, is propagated to the container.

#### Relaxed FUSE Security
When using Quarterdock to create a FUSE mount and sharing it into a Docker container, the user of Quarterdock process and the Docker container process is not the same.

To grant the user inside the Docker container access to the FUSE volume, we have to apply the `allow_other` configuration. This is configured by default by `RpcFS`.

### Quarterdock Container
While the Target Application and the Emulated Hardware Application both have to be run in a Docker container, Quarterdock itself strictly does not. However, to allow the entirety of the Quarterdock environment to be configured in the same way, Quarterdock too is a Docker container.

A strong side benefit of this also that Quarterdock can easily be built on any developers PC, as the build itself is executed inside Docker.

### Docker Machine
Quarterdock is run using Docker Machine with VirtualBox as the virtual machine, with a small VM image called `boot2docker` [@https://github.com/boot2docker/boot2docker].

Because the `boot2docker` kernel doesn't include GPIOlib support (common for kernels that doesn't target embedded), it doesn't have the folder `/sys/class/gpio`. Since SysFS, and so `/sys` is a special file system, it's not possible to simply create an empty `gpio` folder.

Bind mounts can only be done on existing folders, so the closest folder we can bind mount to is `/sys/class`. This has the downside that not only the `/sys/class/gpio` folder is replace, but it also blocks any other sub-folders of `/sys/class` to be accessed inside the container.

## Composing a Quarterdock Environment
A complete Quarterdock Environment consists of a minimum of three Docker containers:

1. Quarterdock
2. The Target Application (Quarterdock Client)
3. The Emulated Hardware Application (Quarterdock Client)

This constellation of containers is composed using Docker Compose. This allows us to configure the entire environment so that it can be replicated every time, as shown in Figure \ref{10_3}.

![Creating and running a complete Quarterdock environment from a single configuration file \label{10_3}](source/figures/10_3.png)

The Docker Compose setup is configured so that:

1. The Quarterdock container starts and sets up two `GpioFS` mount points on the host
2. When the Quarterdock container has started, both the other containers start
3. The Target Application starts while being exposed to one of `GpioFS` mount points via one bind mount
4. At the same time, the Emulated Hardware Application starts and is exposed to the other `GpioFS` mount point

After this point, all of the Target Application GPIO:s are connected to the GPIO:s of the Emulated Hardware Application via Quarterdock.

### A Complete Example
To see a description of the setup and a test run of the Stopwatch Example Application and the Stopwatch Emulated Hardware Application, see Appendix A.
