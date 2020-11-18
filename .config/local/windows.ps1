Function Test-CommandExists
{

    Param ($command)

    $oldPreference = $ErrorActionPreference

    $ErrorActionPreference = 'stop'

    try { if (Get-Command $command) { RETURN $true } }

    Catch { Write-Host "$command does not exist"; RETURN $false }

    Finally { $ErrorActionPreference = $oldPreference }

}

If (Test-CommandExists code) {
    Write-Host Please install Chocolatey and re-run this script.
    Write-Host https://chocolatey.org/install
    exit 1
}

If (Test-CommandExists code) {
    Write-Host VS Code is already installed.
}
else {
    choco install -y vscode
    code --install-extension ms-vscode-remote.remote-wsl 
}

If (Test-CommandExists docker) {
    Write-Host Docker is already installed.
}
else {
    choco install -y docker 
}
