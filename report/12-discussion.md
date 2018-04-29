# Discussion

- Make sure there's no new information here or in the result
- Programmatically access to IO stimulus can be superior to having full local access with real hardware for testing purposes
- go-fuse fork to add polling. A not unsubstantial amount of time was spent to understand the Linux filesystem, FUSE how polling behaves.

## Limitations and future improvements

### Fulfill the entire GPIOLib interface
- Add support for `active_low`
- Add support for `unexport`
- Add GPIOLib error messages

### Lack of GPIO ownership
Although each instance of a Quarterdock Client has their own private GPIO configuration (`direction`, `edge` etc.) the `value` is a shared resource. There is no access control to the `value`, nor even a sanity check of `direction` before updating `value` on write.

This means that in the most common use-case, where one client configures a pin as an output and a second one listens on that same pin configured as an input, then there's nothing stopping the input-listener to accidentally change the value of `value`.

This could be implementing by expanding the configuration options of Quarterdock.

### Lack of GPIO mapping
It is not possible to map one pin in one Client to another pin in another Client in Quarterdock.

This means that it's currently impossible to write a generic Quarterdock Client to emulate hardware, as each board has a unique pinout.

Adding the possibility to map the pins of the Target Application to any other pin of the hardware emulator would enable this. This could be done by adding one layer of indirection in Quarterdock together with a per-Client pin configuration.

### Support More Hardware Interfaces
It is conceivable that the same principle used to emulate GPIO:s in this work could be extended to support emulating other types of hardware access as well. Since everything is a file in Linux, supporting emulating SPI, I2C, UART and more should be possible.

This has not been researched more in this thesis other than it would most likely include extending go-fuse to support `ioctl` calls, just as it was extended to support `poll`.

### GPIOLib on Linux PC

- Clean this up based on duplicate info in impl. section

The `boot2docker` Virtualbox image that was used was not built with GPIOLib support, and as such had no `/sys/class/gpio` folder. Since it didn't exist, it's impossible to bind-mount it. Because `/sys` is a special file system, it's not possible to just create a folder.

To work around this, the whole `/sys/class` folder was bind-mounted, which means no access to other `/sys/class` resources when running on a PC.

This could be fixed by creating a empty SysFS kernel module which exposes something in `/sys/class/gpio` . It doesn't matter what the content would be, since it is the folder itself that would be used when bind mounting.

Note that when quarterdock is used on a target device, then bind mounting directly to `/sys/class/gpio` is possible.

### Security
The FUSE kernel driver defaults to only allowing the process and user who created the mount, has access to it

The FUSE kernel driver is currently configured with `allow_other`, an option which means that anyone, not only the process and user who created the mount, has access to it.

This is not a problem for a developer PC, but could be a problem if run on a shared server.

A solution to this could be to pass the UID, User ID, and GID, Group ID, of users that should have access to Quarterdock. Quarterdock could then use the FUSE context, that is passed with every FUSE request, to check the user agains an access list.

### Performance of FUSE

- Mention https://www.usenix.org/system/files/conference/fast17/fast17-vangoor.pdf

FUSE is apparently notorious for being slow [[#](?)] but no benchmarking has been done.

### Run as Native SysFS Linux Kernel Module Driver

Instead of using FUSE, create a native SysFS module which contains logic for
1. Exposing arbitrary GPIOlib compatible folders
2. Support mapping the GPIO:s in these folders to each other
3. Support "GPIO passthrough" to write to the real GPIO:s

This module would be exposed not in `/sys/class/gpio`, but for example in `/sys/class/gpio-emu` to not clash with GPIOlib. The later could still be exposed to the application at `/sys/class/gpio` using the same bind-mounting in Docker techniqiue that was used with Quarterdock.

This would probably be *a lot* faster than FUSE. However, it would require the kernel module to be compiled for each platform. Also, if any decisions or routing should be dynamically configurable in User space, then it would still require a Kernel module to User space interface, something that FUSE already provides as part of its implementation.

### Docker Volume Driver
- Implement a Quarterdock Docker Volume Driver. This could make it super easy to add a Quarterdock to any Docker container, without having to explicitly create a host filesystem mount, and then bind mounting it into the Quarterdock Client's Docker container.