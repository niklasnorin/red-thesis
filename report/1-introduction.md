# Introduction

## Background
The traditional definition of a personal work place as a desk in a cubical is slowly, but surely, on its way to be a thing of the past. The amount of people working remotely, both self-employed and not, has literally exploded in the wake of the dramatic increase of widely available, often free, internet connectivity. 3.7 Million people in the U.S. is already working remotely at least half of the time (US Census Bureau) and working from home among non-self-employed is up more than 100% since 2005. When given the choice, as many as 80-90% of the US workforce said that they would choose to do so if they could.

The ability to work remotely is very much decided on what kind of work you do. Most non-self-employed people who work remotely today only need access to a computer to get their work done. In the engineering work community, working remotely is no impediment in areas such as architecture, electronic CAD or in most software development roles. The more dependent you are on having access to other tools than your computer however, the less likely you are to be able to work remotely, even if that would be desirable both for the employee and employer.

Within the area of electrical engineering, embedded software development is just one area of engineering that very often rely heavily on other tools than just a computer. It comes with the territory, working with electronics is bound to put you in front of a logic analyzer as well as one development board or another some day. The more hardware and tools, the less the likelihood of being able to work remotely or, at the very least, increased friction of starting to do so. Dragging kits and equipments to and from work is not only tedious, it also brings with it the risk of physical breakage or ESD related damages of both hardware and tools. In addition, not everyone has the option of having a permanent electronics lab at home, so starting to work often means setting everything up and wrapping it up means packing it all up again.

The aim of this thesis is to define and, in part, implement, a suggestion for an architecture that would enable embedded software developers to remotely develop, debug and test real embedded software. This thesis will peer into existing work, look into the pros and cons of emulation versus real hardware, take a deep-dive into developing and debugging SW on a remote target as well as looking into how to stimulate inputs and view outputs remotely. It will also take a look into attaching virtual tools to the target, such as logic analyzers or serial port emulators.

The architecture itself will be developed with the latest advances in mind, in everything from scalable software containers to combined MCU-FPGA systems. The intention is to come up with an architecture that covers the most common use-cases of modern embedded software development and one that can scale from one remote developer to thousands.

## Purpose
Working with embedded software development traditionally means having access to the physical hardware, often in the form of a development kit connected to a PC.

This thesis sets out to design and, in part, implement a software architecture that enables embedded software developers to develop, debug and test embedded Linux software that access hardware, without access to physical hardware.

![](/thesis/report/assets/1_2.png)

## Goal
Some of the questions that this thesis sets out to answer are:

1. Is it possible to set up an environment on a PC which allows an embedded software developer to perform most development related tasks without access to the physical hardware?

2. Is it possible to do this is such an unobtrusive way, so that the exact same program can be run both on the real hardware target and in the emulation environment?

3. Is it possible to represent outputs and stimulate inputs in such an environment to the extent possible with real hardware?

## Limitation of Scope
To be able to focus on the core innovative aspects of the work, this report sets some strong limitations on scope.

### Linux
This thesis will only look into embedded software built on top of the Linux kernel. Namely, this excludes microcontrollers.

### Local Target
The solution that this thesis sets out to design will focus on replacing local development, on a local target, on the developers PC.

Working with remote targets are described in the theory part of the thesis though, this to provide a more comprehensive picture of the options available to developers today.

### Processor Architecture
Most embedded systems uses the ARM architecture [[#](?)], while most computers used by developers are x86 or AMD64 [[#](?)]. This means that to run a compiled program targeting an ARM architecture on the developers PC, it either needs to be cross-compiled or run through an emulator.

Because of time constraints, the evaluation software used to evaluate the architecture in this thesis uses a so called interpreted programming language, instead of a compiled one. This works by having a piece of software called an interpreter (compiled specifically for each architecture) parse and executes the code on the fly.

This setup means that the exact same code can be executed both on a PC and the target without any modification, without cross-compilation and without having to use an emulator.

### Digital Signals
The instrumentation and hardware emulation in this thesis focuses on digital emulation of signals and communication channels.

## Tools

*TODO*
- Add hardware that will be used in the hardware demo
- The tools needed to reproduce what's in this thesis (software & hardware)

## Source Code
*TODO*
- Decide what do to with the source code

It has yet to be decided if the source code which was written as a part of this work will be released as open-source after the publication of this thesis.

The frameworks, concepts and libraries used in the solution are thoroughly documented.

## Abbreviations and Acronyms

**GPIO** - General Purpose Input Output
**FUSE** - Filesystem in Userspace. Also the name of the actual kernel driver.
**Target** - The real embedded hardware which is the target platform for embedded software.