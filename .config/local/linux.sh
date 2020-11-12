#!/bin/bash

testcmd () {
    command -v "$1" > /dev/null
}

echo "Installing local development tools..."

sudo apt update
sudo apt install -y \
    awscli \
    build-essential \
    docker.io \
    docker-compose \
    jq \
    terraform

if testcmd code; then
    echo "VS Code is already installed."
else
    if uname -a | grep -q microsoft; then
        echo "Bash is running in WSL."
        echo "Please install VS Code in Windows and install the 'Remote - WSL' extension."
        echo "https://code.visualstudio.com/download"
        exit 1
    fi
    sudo snap install vscode --classic
fi

# Copy vscode config from the repo
[[ -d .vscode ]] || cp -a .config/vscode .vscode
