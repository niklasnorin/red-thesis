# An Emulated Hardware Abstraction Layer
As stated in the introduction:

> This thesis sets out to design and, in part, implement a software architecture that enables embedded software developers to develop, debug and test embedded Linux software that access hardware, without access to physical hardware.

The method that will be used to develop this architecture is to:

1. Set up an Example Software to evaluate the design and implementation of the architecture
2. Design the architecture
3. Implement the architecture
4. Test the architecture with the Example Software

## Nomenclature
The Emulated Hardware Abstraction Layer developed in this thesis will be called Quarterdock. Instead of writing out Emulated Hardware Abstraction Layer, the name Quarterdock will be used instead.

![Quarterdock overview \label{8_1}](source/figures/8_1.png)

Applications which uses Quarterdock is a Quarterdock Client.

The embedded software application which is intended to run on an embedded target, and should also be able to run on Quarterdock, will be called the Target Application. When running in Quarterdock, the Target Application is a Quarterdock Client.

The software application which emulates the hardware for a Target Application is an Emulated Hardware Application. An Emulated Hardware Application is also a Quarterdock Client.

## Evaluate Architecture
To evaluate this software architecture, and to give a concrete target for requirements, an Example Application will be implemented. This application will expect certain hardware GPIO:s to be available to it to function, and will exercise them.

Only the intent of the evaluation software, and the high-level behavior, is described in this chapter. Please see [ref:Appendix X](?) for some notes and code related to the actual implementation.

The evaluation software will be divided into two parts:

1. The Example Application
2. The Emulated Hardware Application

The Example Application will set up and access GPIO:s. It will setup both inputs and outputs, as well as listen to interrupts on at least one input.

The Emulated Hardware Application will stimulate the Example Application's inputs and listen to its outputs. It will do this in a way that makes it possible for the developer to interact with inputs, and see graphical representations of the outputs. It is most likely written specifically for a concrete Example Application, but it could also be more generic.

### Stopwatch
The concrete Example Application that will be used to evaluate the software architecture is a "stopwatch" application.

![The Stopwatch Quarterdock application \label{8_2_1}](source/figures/8_2_1.png)

The way this application works is that:

1. When the "Start/Stop" button is pressed it will start counting up seconds and minutes on the 7-segment displays
2. If the "Start/Stop" button is pressed while the stopwatch is running then it will stop
3. Pressing "Start/Stop" again when it is stopped will continue the count
4. Pressing the "Reset" button at any point will reset the count to zero and stop the stopwatch

This Example Application will consist of four 7-segment displays as outputs, two for minutes and two for seconds, and two buttons as inputs. That is a total of 28 output GPIO:s and 2 input GPIO:s, with interrupts on the inputs.

The Emulated Hardware Application that will support the Stopwatch Example Application will have to be able to graphically represent four 7-segment displays and two buttons.

The user should be able to interact with the Emulated Hardware Application without installing any additional software beyond what is needed for the software architecture.
