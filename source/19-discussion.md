# Discussion

The work presented in this thesis is very relevant given the existing popularity, and the rising trend, of embedded devices running Linux. It enables developers to run embedded software without running it on the Target device, which could help to shorten development time.

Being able to programmatically stimulate inputs and read outputs is exactly what is needed to, for example, automatically run integration tests on code for every code change. This reduces the chances of regression bugs and gives the developer more confidence to change legacy code. Being able to control inputs programmatically also allows for parameterized testing in ways not possible before. Questions such as "What happens if I press the button with 10, 100, 200, 300, 400, 500ms interval?" are suddenly a lot easier to answer.

That said, the solution presented in this thesis is just a stepping stone. Due to scope and time limitations, it only implements a small subset of what the architecture itself allows.

## Limitations and future improvements
Below follows some known limitations and suggestions for future improvement or work.

### Fulfilling the Entire GPIOLib Interface
Currently, `GpioFS` does not support unexporting exported GPIO:s, nor does it support the `active_low` GPIO primitive. There is also very little sanity checking on the existing functionality.

In addition to this, the error messages and return codes produced by `GpioFS` has not been compared to that of GPIOlib. Since this should be considered part of the API, it needs to be implemented if errors are to be handled the same on real hardware as on Quarterdock.

### Lack of GPIO Ownership
Although each instance of a Quarterdock Client has their own private GPIO configuration (`direction`, `edge` etc.) the `value` is a shared resource. There is currently no access control to the `value`, nor even a sanity check of `direction` before updating `value` on write.

This means that in the most common use-case, where one client configures a pin as an output and a second one listens on that same pin configured as an input, then there's nothing stopping the input-listener to accidentally change the value of `value`.

If ownership of a pin would be desirable, This could be implementing by expanding the configuration options of Quarterdock.

### Lack of GPIO Mapping
It is not possible to map one pin in one Client to another pin number in another Client in Quarterdock. Because of the way `MemDB` work, e.g. accessing the key `/gpio3/value` in any Client will get the same value. This means that it is not currently not possible to connect e.g. `/gpio3/value` on one Client to `/gpio11/value` on another.

As a consequence of this, it is currently not possible to write a generic Emulated Hardware Application to emulate hardware, such as a generic 7-segment display. This is because different Target boards has different pinouts, and it simply can't be expected that the display can always be connected to pins XYZ.

Adding the possibility to map the pins of the Target Application to any other pin of the hardware emulator would enable this. This could be done by adding one layer of indirection in Quarterdock together with a per-Client pin configuration.

### GPIOLib on Linux PC
Because the `boot2docker` Virtualbox image used did not have GPIOlib support, and so no `/sys/class/gpio` folder, it was not possible to mount a `GpioFS` instance directly to it. To work around this, the whole `/sys/class` folder was bind-mounted. This in turn means all access to other `/sys/class` resources, except `GpioFS` in the Quarterdock Client, are essentially blocked.

This could potentially be fixed by creating a empty SysFS kernel module which exposes something in `/sys/class/gpio`. It doesn't matter what the content would be, since it is only the folder itself that would be used when bind mounting.

Note that if Quarterdock is used on a embedded Target device, then bind mounting directly to `/sys/class/gpio` is possible, since it would include GPIOlib support.

### Add support for new GPIO character device API
The SysFS GPIOLib driver is deprecated and replaced by a GPIO character driver [@gpio-character-driver]. The new driver offer several improvements of the existing driver.



### Support More Hardware Interfaces
It is conceivable that the same principle used to emulate GPIO:s in this work could be extended to support emulating other types of hardware access as well. Since everything is a file in Linux, supporting emulating SPI, I2C, UART and more should be possible.

This has not been researched more in this thesis other than it would most likely include extending go-fuse to support `ioctl` calls, just as it was extended to support `poll`.

### Security
The FUSE kernel driver defaults to only allowing the process and user who created the mount, has access to it. The FUSE kernel driver is currently configured with `allow_other`, an option which means that anyone, not only the process and user who created the mount, has access to it.

A solution to this could be to pass the UID, User ID, and GID, Group ID, of users that should have access to Quarterdock. Quarterdock could then use the FUSE context, that is passed with every FUSE request, to check the user agains an access list.

### Performance of FUSE
FUSE can be slow or fast to use depending on the use-case [[#](https://www.usenix.org/system/files/conference/fast17/fast17-vangoor.pdf)], but no benchmarking has been done as part of this thesis.

Writing to GPIO:s goes through several layers of kernel code, but so does FUSE. It would be interesting to do future work to characterize exactly what kind of latencies there are between Quarterdock Clients.

### Run as Native SysFS Linux Kernel Module Driver
Instead of using FUSE, it could be possible to create a native SysFS module which contains logic for:

1. Exposing arbitrary GPIOlib compatible folders
2. Support mapping the GPIO:s in these folders to each other
3. Support "GPIO passthrough" to write to the real GPIO:s

This module would be exposed not in `/sys/class/gpio`, but for example in `/sys/class/gpio-emu` to not clash with GPIOlib. The later could still be exposed to the application at `/sys/class/gpio` using the same bind-mounting in Docker technique that was used with Quarterdock.

This would probably be faster than FUSE. However, it would require the the development of a custom kernel module. Also, if any decisions or routing should be dynamically configurable in User space, then it would still require a Kernel module to User space interface, something that FUSE already provides as part of its implementation.

### Docker Volume Driver
Docker Compose is currently used to setup the Quarterdock and Quarterdock Client containers.

A future work that could be worth looking into is to implement a custom Docker Volume Driver. This could make it easier to configure and add a Quarterdock `GpioFS` volume to any Docker container, without having to explicitly create a host filesystem mount, and then bind mounting it into the Quarterdock Client's Docker container.
