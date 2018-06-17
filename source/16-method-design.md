# Designing Quarterdock
The main goal of Quarterdock is to create an environment where an application targeting an embedded Linux application can run without modification, as illustrated in Figure \ref{9}.

![Quarterdock's interfaces \label{9}](source/figures/9.png)

This means that, in this environment, the application will find that interacting with hardware works as if it was running on the real target.

## Requirements
There are several requirements needed to support this kind of architecture. This section will outline some of the most important ones.

All the requirements are written to further specify and clarify how the Purpose and Goals of this work relates to the concrete implementation of the architecture.

### Core Requirements
The Target Application should be able to interact with GPIOs as if they were physically there. This means that Quarterdock shall:

**R1.** Emulate GPIO hardware in a way transparent to the Target Application.

**R2.** Be able to stimulate the peripheral side of emulated inputs and outputs from an Emulated Hardware Application. This application should be possible to implement as if it was running on the Target, with the same requirement of transparency as **R1**.

The first requirement is very important for the Target Application to be able to interact with the hardware drivers without any modification. This means that all interfaces need to be the same as the real hardware, as well as the data passed both ways over those interfaces.

The second requirement is important for the Target Application to be able to expect the same behavior from attached hardware as it would on the real target. For example, if an application is expecting to read a specific value from an input after having written to an output, then being able to insert some application logic between the two is essential.

### Additional Requirements
In addition to the above, Quarterdock shall also:

**R3.** Support operating GPIO's as both input and output.

**R4.** Support interrupts on input change.

**R5.** Work for both statically and dynamically linked applications.

**R6.** Aim to work on as many Linux distributions as possible.

**R7.** Be possible to run on any Host OS.

**R8.** Enable the developer to write the Emulated Hardware Application in a way that accesses hardware in the same way as the Target Application. This allows the developer to write emulated hardware code using the exact same language and libraries that he is already using to write his application.

**R9.** Quarterdock shall be run in such a way that a bug does not bring down the entire Host OS.

**R10.** Quarterdock should only intercept GPIO calls from the Quarterdock Client, not the entire system.

## Selecting Option for Emulating GPIO
As was outlined previously there are multiple options for intercepting calls to GPIOs in Linux. Each comes with their own pros and cons and differ vastly in when, and how, they intercept calls to hardware. 

All of these options are evaluated in turn in this section.

### Duplicating SysFS with Regular Files
In practice, this approach would only work for very naïve, simple applications and in very specific use-cases.

For the Stopwatch Example Application, manually creating one file per 7-segment display LED might be able to trick the application to simply write out the segment LED values to these files. Since writes to GPIOlib GPIO outputs are done via regular writes, this would simply truncate the file with a new value every time a LED changed value.

However, for the buttons this approach will not work. The Stopwatch Example Application depends on interrupts for the two buttons, and there is simply no way to "press" a button with this approach that will result in a GPIOlib compatible interrupt. The closest thing to file-based interrupts is to listen to changes to a file using the `inotify` API, which is part of the Linux kernel [@inotify]. According to the documentation of `inotify`, it can only intercept changes to files done via the filesystem API. Notably, it explicitly states that "pseudo-filesystems such as /proc, /sys, and /dev/pts are not possible to monitor with inotify". This means that the `inotify` API could not both be used to listen for changes in GPIO input value on both real hardware and on the target hardware.

Using `inotify` when running on a PC and e.g. `poll` (which works on SysFS files) on the real hardware would go against the HAL principle, and break both **R1** and **R2**, since it would mean the application would need to be changed to run on a PC.

### LD_PRELOAD
This approach only works for dynamically linked applications by design, and so breaks the Quarterdock requirement **R5**. Quarterdock should work for both dynamically linked and statically linked applications, as it should not put unnecessary constrains on the Target Application.

### Linux Kernel Driver
Creating a custom Linux kernel driver offers several different options.

Requirement **R9** prohibits running the entirety of Quarterdock itself inside the kernel, as a bug in Quarterdock would risk a "kernel panic" which in turn could bring down the whole system [@kerneldebug].

### FUSE
FUSE can be used as is to implement a filesystem to replace SysFS' GPIOlib without writing any Kernel space code.

While FUSE runs partially in Kernel space, which could hint at breaking **R9**, the actual file system logic runs completely in User space. Even though a bug in the FUSE Kernel module could result in a Kernel Panic, the kernel module is used by many different project and is quite proven.

FUSE can intercept all filesystem calls to a certain mounted volume. As long as we replicate the files and folder structure of GPIOlib, this means that it will work independent of how the filesystem call was made. It doesn't matter if the calling application is statically linked or dynamically linked and it works for all calls, including `poll`, since it intercepts the calls on a filesystem level.

FUSE is the perfect candidate to implement Quarterdock.

## Isolating Quarterdock Clients
Since Quarterdock should not intercept GPIO calls system-wide, only from Quarterdock Clients (**R12**), the Quarterdock Clients needs to be isolated somehow.

Docker offers exactly this type of isolation. It makes is possible to expose the application running inside the Docker container to exactly the environment we want, while still sharing the kernel.
