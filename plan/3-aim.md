# Purpose
Working with embedded software development traditionally means having access to the physical hardware, often in the form of a development kit connected to a PC. 

This thesis sets out to design and, in part, implement a software architecture that enables embedded software developers to develop, debug and test embedded Linux software that access hardware, without access to physical hardware.

## Goal
Some of the questions that this thesis sets out to answer are:

1. Is it possible to set up an environment on a PC which allows an embedded software developer to perform most development related tasks without access to the physical hardware?

2. Is it possible to do this is such an unobtrusive way, so that the exact same program can be run both on the real hardware target and in the emulation environment?

3. Is it possible to represent outputs and stimulate inputs in such an environment to the extent possible with real hardware?