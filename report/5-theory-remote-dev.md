Remote embedded software development
====================================

Embedded software development differs from software development targeting native desktop or cloud application in a few ways. Embedded software can typically not be executed on the same computer that the code is developed on, but has to be run on a specific *target*. A *target* often refers to a specific architecture and sometimes even to a specific PCB.

In many cases it is not possible to run the embedded software on the development computer due to differences in processor architecture. Most modern computers have x86 or amd64 based processors, while most modern embedded systems have ARM based processors. Compiling can still be done on the developers PC using cross-compilers, but running the resulting executable is often done on target. There are emulators that can execute non-native code, such as running ARM programs on a x86 system, but it's very rare that these emulators supports emulating all attached hardware peripherals.

Local Development - Local Target
--------------------------------
The most common embedded development setup is to have a PC, a desktop or laptop, connected to the embedded target directly via cables.

Compilation 

Flashing target

Debugging

Some common connections are USB, RS232, JTAG and Ethernet. In addition to this, many development and testing scenarios also requires attached instrumentation such as logic analyzers and oscilloscopes.

An advantage of having the hardware locally is that it's possible to access any switches on the board, see LED:s and displays and to disconnect and connect cables to the target freely.

Local Development - Remote Target
---------------------------------
Remotely connect to, and debug, target
SSH
Remote USB-over-Internet
Remote connection to debugger (GDB, Delve etc.)
Current status:
There are available solutions
Relies on real hardware
Needs VPN or port forwarding
No way to stimulate input or see outputs remotely

Remote Development Environment
------------------------------
Remote Desktop IDE
Use Remote Desktop to connect to a Local IDE environment remotely
Shares all aspects with the Local IDE
Discussion:
Several Remote Desktop technologies exist with good screen quality and low latency
Simple to set up
Needs real hardware
Most solutions means 1:1 mapping between developer and remote machine
No way to stimulate input or see outputs remotely

Cloud Development Environment
-----------------------------
Cloud IDE
Use IDE that is hosted online
Shares many aspects with the Local IDE
Could imagine hosted environment with lots of connected hardware
Or connect hardware to the local PC, which connects to the Cloud tools
Potential to expose GPIO’s in a standardize manner 
Current status
Not any available for embedded development that I know of - more research needed

Table of comparison
-------------------
**Create an easy to overview table of pros and cons** 

General comments
----------------
If kits are connected with specialized “shield”, they could potentially expose inputs and outputs to the internet in some way
These shields would most likely need to be designed per each development kit
Latency wise - code stimulating inputs/output would most likely need to execute on, or near, these “shields”