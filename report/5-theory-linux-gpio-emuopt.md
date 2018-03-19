# Linux

The use of Linux in embedded applications is on the rise [?](https://www.linux.com/news/embedded-linux-keeps-growing-amid-iot-disruption-says-study).

Linux as an OS has several nice properties, such as:

- It's free, with no royalties or licensing fees
- Very thoroughly tested, at scale, for more than 25 years
- Very powerful and configurable kernel

Specifically for embedded software, some other nice properties include:

- Supported on all major embedded architectures, such as ARM
- Easy access to hardware via standardized interfaces
- Possible to implement custom hardware drivers via kernel modules

## Everything is a File or a Process

In Linux, everything is either a file or a process [?](http://yarchive.net/comp/linux/everything_is_file.html). Although a file in linux indeed often represents data that is persisted to disk, the filesystem is also used as a way to interact with kernel drivers.

## SysFS and GPIOlib for user-space GPIO
While all direct hardware access is restricted to the kernel in Linux, SysFS is a generic Linux kernel facility that enables other kernel modules to expose data structures as attributes in the file system.

GPIOlib is such a kernel module, built on top of SysFS, and specifies an API to expose and interact with individual GPIO's as files [?](https://www.kernel.org/doc/Documentation/gpio/sysfs.txt).

### Exposing a GPIO
The user can expose a GPIO by writing the GPIO number to `/sys/class/gpio/export`. This will make GPIOlib look through all registered GPIO drivers and, if the GPIO is valid, expose it as a folder under `/sys/class/gpio/gpioN`, where N is the GPIO number.

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

Using LD_PRELOAD to wrap calls to file operations such as `read`, `write` and `ioctl`, it's possible to intercept and modify specific calls. This could be used to only intercept `ioctl` directed towards a SPI driver path, all others are passed down to the *real* `ioctl` and the kernel. One application that implements this is umockdev [?].

### Linux kernel modules

The ways the GPIO drivers are exposed to user-space opens up multiple options to emulating GPIO's in Linux.

At the bottom most layer is the GPIO driver itself. On real hardware, this would typically write and read to the memory mapped registers of the physical GPIO module in a CPU. This module lets the kernel know exactly how to configure GPIO:s, and their capabilities.

On top of this driver runs GPIOlib, which inspects all GPIO driver and uses SysFS to expose those GPIO's via its standard SysFS user-space file system.

#### Custom GPIO driver
Write a Linux driver for a GPIO chip that exposes a standard SysFS interface using the build in SysFS support.

#### Custom SysFS driver
Write a SysFS Linux driver that exposes the same interface as GPIOLib.

This allows reuse of the infrastructure of SysFS which makes it easy to expose "properties" as files without implementing a full filesystem.

#### Custom Linux filesystem
Linux uses a standardized filesystem model called VFS, or the Virtual File System. The VFS forwards any filesystem requests to the filesystem mounted at a specific location.

Create a linux filesystem from scratch would allow to expose the same filesystem interface. This is how SysFS is implemented.
