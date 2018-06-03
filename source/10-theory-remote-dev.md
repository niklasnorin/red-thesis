# Remote Embedded Software Development

When working with native application software the developer brings the targeted platform for his application with him wherever he takes his computer. No need to worry about additional hardware, instruments or lab equipment. With a laptop and an internet connection, it is possible to efficiently work on almost any native application from anywhere.

For embedded developers it is often more complicated. If you are lucky, you only need a single development board with a single USB-cable. In this simple case, you only need a padded ESD bag and you're good to go.

In many cases, taking the system to-go is simply not an option because of size of the system, because of the instrumentation needed or because it is not possible to test it on the real system at all. When, for example, a developer is writing embedded software for a prototype car, it might not be feasible to bring the prototype car home, just to work from home.

![Different embedded software development setups \label{3}](source/figures/3.png)

There are several solutions to working with most embedded software development remotely, as illustrated in Figure \ref{3}. For reference, we will first talk about working in a local environment.

## Local Development - Local Target
The most common embedded development setup is to have a PC, a desktop or laptop, connected to the embedded target directly via cables. In addition to this, any instrumentation, connectivity or power needed can be connected directly to the boards making up the setup.

Most embedded targets, whether they are development kits or custom made boards, can be connected to the developer's computer or local network directly. Some common connections are USB or JTAG for connecting directly to a target, or RS232 and Ethernet to provide a serial console, SSH connection or general internet connectivity.

In addition to this, many development and testing scenarios also require attached instrumentation such as logic analyzers or oscilloscopes. These are crucial tools in debugging complex problems for embedded systems. Sometimes being able to listen in on the digital inputs and outputs of an embedded system can offer far clearer insights than any application log can do.

The main embedded software development workflow is the same as was previously shown in Figure \ref{2_2}.

Cross-compiling is done on the developer's computer, the resulting binaries are transferred locally to the target and the application executed, debugged and observed by the developer in real-time.

When it comes to testing the application on the target on a system level, the developer can in many cases simply lean over to press a button and observe if he sees the appropriate behavior. If it is not the desired behavior, then the code is changed and the process is repeated again.

## Local Development with Remote Target
Many modern development environments use Internet Protocol, IP, related technology to flash and debug embedded targets [@gdb]. This means that there is no theoretical limitation to only accessing these targets locally. Any target available via Ethernet on the local network can easily be configured to be available remotely via a VPN, Virtual Private Network.

This means that the local development environment can be the same, with the same compiler, debugging tools etc. as being used as with a local target.

The most convenient part of working with a remote target is that even if it requires a complex power and network connectivity setup, it does not need to be carried along. It can be set up at the remote location, and then accessed from anywhere.

One of the downsides of a remote target is that it's not possible to interact with it. If the target needs human interaction to work, e.g. the push of a button, then working with it remotely could be a no-go.

Similarly, having a remote target is also not very efficient when it comes to instrumentation. While some high-end lab instruments might be remotely accessible, most are not. Also, observing or stimulating the target directly is generally not possible. This means that while the developer has access to programming and running code on the target, it might not be easy to debug or test the complete system.

Another element of embedded software development not to be neglected is that to reset the target to a known state, it's often necessary to power cycle the system or disconnected and reconnect a cable. While this is very easy when the system is locally available, this might not be possible when working with a remote target.

With all this being said, there has been tremendous progress is remotely deploy embedded software. Services such as Resin.io [@resin] makes it possible to deploy almost any code written locally to a remote target.

## Remote Desktop
A third option to working with a complicated hardware setup remotely is via a remote desktop software. Remote desktop software works by sharing the screen, mouse and keyboard remotely over the internet with another computer. The computer which desktop is being shared is referred to as the server, and the computer accessing it the client. When connected, the client can work as if sitting in from of the server computer.

One potential major upside is that the client computer does not need to have any other software installed than the a remote desktop client software. All software will have to be installed on the server computer. In the case that the server computer is actually the developer's stationary work station, this means that he can work with the exact same computer setup locally and remotely.

Some of the other upsides are the same as when working with local development towards a remote target, since the server will act a local development environment to the user. One difference compared to the remote target workflow is that even if the target hardware does not support working remotely natively (e.g. over Ethernet), it can simply be connected to a server locally, and then still be worked with remotely by the client.

One downside of this solution is that it only works if you have a stable and relatively high-throughput and low-latency internet connection to work over. Another major downside is that you have to have two computers, one that's constantly connected to the target, and one client to work remotely from. For many use-cases and remote desktop client, the server can also only serve one client at a time, so it will scale poorly.

With regards to instrumentation and local access for testing etc. this method has the same pros and cons as the remote target solution.

## Cloud Development Environment
Online word processors, such as Google Documents, have been available for a while. Lately, mainly in web programming, whole online development environments are now available [@cloud9].

Working completely through a webpage, with backing services, has the benefit of not having to set up anything on the local machine. The IDE and debugger are part of the webpage, and compilation can be done on the server side of the solution, potentially using extremely powerful and scalable infrastructure.

One downside to this is that there is not a lot of widespread adopted browser support to communicate directly with hardware, most likely due to security concerns. Because of this, development environments that do connect to hardware often comes with some kind of plugin or client software that also needs to be installed. However, there are some initiatives to overcome this, for example, be able to use USB devices from the browser [@webusb].
