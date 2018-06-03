# Result

This thesis has shown that it is possible to create an artificial environment where an embedded software application can interact with GPIO hardware via the SysFS GPIOlib API as if they were present. Using this artificial environment, a developer can develop and test embedded software applications that rely on GPIO interactions on a regular PC, without having access to the physical Target device. The embedded software application can do this, and then be run without modification on the Target device.

Furthermore, this thesis has also shown that, using this same core architecture, it is possible to create an application which emulates the behavior of the "other end", or the external electronics. Using this architecture, it is possible to give output GPIOs a rich representation as well as exposing inputs in such a way that they can be stimulated in the same way as physical GPIOs, and more.

Both the application environment and the emulated hardware environment of Quarterdock are shown in Figure \ref{11}.

![Quarterdock \label{11}](source/figures/11.png)
