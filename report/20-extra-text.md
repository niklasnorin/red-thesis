- Consider for Appendix

# Other Linux interfaces

- ...and how they could be solved with Quarterdock

## 5.2. SPI via spidev
The spidev is a Linux kernel driver that exposes hardware SPI as files in the filesystem. It’s a little bit more complicated to use than the SysFS based GPIO as you have to use system calls to utilize all functionality.

Pseudo code of a bi-directional transfer would be

```c
iotl(“/dev/spidev1.0”, SPI_IOC_MESSAGE(1), &data)
```

## 5.3. I2C via i2c-dev
More or less identical in usage as the spidev SPI driver.