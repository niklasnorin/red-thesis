# Docker

Docker is a container platform that allows multiple software applications to run in isolation on the same Host OS [@docker-virtual]. This is similar to Virtual Machine, VM, technology, but in contrast to running multiple VM:s on one physical computer, the kernel is not duplicated. An overview of the entire architecture is shown in Figure \ref{7}.

![Docker architecture overview \label{7}](source/figures/7.png)

Docker uses the analogy of houses vs. apartments. With a VM, you get a house with dedicated infrastructure. With Docker, you share the infrastructure, more like an apartment. This makes the operation and resources used by docker a lot smaller than those of a VM.

## Docker Daemon and Client
Docker consists of a daemon, a background process, and a client [@docker-overview]. The client is used to control the daemon, while the daemon does all the heavy lifting. The daemon can be running on the same system as the client, or it could be on a remote system.

The end-user would use the client for most operations. All commonly used Docker operations, such as building a Docker Image or running a Docker Container, are run via the client which in turn instructs the daemon what to do.

## Docker Images
A Docker Image is a template of dependencies needed to run a specific application. A Docker Image can be a whole Linux distribution, such as Debian. When running an application in a Debian Docker Image, the application can expect all of the facilities normally available in Debian.

The best practice in Docker however, is that the Docker Image contains only the minimum amount of dependencies needed to run an application. In many cases, this means that the image only consists of the exact libraries and runtimes needed to run that exact application.

## Docker Containers
A Docker Container is an instance of a Docker Image running in the Docker daemon. If, for example, a Docker Image would contain everything needed to run a database, then the Docker Container of that image would be a running database.

## Docker Volumes
Docker provides a unified way to share data with Docker Containers. This includes both sharing data between multiple containers as well as sharing data between a container and the Host OS.

### Bind mounts
Bind mounts are commonly used in Docker to share resources from the host OS to the Docker container [@docker-bind-mount]. Bind mounts work by mounting a replica of the _source folder_ into a _target folder_. Any changes done in either folder will be replicated in the other. An illustration on how this relates to the Docker architecture can be seen in Figure \ref{7_4_1}.

![Bind mount \label{7_4_1}](source/figures/7_4_1.png)

Bind mounting over an existing folder will replace the content of that folder with the content of the bind mount source. This can be done over any folder, even system folder like `/tmp` or `/sys`.

Please note that the folder must exist, or be possible to create, to be the target for a bind mount.

#### Propagation
The way sub-mounts, mounts inside the source or target folder, works depends on what is known as bind propagation. Depending on the bind propagation setting, mounts inside either folder can be private (`private`/`rprivate`), shared one way (`slave`/`rslave`) or shared both ways (`shared`/`rshared`). This can also be applied to only those folders, or recursively (the `r` in `rshared`) to any mount inside those bind mounts.

## Access to Hardware
Typically, Docker Containers do not have access to hardware because they are not run as a super user [@docker-privileged-mode]. This means that it does not have the elevated access needed to do most system calls to the kernel. The upside of this is that it minimizes the risk that one container affects the environment of another container.

To be able to access hardware, the Docker Container either has to be run in privileged mode, granting it system wide super user access, or be explicitly granted access on a device-by-device level.

## Docker Compose
Since Docker containers are usually constructed to be isolated and self contained it is often necessary to run multiple Docker containers to perform a given task. For example, a simple web-server might consist of one Docker container running the actual web-server and another which only runs the database.

While it is possible to manually start multiple Docker containers, Docker Compose offer a declarative configuration syntax of automating it. Using Docker Compose, each Docker container is simply an entry in a `docker-compose.yml`-file. There each container can be configured with the exact same parameters that would be available if they were started one by one.

## Docker Machine
Docker runs all containers on top of the same kernel. Docker containers can run on several different kernels natively. The latest versions of docker can run natively on top of both the Windows and OS X hypervisor in addition to the Linux kernel [@docker-machine-overview]. 

Each platform has their own Docker bundle, because each platform has different needs. When running Docker on Linux, Docker can use the Linux client more or less directly. However, when running Linux containers on Windows, they have to be run inside a Linux Virtual Machine (or on top of the Windows hypervisor) so that there is a Linux kernel available.

Docker Machine is a tool from Docker which can be used on any platform to setup a virtual machine and the Docker runtime for you. It can be configured to use VirtualBox [@docker-machine-overview] or other virtual machines.
