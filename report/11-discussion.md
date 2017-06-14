Discussion
==========

Input
-----

- Programatically access to IO stimulus can be superior to having full local access with real hardware for testing purposes
- If kits are connected with specialized “shield”, they could potentially expose inputs and outputs to the internet in some way. These shields would most likely need to be designed per each development kit. Latency wise - code stimulating inputs/output would most likely need to execute on, or near, these “shields”. Also a 1:1 mapping shield-application.
- Emulation: It is possible to emulate hardware to some degree in QEMU, but it's not very simple or straight forward.