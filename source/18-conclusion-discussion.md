# Conclusion and Discussion

This thesis has shown that it is possible to create an artificial environment where an embedded software application can interact with GPIO hardware via the SysFS GPIOlib API as if they were present. Using this artificial environment, a developer can develop and test embedded software applications that rely on GPIO interactions on a regular PC, without having access to the physical Target device. The embedded software application can do this, and then be run without modification on the Target device.

Furthermore, this thesis has also shown that, using this same core architecture, it is possible to create an application which emulates the behavior of the "other end", or the external electronics. Using this architecture, it is possible to give output GPIOs a rich representation as well as exposing inputs in such a way that they can be stimulated in the same way as physical GPIOs, and more.

Both the application environment and the emulated hardware environment of Quarterdock are shown in Figure \ref{11}.

![Quarterdock \label{11}](source/figures/11.png)

The work presented in this thesis is very relevant given the existing popularity, and the rising trend, of embedded devices running Linux. Quarterdock enables developers to run embedded software that uses GPIOs on their local PC, without having to have an attached Target device.

The biggest shortcoming of the evaluation of the architecture presented in this thesis is that it was never tried on real hardware. Given more time, it would have been very interesting to setup the hardware needed to, for example, run the Stopwatch example on both real hardware and inside Quarterdock.

Quarterdock makes it possible to programmatically stimulate inputs and read outputs. This opens up a lot of new possibilities in test automation. For example, it makes it possible to easily create integration tests with a lot of different combinations of input parameters, so called parameterized tests. Questions such as "What happens if I press the button with 10, 100, 200, 300, 400, 500ms interval?" are suddenly a lot easier to answer. Furthermore, running these kind of tests automatically on every code change could reduce the chances of regression bugs and gives the developer more confidence to change legacy code.

Due to scope and time limitations, this thesis only implements the minimum of features needed to run an application using GPIOs, and an emulated hardware application which emulates the peripheral end of those GPIOs.

The solution presented in this thesis is just a stepping stone. Using FUSE to emulate hardware devices holds a lot of potential, which this thesis has hopefully illustrated. Hopefully the architecture presented here can act as a inspiration for further research into the field in the future.

## Limitations and future improvements
Below follows some known limitations and suggestions for future improvement or work.

### Fulfilling the Entire GPIOLib Interface
Currently, `GpioFS` does not support unexporting exported GPIOs, nor does it support the `active_low` GPIO primitive.

In addition to this, the error messages and return codes produced by `GpioFS` have not been compared to that of GPIOlib. Since this should be considered part of the API, it needs to be implemented if errors are to be handled the same on real hardware as on Quarterdock.

### Lack of GPIO Ownership
Although each instance of a Quarterdock Client has their own private GPIO configuration (`direction`, `edge` etc.) the `value` is a shared resource. There is currently no access control to the `value`, nor even a sanity check of `direction` before updating `value` on write.

This means that in the most common use-case, where one client configures a pin as an output and a second one listens on that same pin configured as an input, there is nothing stopping the input-listener to accidentally change the value of `value`.

If ownership of a pin is desirable, this would be implementing by expanding the configuration options of Quarterdock.

### Lack of GPIO Mapping
It is not possible to map one pin in one Client to another pin number in another Client in Quarterdock. Because of the way `MemDB` works, e.g. accessing the key `/gpio3/value` in any Client will get the same value. This means that it is not currently possible to connect e.g. `/gpio3/value` on one Client to `/gpio11/value` on another.

As a consequence of this, it is currently not possible to write a generic Emulated Hardware Application to emulate hardware, such as a generic 7-segment display. This is because different Target boards have different pinouts, and it cannot be expected that the display will always be connected to pins XYZ.

Adding the possibility to map the pins of the Target Application to any other pin of the hardware emulator would enable this. This could be done by adding one layer of indirection in Quarterdock together with a per-Client pin configuration.

### GPIOLib on Linux PC
Because the `boot2docker` Virtualbox image used did not have GPIOlib support, and so no `/sys/class/gpio` folder, it was not possible to mount a `GpioFS` instance directly to it. To work around this, the whole `/sys/class` folder was bind-mounted. This in turn means all access to other `/sys/class` resources, except `GpioFS` in the Quarterdock Client, are essentially blocked.

This could potentially be fixed by creating an empty SysFS kernel module which exposes something in `/sys/class/gpio`. It doesn't matter what the content would be, since it is only the folder itself that would be used when bind mounting.

Note that if Quarterdock is used on a embedded Target device, then bind mounting directly to `/sys/class/gpio` is possible, since it would include GPIOlib support.

### Add new GPIO Character Device API
The SysFS GPIOLib driver is deprecated and replaced by a GPIO character driver [@gpio-character-driver]. The new driver offers several improvements to the existing driver.

It should be possible to add support for it using CUSE, Character driver in USEr space [@cuse].

### Support More Hardware Interfaces
It is conceivable that the same principle used to emulate GPIOs in this work could be extended to support emulating other types of hardware access as well. Since everything is a file in Linux, supporting emulating SPI, I2C, UART and more should be possible.

This has not been researched more in this thesis other than it would most likely include extending go-fuse to support `ioctl` calls, just as it was extended to support `poll`.

### Security
The FUSE kernel driver defaults to only allowing the process and user who created the mount to have access to it. The FUSE kernel driver is currently configured with `allow_other`, an option which means that anyone, not only the process and user who created the mount, has access to it.

A solution to this could be to pass the UID, User ID, and GID, Group ID, of users who should have access to Quarterdock. Quarterdock could then use the FUSE context, that is passed with every FUSE request, to check the user against an access list.

### Performance of FUSE
FUSE can be slow or fast to use depending on the use-case [@fuse-speed], but no benchmarking has been done as part of this thesis.

Writing to GPIOs goes through several layers of kernel code, but so does FUSE. It would be interesting to do future work to characterize exactly what kind of latencies there are between Quarterdock Clients.

### Native SysFS Linux Kernel Module Driver
Instead of using FUSE, it could be possible to create a native SysFS module which contains logic for:

1. Exposing arbitrary GPIOlib compatible folders
2. Support mapping the GPIOs in these folders to each other
3. Support "GPIO passthrough" to write to the real GPIOs

This module would be exposed not in `/sys/class/gpio`, but for example in `/sys/class/gpio-emu`, to not clash with GPIOlib. The later could still be exposed to the application at `/sys/class/gpio` using the same bind-mounting technique that was used with Quarterdock.

This would probably be faster than FUSE. However, it would require the the development of a custom kernel module. Also, if any decisions or routing should be dynamically configurable in User space, then it would still require a Kernel module to User space interface, something that FUSE already provides as part of its implementation.

### Docker Volume Driver
Docker Compose is currently used to setup the Quarterdock and Quarterdock Client containers.

A future work to look into is to implement a custom Docker Volume Driver. This could make it easier to configure and add a Quarterdock `GpioFS` volume to any Docker container, without having to explicitly create a host filesystem mount, and then bind mounting it into the Quarterdock Client's Docker container.
