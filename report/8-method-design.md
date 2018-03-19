# Designing an Emulated Target Environment Architecture

The main goal of the architecture is to create an environment where an application targeting an embedded Linux platform can run without modification. In this environment, the application will find that interacting with hardware works as usual. It should be able to interact with GPIO's exposed via SysFS and GPIOlib as if they were physically there.

This will be done by:

1. Emulating select hardware API's in a way transparent to the user-space application
2. Stimulate the peripheral ("other") side of emulated inputs and outputs from a 3rd party user-space application

The first point is very important for the application to be able to interact with the hardware drivers without any modification. The second point is important for the application to be able to expect the same behavior as it would on the real target.

## Additional requirements

- Should not need a special kernel. This enables Quarterdock to run on almost any target.
- Should be able to write any Quarterdock emulator application as if writing an embedded application.

## Hardware Abstraction Layer
The main idea with an hardware abstraction layer is to decouple the application facing hardware interfaces from the actual hardware. This is a very common pattern used both on small MCU's and on Linux. It makes it possible to run the same code on several platforms without having to worry about the underlying hardware being different.

SysFS together with GPIOlib, described in the previous chapters, is a perfect example of this. No matter the underlying platform, accessing GPIOs is done in the exact same way on Linux. The application wouldn't have to change when using a different platform, except possibly to be configured to use different GPIOs on different hardware.

## Selecting option for Emulating GPIOs

### Duplicating SysFS with Regular Files
In practice, this would only work for very naïve, simple, applications and in very specific use-cases. For example, creating the file `/sys/class/gpio/gpio1/value` might be able to trick an application which simply blinks a LED connected to `gpio1` by writing alternating ones and zeroes. If however the application would depend on `gpio1/value` to generate an interrupt from a button press, then there is no way to "press" the button with this approach.

### Linux kernel modules

### LD_PRELOAD

This approach requires the intercepting code to be recompiled for each targeted platform, and only works for dynamically linked applications. Statically linked applications would have to compile in the library as a type of instrumentation. Compiling with and without it would yield two different binaries.

### FUSE

## Security
The FUSE kernel driver defaults to only allowing the process and user who created the mount, has access to it

The FUSE kernel driver is currently configured with `allow_other`, an option which means that anyone, not only the process and user who created the mount, has access to it.

