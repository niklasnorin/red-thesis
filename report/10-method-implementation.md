# Implement Architecture

## Bind mounts
- Bind mount propagation. Needs to be enabled to allow for new mounts insite a bind mount source folder to be mirrored into the bind mount target folder.

## FUSE client implementation
- Selected golang because fast, static linking & solid fuse-client implementation
- go-fuse fork to add polling. A not unsubstatial amount of time was spent to understand the Linux filesystem, FUSE how polling behaves.