
# Linux

## SysFS and GPIOlib for user-space GPIO
While all direct hardware access is restricted to the kernel, the SysFS is a generic Linux kernel facility that enables exposing kernel data structures an attributes to user space.

GPIOlib is built on top of SysFS and specifies an API to expose and interact with individual GPIO's.

### Exposing a GPIO
The user can expose a GPIO by writing the GPIO number to `/sys/class/gpio/export`. This will make GPIOlib look through all registred GPIO drivers and, if the GPIO is valid, expose it as a folder under `/sys/class/gpio/gpioN`, where N is the GPIO number.

The content of this folder is related to the GPIO's functionality. It will have files for setting direction, reading the value and changing the value of the GPIO.

### Configuring GPIO direction
Most GPIO's will be able to be configured either as an input or an output. This functionality is exposed as `/direction` underneath the GPIO's folder.

Writing `in` to the direction file will configure it as an input, while writing `out` will configure it as an output.

### Input and output
The current state of the GPIO is exposed underneath `/value`. 

If the GPIO is an output, then writing a `1` to it will set the output to logic high. Writing a `0` will set it to logic zero. Reading the `/value` will return the current output state.

If the GPIO is configued as an input, then reading `/value` will return the current state of the GPIO. 

### Listening to interrupts
Many input pins supports listening to interrupts. This functionality is configured via the `/edge` file. This attribute can be set to `falling` to trigger on falling edge, `raising` to trigger on raising edge or `both` to trigger on both. Setting it to `none` disables interrupt detection.

The configuration above only enables the underlying interrupt. Listening on the file itself is done via Linux `poll`, which is a command that can be used to wait on arbitrary files. When `poll` returns an event, it means that an interrupt has been triggered.

## Options for Emulating GPIOs

### LD_PRELOAD

Dynamically linked application are linked with libraries at runtime instead of at compile time. LD_PRELOAD is an environmental variable picked up by Linux dynamic linker that allows the developer to override the symbol of any dynamically linked library. Used creatively, this can be used to emulate hardware.

Using LD_PRELOAD to wrap calls to file operations such as `read`, `write` and `ioctl`, it's possible to intercept and modify specific calls. This could be used to only intercept `ioctl` directed towards a SPI driver path, all others are passed down to the *real* `ioctl` and the kernel. This is exactly how umockdev (insert reference) is implemented.

### Linux kernel modules

The ways the GPIO drivers work are exposed to user-space opens up multiple options to emulating GPIO's in Linux.

From top to bottom, the way it works is that at the bottom is the GPIO driver itself. On real hardware, this would write and read to the memory mapped registers of the physical GPIO module. This module is part of the kernel and lets the kernel know exactly what GPIO's it exposes, and their capabilities.

On top of this driver runs GPIOlib, which inspects all GPIO driver and uses SysFS to expose those GPIO's via the standard user-space file system.

#### Custom GPIO driver
Write a Linux driver for a GPIO chip that exposes a standard SysFS interface using the build in SysFS support

#### Custom SysFS driver
Write a SysFS Linux driver that exposes the same interface as GPIOLib.

This allows reuse of the infrastructure of SysFS which makes it easy to expose "properties" as files without implementing a full filesystem.

#### Custom Linux filesystem
Linux uses a standardized filesystem model called VFS, or the Virtual File System. The VFS forwards any filesystem requests to the filesystem mounted at a specific location.

Create a linux filesystem from scratch would allow to expose the same filesystem interface. This is how SysFS is implemented.

### FUSE

- See next chapter
