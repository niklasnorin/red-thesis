# Docker
Docker is a container platform that allows multiple software applications to run in isolation on the same Host OS [?Docker for the Virtualization Admin, Docker, 2018-03-25](https://goto.docker.com/virtualization-admin-conf.html). This is similar to Virtual Machine, VM, technology, but in contrast to running multiple VM:s on one physical computer, the kernel is not duplicated.

Docker uses the analogy of houses vs. apartments. With a VM, you get a house with dedicated infrastructure. With Docker, you share the infrastructure, more like an apartment. This makes the operation and resources used by docker a lot smaller than those of a VM.

While a VM uses virtualization of the hardware and contain the entire Operating System, Docker is an application delivery technology.

## Docker Daemon and Client
Docker consists of a daemon and a client [?Docker Architecture, 2018-03-25](https://docs.docker.com/engine/docker-overview/#docker-architecture). The client is used to control the daemon, while the daemon does all the heavy lifting. The daemon can be running on the same system as the client, or it could be on a remote system.

The end-user would use the client for most operations. All commonly used Docker operations, such as building a Docker Image or running a Docker Container, are run via the client which in turn instructs the daemon what to do.

## Docker Images
A Docker Image is a read-only layered template of dependencies needed to run a specific application. A Docker Image can be a whole Linux distribution, such as Debian. When running an application in a Debian Docker Image, the application can expect all of the facilities normally available in Debian.

The best practice in Docker however, is that the Docker Image contains only the minimum amount of dependencies needed to run an application. In many cases, this means that the image only consists of the exact libraries and runtimes needed to run that exact application.

## Docker Containers
A Docker Container is an instance of a Docker Image running in the Docker daemon. If, for example, a Docker Image would contain everything needed to run a database, then the Docker Container of that image would be a running database.

## Docker Volumes
Docker provides a unified way to share data with Docker Containers. This includes both sharing data between multiple containers as well as sharing data between a container and the Host OS.

### Bind mounts
Bind mounts are commonly used in Docker to share resources from the host OS to the Docker container [#](?).

Bind mounting over an existing folder will replace the content of that folder with the content of the bind mount source. This can be done over any folder, even system folder like `/tmp` or `/sys`.

## Access to Hardware
Typically, Docker Containers do not have access to hardware because they are not run as a super user [#](?). This means that it does not have the elevated access needed to do most system calls to the kernel. The upside of this is that it minimizes the risk that one container affects the environment of another container.

To be able to access hardware, the Docker Container either has to be run in privileged mode, granting it system wide super user access, or be explicitly granted access on a device-by-device level.