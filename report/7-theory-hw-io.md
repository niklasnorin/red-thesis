Hardware input and output in Linux
==================================

SysFS and GPIOlib for user-space GPIO
--------------
While all direct hardware access is restricted to the kernel, the SysFS is a generic Linux kernel facility that enables exposing kernel data structures an attributes to user space.

GPIOlib is built on top of SysFS and specifies an API to expose and interact with individual GPIO's.

### Exposing a GPIO
The user can expose a GPIO by writing the GPIO number to `/sys/class/gpio/export`. This will make GPIOlib look through all registred GPIO drivers and, if the GPIO is valid, expose it as a folder under `/sys/class/gpio/gpioN`, where N is the GPIO number.

The content of this folder is related to the GPIO's functionality. It will have files for setting direction, reading the value and changing the value of the GPIO.

### Configuring GPIO direction
Most GPIO's will be able to be configured either as an input or an output. This functionality is exposed as `/direction` underneath the GPIO's folder.

Writing `in` to the direction file will configure it as an input, while writing `out` will configure it as an output.

### Input and output
The current state of the GPIO is exposed underneath `/value`. 

If the GPIO is an output, then writing a `1` to it will set the output to logic high. Writing a `0` will set it to logic zero. Reading the `/value` will return the current output state.

If the GPIO is configued as an input, then reading `/value` will return the current state of the GPIO. 

### Listening to interrupts
Many input pins supports listening to interrupts. This functionality is configured via the `/edge` file. This attribute can be set to `falling` to trigger on falling edge, `raising` to trigger on raising edge or `both` to trigger on both. Setting it to `none` disables interrupt detection.

The configuration above only enables the underlying interrupt. Listening on the file itself is done via Linux `poll`, which is a command that can be used to wait on arbitrary files. When `poll` returns an event, it means that an interrupt has been triggered.

SPI via spidev
--------------
The spidev is a Linux kernel driver that exposes hardware SPI as files in the filesystem. It’s a little bit more complicated to use than the SysFS based GPIO as you have to use system calls to utilize all functionality.

Pseudo code of a bi-directional transfer would be

```c
iotl(“/dev/spidev1.0”, SPI_IOC_MESSAGE(1), &data)
```

I2C via i2c-dev
---------------
More or less identical in usage as the spidev SPI driver.