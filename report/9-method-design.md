# Designing an Emulated Hardware Abstraction Layer
The main goal of the architecture is to create an environment where an application targeting an embedded Linux application can run without modification. In this environment, the application will find that interacting with hardware works as if it was running on the real target.

## Features

### Core Features

The software should be able to interact with GPIO's as if they were physically there.

This should be done by:

1. Emulating GPIO hardware in a way transparent to the User space application

2. Stimulate the peripheral ("other") side of emulated inputs and outputs from a 3rd party User space application

The first point is very important for the application to be able to interact with the hardware drivers without any modification. This means that all interfaces needs to be the same as the real hardware, as well as the data passed both ways over those interfaces.

The second point is important for the application to be able to expect the same behavior as it would on the real target. If, for example, an application is expecting to read a specific value from an input after having written to an output, then being able to insert some application logic between the two is essential.

### Additional Features

3. Shall support operating GPIO's as both input and output

4. Shall support interrupts on input change

5. Shall aim to work on as many Linux distributions as possible

6. It should be possible to develop the software on any Host OS

7. It should be possible to write the emulated hardware application in a way that accesses hardware in the same way as the target application. This allows the developer to write emulated hardware code using the exact same language and libraries that he is already using to write his application.

### Optional Features

8. It should be possible to run Quarterdock on real hardware

## Selecting Option for Emulating GPIO
As was outlined in the chapter [ref:Options for Emulating GPIO](?) there are multiple options for intercepting calls to GPIO:s in Linux.

### Duplicating SysFS with Regular Files
In practice, this would only work for very naïve, simple, applications and in very specific use-cases. For example, creating the file `/sys/class/gpio/gpio1/value` might be able to trick an application which simply blinks a LED connected to `gpio1` by writing alternating ones and zeroes. If however the application would depend on `gpio1/value` to generate an interrupt from a button press, then there is no way to "press" the button with this approach.

### Linux kernel modules

### LD_PRELOAD

This approach requires the intercepting code to be recompiled for each targeted platform, and only works for dynamically linked applications. Statically linked applications would have to compile in the library as a type of instrumentation. Compiling with and without it would yield two different binaries.

### FUSE

## Security
The FUSE kernel driver defaults to only allowing the process and user who created the mount, has access to it

The FUSE kernel driver is currently configured with `allow_other`, an option which means that anyone, not only the process and user who created the mount, has access to it.

