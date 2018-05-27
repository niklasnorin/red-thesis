# Abstract {.unnumbered}

<!-- This is the abstract -->

Developing software for embedded devices typically requires physical access to a target device to test and debug the application. This makes everything from developing remotely to automated integration testing of embedded software more complex than software that can run locally.

This thesis designs, and partially implements, an architecture for running some embedded Linux application on a regular PC, without access to the target device. This thesis shows how a standard Linux User space filesystem, in the right environment, can be used to emulate the most common User space GPIO interface in Linux, SysFS. Furthermore, this thesis sets up a template for how this architecture can be used to run both the embedded application and an application emulating the connected hardware.

\pagenumbering{roman}
\setcounter{page}{1}
