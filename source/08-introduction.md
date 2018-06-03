# Introduction

## Background
The traditional definition of a personal work place as a desk in a cubical is slowly, but surely, on its way to be a thing of the past. The amount of people working remotely, both self-employed and not, has exploded in the wake of the dramatic increase of widely available, often free, internet connectivity. More than 13.4 Million people in the U.S. are already working remotely at least one day a week [@us-census-home-workers], representing almost 10% of the working population.

The ability to work remotely is very much decided on what kind of work you do. Most non self-employed people who work remotely today only need access to a computer to get their job done. In the engineering community, working remotely has no impediment in areas such as architecture, electronic CAD or in most software development roles. The more dependent you are on having access to other tools than your computer however, the less likely you are to be able to work remotely, even if that would be desirable both for the employee and employer.

Within the area of electrical engineering, embedded software development is a line of work that very often relies heavily on other tools than just a computer. It comes with the territory, working with electronics is bound to put you in front of a logic analyzer as well as one development board or another some day. The more hardware and tools, the less the likelihood of being able to work remotely or, at the very least, increased friction of starting to do so. Dragging kits and equipments to and from work is not only tedious, it also brings with it the risk of physical breakage or ESD related damages of both hardware and tools. In addition, not everyone has the option of having a permanent electronics lab at home, so starting to work often means setting everything up and, at the end of the workday, packing it all up again.

The aim of this thesis is to define and, in part, implement, a suggestion for an architecture that would enable embedded software developers to remotely develop, debug and test real embedded software. This thesis will peer into existing work, look into the pros and cons of emulation versus real hardware, take a deep-dive into developing and debugging SW on a remote target and look into how to stimulate inputs and view outputs remotely. It will also take a look into attaching virtual tools to the target, such as logic analyzers or serial port emulators.

The architecture itself will be developed with the latest advances in mind, in everything from scalable software containers to combined MCU-FPGA systems. The intention is to come up with an architecture that covers the most common use-cases of modern embedded software development as well as one that can scale from one remote developer to thousands.

## Purpose
Working with embedded software development traditionally means having access to the physical hardware, often in the form of a development kits and instruments connected to a PC, as shown in Figure \ref{1_2}.

This thesis sets out to design and, in part, implement a software architecture that enables embedded software developers to develop, debug and test embedded Linux software that accesses hardware, without access to physical hardware.

![Development without access to hardware \label{1_2}](source/figures/1_2.png)

## Goal
Some of the questions that this thesis sets out to answer are:

1. Is it possible to set up an environment on a PC which allows an embedded software developer to perform most development related tasks without access to the physical hardware?

2. Is it possible to do this in such an unobtrusive way, so that the exact same program can be run on the real hardware target and in the emulation environment?

3. In such an environment, is it possible to represent outputs, and to stimulate inputs, to at least the same degree as with real hardware?

## Limitation of Scope
To be able to focus on the core innovative aspects of the work, this report sets some strong limitations on scope.

### Linux
This thesis will only look into embedded software built on top of the Linux kernel. Namely, this excludes microcontrollers.

### Local Target
The solution that this thesis sets out to design will focus on replacing local development, on a local target, on the developer's PC.

Working with remote targets is described in the theory part of the thesis, this to provide a more comprehensive picture of the options available to developers today.

### Processor Architecture
Many embedded systems use the ARM architecture [@arm-roadshow-slides], while most computers used by developers are x86 [@ee-time-x86-marketshare]. This means that to run a compiled program targeting an ARM architecture on the developers PC, it either needs to be cross-compiled or run through an emulator.

Because of time constraints, the evaluation software used to evaluate the architecture in this thesis uses a interpreted programming language, instead of a compiled one. This works by having a piece of software called an interpreter (compiled specifically for each architecture) parses and executes the code on the fly.

This setup means that the exact same code can be executed both on a PC and on the target without any modification, without cross-compilation and without having to use an emulator.

### GPIO
While the architecture developed in this work aim to be open ended with regards to possible hardware to emulate, the main focus will be on emulating both ends of GPIOs.

### Digital Signals
The instrumentation and hardware emulation in this thesis focus on digital emulation of signals and communication channels.
