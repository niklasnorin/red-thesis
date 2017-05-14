Native software development
=============================

Traditionally, one of the most wide-spread applications are software application which run natively on a PC. These can be word processors, card games or massive industrial process management software suites.

No matter what the software a developer writes, the workflow is usually the same:

1. Write code
2. Compile code
3. Test code by executing it
4. Debug any problems
5. Repeat

Code is targeting the same type of environment as the development computer and is written, compiled, run and debugged on the development computer.

Embedded software development
=============================

From a bird-eye perspective, embedded software development night not seem to differ from native application much.

The workflow is similar:

1. Write code
2. *Cross-compile* code
3. Move code to *target*
4. Test code by executing it
5. Debug any problems
6. Repeat

Embedded software development does differs from native software development in a number of ways however. For a start, the code is typically not intended to be run in the same environment that the developer use to write the code. When working with embedded software, the hardware which is intended to run the software is often referred to explicitly as the *target*. 

Working with another target than the local computer has far reaching implications on the development workflow. Compilation can often no longer be done for the local processor architecture with standard compilers. Most modern laptops and desktops runs on x86 or amd64 processor architectures while modern embedded systems often run on an ARM processor architecture. Instead of using a traditional compiler, a cross-architecture compiler, or cross compiler, is used to build and link a non-native application which can be executed on the target platform, but typically not on the local computer.

Once an executable has been built, it has to be moved to the target before being executed. This is typically done via a memory card, serial link or network connection to the target. This same connection is often used to control the execution of the software on the target.

Debugging embedded software is generally a bit harder to set up than debugging native applications, but very similar once set up correctly. For traditional debugging, which includes setting breakpoints and inspect variables, most embedded development environments come with a way of setting up a remote debug target. GDB, The GNU Project Debugger, for example makes it possible to set up a remote debugging server on the target to which GDB connects. Once connected, GDB can be used in the same way as if developing a native application, often with full IDE, Integrated Desktop Environment, support for setting per-line breakpoints and inspecting memory.

Development environment
=======================


**IDEA** The quality of the link to the target can greatly affect the efficiency of the software development as code iteration cycles will be higher if a SD card is needed for every update rather than a network link.

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