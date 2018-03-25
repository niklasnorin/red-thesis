# Linux

The use of Linux in embedded applications is on the rise [[#](https://www.linux.com/news/embedded-linux-keeps-growing-amid-iot-disruption-says-study)].

Linux as an OS has several nice properties, such as:

- It's free, with no royalties or licensing fees
- Very thoroughly tested, at scale, for more than 25 years
- Very powerful and configurable kernel

Specifically for embedded software, some other nice properties include:

- Supported on all major embedded architectures, such as ARM
- Easy access to hardware via standardized interfaces
- Possible to implement custom hardware drivers via kernel modules

## Everything is a File or a Process

In Linux, everything is either a file or a process [[#Linus Torvalds, Mail list, 2018-03-25](http://yarchive.net/comp/linux/everything_is_file.html)]. Although a file in linux indeed often represents data that is persisted to disk, the filesystem is also used as a way to interact with kernel drivers.

## Kernel space and User space
The memory space in Linux is divided between Kernel space and User space. Kernel space is where the kernel processes executes, while User space is where all other programs and services run [[#](?)].

The notion of Kernel space and User space is also used to refer to the amount of access a process has to the system. In most Linux systems, only processes running in Kernel space has access to memory mapped hardware [[#](?)]. This means that User space processes that want to access hardware always have to do so via system calls to the kernel. The kernel then in turn accesses the hardware.

## SysFS and GPIOlib for User Space GPIO Access
While all direct hardware access is restricted to the kernel in Linux, SysFS is a generic Linux kernel facility that enables other kernel modules to expose data structures as attributes in the file system [[#](?)].

GPIOlib is such a kernel module, built on top of SysFS, and specifies an API to expose and interact with individual GPIO's as files [[#Linux Kernel Documentation, 2018-03-25](https://www.kernel.org/doc/Documentation/gpio/sysfs.txt)].

### Exposing a GPIO
The user can expose a GPIO by writing the GPIO number to `/sys/class/gpio/export`. This will make GPIOlib look through all registered GPIO drivers and, if the GPIO is valid, expose it as a folder under `/sys/class/gpio/gpioN`, where N is the GPIO number. The rest of the paths in the sub-sections below are relative to this path.

The content of this folder is related to the GPIO's functionality. It will have files for setting direction, reading the value and changing the value of the GPIO.

### Configuring GPIO direction
Most GPIO's will be able to be configured either as an input or an output. This functionality is exposed as `/direction` underneath the GPIO's folder.

Writing `in` to the direction file will configure it as an input, while writing `out` will configure it as an output.

### Input and output
The current state of the GPIO is exposed underneath `/value`. 

If the GPIO is an output, then writing a `1` to it will set the output to logic high. Writing a `0` will set it to logic zero. Reading the `/value` will return the current output state.

If the GPIO is configured as an input, then reading `/value` will return the current state of the GPIO.

### Listening to interrupts
Many input pins supports listening to interrupts. This functionality is configured via the `/edge` file. This attribute can be set to `falling` to trigger on falling edge, `raising` to trigger on raising edge or `both` to trigger on both. Setting it to `none` disables interrupt detection.

The configuration above only enables the underlying interrupt. Listening on the file itself is done via Linux `poll`, which is a command that can be used to wait on arbitrary files. When `poll` returns an event, it means that an interrupt has been triggered.

## Options for Emulating GPIO:s
There are multiple ways to emulate hardware, or trick an application to think that hardware is available. These range from simply creating a few empty files to creating low-level kernel drivers.

### Duplicating SysFS with Regular Files
Because everything is a file in Linux, standard `read` or `write` operations are used and for many operations these cannot distinguish a regular persistent file from a file that is mapped to hardware. This means that by replicating the GPIOlib file structure with regular persistent files is possible in some cases.

### LD_PRELOAD
Dynamically linked application are linked with libraries at runtime instead of at compile time. LD_PRELOAD is an environmental variable picked up by Linux dynamic linker that allows the developer to override the symbol of any dynamically linked library. Used creatively, this can be used to emulate hardware.

Using LD_PRELOAD to wrap calls to file operations such as `read`, `write` and `ioctl`, it's possible to intercept and modify specific calls. This could be used to only intercept `ioctl` directed towards a SPI driver path, all others are passed down to the *real* `ioctl` and the kernel. One application that implements this is umockdev [[#GitHub umockdev, 2018-03-25](https://github.com/martinpitt/umockdev)].

### Linux Kernel Driver
The ways the GPIO drivers are exposed to user space opens up multiple options for emulating GPIO hardware in Linux.

#### Custom GPIO Driver
At the bottom most layer is the GPIO driver itself. On real hardware, this would typically write and read to the memory mapped registers of the physical GPIO module in a CPU. This module lets the kernel know exactly how to configure GPIO:s, and their capabilities [[#](?)].

It would be possible to write a Linux driver that would pretend it is a GPIO driver. This "fake" GPIO driver would then be automatically detected by GPIOlib and would automatically expose a standard interface via SysFS using the build in SysFS support. 

Any writes to e.g. `/sys/class/gpio/gpio1/value` would actually be handled by the custom GPIO driver.

#### Custom SysFS Driver
GPIOlib works by inspecting all GPIO drivers and then uses SysFS to expose those GPIO:s via its standard SysFS user space file system [[#](?)].

One alternative to writing a GPIO driver, would be to implement a custom version of GPIOlib. This would expose the exact same interface as GPIOlib via SysFS, but it would not interact with any real GPIO drivers in any way. Instead of searching for GPIO drivers, it could expose anything it wants via SysFS and handle incoming requests in any way it wants.

This allows reuse of the infrastructure of SysFS which makes it easy to expose "properties" as files, without implementing a full filesystem from scratch.

#### Custom Linux filesystem
Linux uses a standardized filesystem model called VFS, or the Virtual File System [[#](?)]. The VFS forwards any filesystem requests to the filesystem driver mounted at a specific location.

Creating a Linux filesystem driver would allow to expose any filesystem interface. This is how SysFS is implemented [[#](?)].
