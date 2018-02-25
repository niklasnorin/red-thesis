# 2. Software development

## 2.1. Native application software development
Traditionally, one of the most wide-spread applications are software application which run natively on a PC. These can be word processors, card games or massive industrial process management software suites.

No matter what the software a developer writes, the workflow for a compiled language is usually the same:

1. Write code
2. Compile code
3. Test code by executing it
4. Debug any problems
5. Repeat

The program is targeting a similar type of environment as the software developers computer and is written, compiled, run and debugged on the developers computer.

## 2.2. Embedded software development
From a bird-eye perspective, embedded software development might not seem to differ much from native application software development

The workflow is similar:

1. Write code
2. *Cross-compile* code
3. Move code to *target*
4. Test code by executing it
5. Debug any problems
6. Repeat

Most modern laptops and desktops runs on x86 or amd64 processor architectures while modern embedded systems often run on an ARM processor architecture. Instead of using a traditional compiler, a cross-architecture compiler, or cross compiler, is used to build and link a non-native application which can be executed on the target platform, but typically not on the local computer.

When working with embedded software, the hardware which is intended to run the software is often referred to explicitly as the *target*. Once an executable has been built, it has to be moved to the target before being executed. This is typically done via a memory card, serial link or network connection to the target. This same connection is often used to control the execution of the software on the target. Working with another target than the local computer has far reaching implications on the development workflow.

Debugging embedded software is also generally a bit harder to set up than debugging native applications, but very similar once set up correctly. For traditional debugging, which includes setting breakpoints and inspect variables, most embedded development environments come with a way of setting up a remote debug target. GDB, The GNU Project Debugger, for example makes it possible to set up a remote debugging server on the target to which GDB connects. Once connected, GDB can be used in the same way as if developing a native application, often with full IDE, Integrated Desktop Environment, support for setting per-line breakpoints and inspecting memory.