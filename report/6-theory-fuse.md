# FUSE

FUSE, Filesystem in Userspace, is a kernel driver that can be used to set up arbitrary filesystems in userspace.
Easy to write an application to create special filesystems and intercept reads and writes to those files and handle those in the application.
One use-case for FUSE is to e.g. automatically encrypt/decrypt on write/read

## Security
The FUSE kernel driver defaults to only allowing the process and user who created the mount, has access to it

The FUSE kernel driver is currently configured with `allow_other`, an option which means that anyone, not only the process and user who created the mount, has access to it.
