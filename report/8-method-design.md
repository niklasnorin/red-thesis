# 6. Designing an Emulated Target Environment Architecture

The main goal of the architecture is to create an environment where an application targeting an embedded Linux platform can run without modification. In this environment, the application will find that interacting with hardware works as usual. It should be able to interact with GPIO's exposed via SysFS and GPIOlib as if they were physically there.

This will be done by:

1. Emulating select hardware API's in a way transparent to the user-space application
2. Stimulate the peripheral ("other") side of emulated inputs and outputs from a 3rd party user-space application

The first point is very important for the application to be able to interact with the hardware drivers without any modification. The second point is important for the application to be able to expect the same behaviour as it would on the real target.

## 6.1 Hardware Abstraction Layer
The main idea with an hardware abstraction layer is to decouple the application facing hardware interfaces from the actual hardware. This is a very common pattern used both on small MCU's and on Linux. It makes it possible to run the same code on several platforms without having to worry about the underlying hardware being different.

SysFS together with GPIOlib, described in the previous chapters, is a perfect example of this. No matter the underlying platform, accessing GPIOs is done in the exact same way on Linux. The application wouldn't have to change when using a different platform, except possibly to be configured to use different GPIOs on different hardware.

## 6.2. Options for Emulating GPIOs

### 6.2.1. Linux kernel modules

The ways the GPIO drivers work are exposed to user-space opens up multiple options to emulating GPIO's in Linux.

From top to bottom, the way it works is that at the bottom is the GPIO driver itself. On real hardware, this would write and read to the memory mapped registers of the physical GPIO module. This module is part of the kernel and lets the kernel know exactly what GPIO's it exposes, and their capabilities.

On top of this driver runs GPIOlib, which inspects all GPIO driver and uses SysFS to expose those GPIO's via the standard user-space file system.

### 6.2.2. Custom GPIO linux kernel driver
Writing a custom GPIO Linux kernel driver would mean

Write a Linux driver for a GPIO chip that exposes a standard SysFS interface using the build in SysFS support
Write a Linux driver to replace the SysFS driver itself
Use FUSE to mount a fake SysFS and have a user space application intercept all inputs and outputs

## 6.3. LD_PRELOAD

Dynamically linked application are linked with libraries at runtime instead of at compile time. LD_PRELOAD is an environmental variable picked up by Linux dynamic linker that allows the developer to override the symbol of any dynamically linked library. Used creatively, this can be used to emulate hardware.

Using LD_PRELOAD to wrap calls to file operations such as `read`, `write` and `ioctl`, it's possible to intercept and modify specific calls. This could be used to only intercept `ioctl` directed towards a SPI driver path, all others are passed down to the *real* `ioctl` and the kernel. This is exactly how umockdev (insert reference) is implemented.

This approach requires the intercepting code to be recompiled for each targeted platform, and only works for dynamically linked applications. Statically linked applications would have to compile in the library as a type of instrumentation. Compiling with and without it would yield two different binaries.

FUSE
----
FUSE, Filesystem in Userspace, is a kernel driver that can be used to set up arbitrary filesystems in userspace.
Easy to write an application to create special filesystems and intercept reads and writes to those files and handle those in the application.
One use-case for FUSE is to e.g. automatically encrypt/decrypt on write/read
I’ve found no one who have used FUSE to replace SysFS

Emulating hardware
==================
**The plumbing to connect the application to emulated hardware is done via FUSE and AuFS. **

# AuFS
AuFS - Another union filesystem
A filesystem that can be used to overlay two filesystems on top of each other. Can be used to make an application “see” what the developer wants it to see.
Could be used to make two applications see the same directory, e.g. /sys/class/gpio while in reality they are pointing to different folder.

Emulating and representing hardware
-----------------------------------
Write “regular” embedded software to
Emulate attached hardware
Stimulate inputs
Visualize outputs
If run on real target could be man-in-the-middle to attach virtual logic analyser 

Full system emulation
---------------------
Use QEMU ARM emulator to emulate a total environment