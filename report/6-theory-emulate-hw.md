The Challenges of Emulating Embedded Environments
=================================================

The architecture
----------------

In many cases, if not most, it is also not possible to execute the embedded software being developed on the computer used for the development. This is due to differences in processor architecture between most laptops and stationary computers and the target. Most modern personal computers have either x86 or amd64 based processors, while most modern embedded systems have ARM based processors. There are emulators that can execute non-native code, such as running ARM programs on a x86 system, but it's very rare that these emulators supports emulating all attached hardware peripherals.

The environment
---------------

An embedded application is designed to run in a very specialized environment, with a very specific purpose and often with far reaching dependencies on services available only in the environment that the software is designed to run in. In the cloud, these kind of dependencies could be databases, enterprise service buses or other user software. For embedded software, this could be hardware timers or attached external memory chips.

For a cloud application it's often possible to replicate the environment it is supposed to run in, in part or whole, on the development computer. Running a local database on the development computer is generally straight forward and common practice in modern web-app development environment. Replicating the target environment tends to be harder for embedded software. Emulating a hardware timer or external I2C EEPROM chip connected to a certain pin on an embedded system is usually more complicated than starting a local database server.

The reason the environment in which embedded software runs is generally harder to emulate is two-fold. Firstly, embedded code often depends heavily on hardware peripherals on the processor executing the code. This can be very hard to emulate, as access to these facilities are often done on a very low abstraction level, the behavior is complex and implemented in closed-source hardware. Secondly, embedded code often depends on externally connected components, like buttons or displays connected via inputs, outputs or serial protocols. These interactions are often hard to emulate and there are few standard ways of emulating, nor stimulating, these component together with application code.

Full system emulation
=====================
There are emulators, such as QEMU, Quick EMUlator, that are considered full-system emulators. What this means is that the emulator can emulate the architecture and the environment needed to run both the OS and the application that is targeting another target than the host.

A full-system emulators can run a full Linux OS and applications compiled for ARM on a x86 computer and at the same time also emulate hardware to the lowest level. It essentially equates to being able to intercept memory mapped register writes and reads and redirecting them to custom emulated drivers. This is very powerful and allows e.g. hardware specific Linux GPIO drivers to be used directly without any modification.

The main downside with this type of hardware emulation is that it's done at such a low level. There's no straight forward way to write a generic GPIO driver at this level. If Linux is configured for a specific target, then the emulator has to be written to emulate that specific register map. A emulated driver for specific SoC A cannot be used for SoC B.

