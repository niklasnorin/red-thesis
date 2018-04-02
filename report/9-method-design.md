# Designing an Emulated Hardware Abstraction Layer Architecture
The main goal of the emulated Hardware Abstraction Layer architecture is to create an environment where an application targeting an embedded Linux application can run without modification.

This means that, in this environment, the application will find that interacting with hardware works as if it was running on the real target.

## Design Process

- Set up features needed to run the Stopwatch application
- Select emulation technology

## Features
There are several features needed to support this kind of architecture. This section will outline some of the most important as well as some minor, and even optional, ones.

### Core Features
The Target Application should be able to interact with GPIO's as if they were physically there. This should be done by:

1. Emulating GPIO hardware in a way transparent to the Target Application.

2. Stimulate the peripheral "other side" of emulated inputs and outputs from a Emulated Hardware Application.

The first point is very important for the Target Application to be able to interact with the hardware drivers without any modification. This means that all interfaces needs to be the same as the real hardware, as well as the data passed both ways over those interfaces.

The second point is important for the Target Application to be able to expect the same behavior from attached hardware as it would on the real target. If, for example, an application is expecting to read a specific value from an input after having written to an output, then being able to insert some application logic between the two is essential.

### Additional Features
In addition to the above, Quarterdock shall also:

- Support operating GPIO's as both input and output.
- Support interrupts on input change.
- Work for both statically and dynamically linked applications.
- Aim to work on as many Linux distributions as possible.
- Be possible to run on any Host OS.
- Enable the developer to write the Emulated Hardware Application in a way that accesses hardware in the same way as the Target Application.

This last feature allows the developer to write emulated hardware code using the exact same language and libraries that he is already using to write his application.

### Optional Features
Some nice-to-have features, that are not essential for local PC development, are:

- That it should be possible to run Quarterdock on real hardware.
- That is should be possible for Quarterdock to both intercept and forward writes to GPIO:s to the real GPIO:s when run on real hardware.

These features combined could enable intercept GPIO access on the real hardware while still operating normally. This in turn could be used to develop virtual logical analyzers that can be run on real hardware.

## Selecting Option for Emulating GPIO
As was outlined in the chapter [ref:Options for Emulating GPIO](?) there are multiple options for intercepting calls to GPIO:s in Linux. Each comes with their pros and cons and differ vastly in when, and how, they intercept calls to hardware.

All of these options are evaluated in turn in this section. This section only contains the evaluation of these options, to read an in-depth explanation of what they mean, see [ref:Options for Emulating GPIO](?).

### Duplicating SysFS with Regular Files
In practice, this would only work for very naïve, simple, applications and in very specific use-cases.

For the Stopwatch Example Application, manually creating one file per 7-segment display LED might be able to trick the application to simply write out the segment LED values to these files. Since writes to GPIOlib GPIO outputs are done via regular writes, this would simply truncate the file with a new value every time a LED changed value.

For the buttons however this approach will not work. The Stopwatch Example Application depends on interrupts for the two buttons, and there is simply no way to "press" a button with this approach that will result in a GPIOlib compatible interrupt. The closest thing to file-based interrupts would be to listen to changes to a file using the `inotify` API, which is part of the Linux kernel [[#Linux Programmer's Manual, Michael Kerrisk - Linux man-pages maintainer, 2018-04-02](http://man7.org/linux/man-pages/man7/inotify.7.html)]. According to the documentation of `inotify` however, it can only intercept changes to files done via the filesystem API. Notably, it explicitly states that "pseudo-filesystems such as /proc, /sys, and /dev/pts are not monitorable with inotify". This means that the `inotify` API could not both be used to listen for changes in GPIO input value on both real hardware and on the target hardware.

Using `inotify` when running on a PC and e.g. `poll` (which works on SysFS files) on the real hardware would go against the HAL principle since it would mean the application would need to be changed to run on a PC.

### LD_PRELOAD
This approach only works for dynamically linked applications by design, and so breaks the Quarterdock requirements. It should work for statically linked applications as well as dynamically linked ones.

### Linux Kernel Driver
#### Custom GPIO Driver
#### Custom SysFS Driver
#### Custom Linux filesystem

### FUSE

## Security
The FUSE kernel driver defaults to only allowing the process and user who created the mount, has access to it

The FUSE kernel driver is currently configured with `allow_other`, an option which means that anyone, not only the process and user who created the mount, has access to it.

