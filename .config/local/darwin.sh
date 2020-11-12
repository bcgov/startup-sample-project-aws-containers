#!/bin/bash

testcmd () {
    command -v "$1" > /dev/null
}

if ! testcmd brew; then
    read -rp "Homebrew is not installed. Install now [y/n]: " install
    if [ "$install" == "y" ]; then
        echo "installing..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    else
        echo "Please install Homebrew and try again."
    fi
    exit 1
fi

if ! testcmd code; then
    brew cask install visual-studio-code
fi

if ! testcmd docker; then
    brew cask install docker
    open /Applications/Docker.app
fi

if ! testcmd aws; then
    brew install awscli
fi

if ! testcmd jq; then
    brew install jq
fi

if ! testcmd terraform; then
    brew install terraform
fi

# Copy vscode config from the repo
[[ -d .vscode ]] || cp -a .config/vscode .vscode
