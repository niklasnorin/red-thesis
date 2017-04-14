Connecting and debugging hardware remotely
==========================================

Local Development - Local Target
--------------------------------
Most common use case is that the developer has a local development environment already and connects to a development kit locally. This would be the reference case.

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

General comments
----------------
If kits are connected with specialized “shield”, they could potentially expose inputs and outputs to the internet in some way
These shields would most likely need to be designed per each development kit
Latency wise - code stimulating inputs/output would most likely need to execute on, or near, these “shields”