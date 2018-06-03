# Appendix A - Evaluation Software Implementation

The Stopwatch Example that was developed as part of this thesis consists of two parts, as illustrated in Figure \ref{a_1}. These are:

1. The Stopwatch Application itself
2. The Emulated Hardware Application which emulates the buttons and he 7-segment displays

![The Stopwatch Example \label{a_1}](source/figures/appendix_a_1.png)

The example was written in Python using python-periphery [@python-periphery] for convenience, instead of using direct file writes.

## Stopwatch Application
The main application was implemented as a simple single-file python application that:

1. Listens for GPIO input interrupts on the Start/Stop button or Reset button
2. Reacts to the button press, starting, stopping or pausing the count
3. For every time the count changes, it updates all the output GPIOs controlling the 7-segment displays representing the count

## Stopwatch Emulated Hardware Application
The emulator application emulates the connected hardware. It both handles the GPIO interface, and has a web-server which the user connects to when he wants to control the stopwatch, as shown in Figure \ref{a_2}.

![Starting and stopping the stopwatch \label{a_2}](source/figures/appendix_a_2.png)

The web-interface has two buttons, Start/Stop and Reset, and shows all the 7-segment displays of the Stopwatch.

The application:

1. Listens for incoming requests to access the stopwatch web-interface
2. Listens for the user to click a button on the web-interface, generating a change in the GPIO output value 
3. Listens for GPIO input interrupts on all the individual segments in the 7-segment displays

Together, the two applications illustrate how Quarterdock can be used to both create an environment where an application thinks real hardware is available, and to emulate the other side of that hardware.