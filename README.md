# Progressive Web Application Template

**JavaScript Progressive Web Application Project Template for Google Closure Compiler and Visual Studio Code IDE**

This Template is only for **Linux Ubuntu** and have not been tested other platforms

# Install
Read full installation process before executing any command

## 1. GitHub account
Register one GitHub account, if u dont have it already

## 2. Visual Studio Code
Download and install **Visual Studio Code** from official link https://code.visualstudio.com/

## 3. Install Command Line Tools
Super user password required
```
sudo apt-get install git make minify default-jre nodejs
```
* Git - required to execute git commands
* Make - required to execute Makefiles
* Minify - required for HTML/CSS minification
* Java Runtime Environment (JRE) - required to launch Google Closure Compiler
* NodeJS - required for testing libraries

## 4. Download Template (Optional)
This will make template folder inside user working directory and downloads GCC
Template must be installed on drive with symlinks support
For example _FAT32/NTFS/exFAT_ **does not** support symlinks!

```
mkdir -p ~/.gcc/template
git clone https://github.com/SergioRando/PWA.git ~/.gcc/template
~/.gcc/template/compiler/update.sh
mkdir -p ~/.gcc/template/bin
cd ~/.gcc/template/bin
ln -r -s ../src .
```
Creating **bin** and linking **src** required for debugging

## 5. Create New Project
String Replacements
* _{Project Parent Path}_ - path to drive with symlinks support (**NOT FAT32/NTFS/exFAT**)
* _{Username}_ - GitHub user name
* _{NewRepo}_ - GitHub new repository name (make it short and simple)

1. Create a **new empty repository** for your project on GitHub
_Note: without readme or any other files, total empty!_
2. Clone new repository
```
cd {Project Parent Path}
git clone https://github.com/{Username}/{NewRepo}.git
```
_Note: you can't copy link to new repo from GitHub project page, because its empty!_
3. Add ***PWA Template*** repository as an Upstream Remote
```
cd {NewRepo}
git remote add upstream https://github.com/SergioRando/PWA.git
```
4. Update your fork
```
git pull upstream master
```
5. Push
```
git push origin master
```
6. Update GCC and links
```
./compiler/update.sh
mkdir -p bin
cd bin
ln -r -s ../src .
```
7. You are ready to work with new project

_Note: don't forget to change README.md_

# Update

## Update Template
```
cd ~/.gcc/template
git pull origin master
```

## Update Google Closure Compiler
### From Command Line
```
~/.gcc/template/compiler/update.sh
```
### From Visual Studio Code
Launch Task Update

# Uninstall
```
rm -r ~/.gcc/template
rm -r ~/.gcc/compiler
```
_Note: be careful executing **rm** commands! It delete files permanenlty!_

# Build Example
1. Launch Visual Studio Code
2. Open folder ~/.gcc/template
3. Run task 'build'

# Task Commands
- **build** - build/update release project
- **rebuild** - clean project bin folder and rebuild release project
- **clean** - clean project bin folder
- **backup** - create local backup inside project folder backup
- **test** - rebuild and run library tests
- **build release** - rebuild release project
- **build debug** - rebuild debug project
- **help** - show Google Closure Compiler help

# Config
## String substitution
Modify **src/strings.conf**

Every _HTML/CSS/PHP_ file processed with replace **${AppFullName}** by value from **strings.conf**
```
AppFullName = 'Example Application Name'
```

## Include library into another linrary or service
Modify src/lib/_{LIBRARYNAME}_/Makefile or src/service/Makefile
```
LIB_LIST=js-example1
```
js-example1 is name of library located at src/lib/js-example1

## Exclude library from pwa or other non service
Modify **src/pwa/Makefile**
```
EXCLUDELIBS=js-example1 js-example2
```

## Install library as git submodule
Replace _{PROJECT_ROOT_PATH}_ with absolute project root path (example: **~/.gcc/template**)
```
cd {PROJECT_ROOT_PATH}/src/lib
git submodule add https://github.com/SergioRando/PWA-Library.git js-template
```
This will install **js-template** library from [PWA Library](https://github.com/SergioRando/PWA-Library)

It is example! This project already has included js-template

# Helper scripts

## Remove all commit history from git project
Replace _commit message_
```
# Checkout
git checkout --orphan latest_branch
# Add all the files
git add -A
# Commit the changes
git commit -am "commit message"
# Delete the branch
git branch -D master
# Rename the current branch to master
git branch -m master
# Force update your repository
git push -f origin master
```
