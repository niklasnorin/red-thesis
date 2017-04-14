Hardware input and output in Linux
==================================

SysFS for GPIO
--------------
The SysFS is a Linux kernel driver that exposes hardware inputs and outputs as files in the file system.

Writing a “1” or “0” to the file `/sys/class/gpio/gpio1` sets the output. Reading from the file `/sys/class/gpio/gpio1` reads the value on that pin.

SPI via spidev
--------------
The spidev is a Linux kernel driver that exposes hardware SPI as files in the filesystem. It’s a little bit more complicated to use, as you have to use system call, ioctl, to utilize all functionality.

Pseudo code of a bi-directional transfer would be

```c
io`tl(“/dev/spidev1.0”, SPI_IOC_MESSAGE(1), &data)
```

I2C via i2c-dev
---------------
More or less identical in usage as the spidev SPI driver.