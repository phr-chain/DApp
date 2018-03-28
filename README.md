<p align="center"><img width=40% title="PHR-Chain" src="./logo.png"></p>

## Basic Overview

TODO

## Development

### Windows prerequisites

The easiest way to build dependencies on windows is to install windows-build-tools.

Or install the following software:

* Git: https://git-scm.com/download/win
* nvm: https://github.com/coreybutler/nvm-windows
* Python 2.7: https://www.python.org/downloads/release/python-2712/
* Visual C++ Build Tools: http://landinghub.visualstudio.com/visual-cpp-build-tools (Custom Install, and select both Windows 8.1 and Windows 10 SDKs)
* OpenSSL: lite https://slproweb.com/download/Win64OpenSSL_Light-1_1_0g.exe or full https://slproweb.com/download/Win32OpenSSL-1_1_0g.exe
**Please don't change the install location**

```bash
npm config set msvs_version 2015 --global

```
