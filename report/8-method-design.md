Architectural Design
====================

Input
-----
- Potentially break out the subheadings into separate chapters

Main ideas are

1. Full system emulation
2. Abstract away hardware
3. Stimulate inputs and represent outputs as normal applications using the same hardware

Full system emulation
---------------------
Use QEMU ARM emulator to emulate a total environment

Hardware abstraction layer
--------------------------
# Options for GPIO
Write a Linux driver for a GPIO chip that exposes a standard SysFS interface using the build in SysFS support
Write a Linux driver to replace the SysFS driver itself
Use FUSE to mount a fake SysFS and have a user space application intercept all inputs and outputs

# FUSE
FUSE, Filesystem in Userspace, is a kernel driver that can be used to set up arbitrary filesystems in userspace.
Easy to write an application to create special filesystems and intercept reads and writes to those files and handle those in the application.
One use-case for FUSE is to e.g. automatically encrypt/decrypt on write/read
I’ve found no one who have used FUSE to replace SysFS

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
