# PowerShell Script to Setup Portable MariaDB
param(
    [string]$Version = "10.11.8",
    [switch]$Force,
    [switch]$NonInteractive
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Split-Path -Parent $scriptPath
$libaryDir = Join-Path $projectRoot "libary"
$mariadbDir = Join-Path $libaryDir "mariadb"
$dataDir = Join-Path $projectRoot "data\db"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Setup Portable MariaDB ($Version)" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path "$mariadbDir\bin\mysqld.exe") {
    Write-Host "[OK] Portable MariaDB is already installed at: $mariadbDir" -ForegroundColor Green
    if ($Force) {
        Write-Host "[*] Force reinstall requested." -ForegroundColor Yellow
    } elseif ($NonInteractive) {
        exit 0
    } else {
        $reinstall = Read-Host "Do you want to re-download and reinstall? (y/N)"
        if ($reinstall -notmatch "^[yY]") {
            exit 0
        }
    }
}

# 1. Download MariaDB Winx64 ZIP
$downloadUrl = "https://archive.mariadb.org/mariadb-$Version/winx64-packages/mariadb-$Version-winx64.zip"
$tempZip = Join-Path $env:TEMP "mariadb-$Version-winx64.zip"

Write-Host "[*] Downloading MariaDB from: $downloadUrl" -ForegroundColor Cyan
Write-Host "    This may take a few minutes depending on your internet speed..."
try {
    # Use curl.exe for fast download with progress if available, else Invoke-WebRequest
    $curl = Get-Command curl.exe -ErrorAction SilentlyContinue
    if ($curl) {
        & curl.exe -L -o $tempZip $downloadUrl
    } else {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $downloadUrl -OutFile $tempZip -UseBasicParsing
    }
} catch {
    Write-Host "[X] Download failed: $($_.Exception.Message)" -ForegroundColor Red
    Pause
    exit 1
}

Write-Host "[OK] Download completed!" -ForegroundColor Green
Write-Host ""

# 2. Extract MariaDB ZIP
Write-Host "[*] Extracting MariaDB archive..." -ForegroundColor Cyan
$tempExtractDir = Join-Path $env:TEMP ("mariadb_extract_" + [Guid]::NewGuid().ToString().Substring(0,8))
Expand-Archive -Path $tempZip -DestinationPath $tempExtractDir -Force

$extractedFolder = Get-ChildItem -Path $tempExtractDir -Directory | Select-Object -First 1
if (-not $extractedFolder) {
    Write-Host "[X] Extraction failed: inner folder not found." -ForegroundColor Red
    Pause
    exit 1
}

if (-not (Test-Path $libaryDir)) {
    New-Item -ItemType Directory -Path $libaryDir | Out-Null
}

if (Test-Path $mariadbDir) {
    Remove-Item -Path $mariadbDir -Recurse -Force
}

Move-Item -Path $extractedFolder.FullName -Destination $mariadbDir
Remove-Item -Path $tempExtractDir -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path $tempZip -Force -ErrorAction SilentlyContinue

Write-Host "[OK] Installed MariaDB to: $mariadbDir" -ForegroundColor Green
Write-Host ""

# 3. Create my.ini configuration
Write-Host "[*] Configuring my.ini..." -ForegroundColor Cyan
$safeDataDir = $dataDir.Replace("\", "/")
$safeBaseDir = $mariadbDir.Replace("\", "/")

$myIniContent = @"
[client]
port=3306
socket=mysql.sock
default-character-set=utf8mb4

[mysqld]
port=3306
bind-address=127.0.0.1
basedir=$safeBaseDir
datadir=$safeDataDir
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
default-storage-engine=InnoDB
max_allowed_packet=64M
innodb_buffer_pool_size=256M
innodb_log_file_size=64M
sql_mode=NO_ENGINE_SUBSTITUTION
"@

$myIniPath = Join-Path $mariadbDir "my.ini"
[System.IO.File]::WriteAllText($myIniPath, $myIniContent.Replace("`r`n", "`n"), (New-Object System.Text.UTF8Encoding($false)))
Write-Host "[OK] Created: $myIniPath" -ForegroundColor Green
Write-Host ""

# 4. Initialize Database Directory if empty
if (-not (Test-Path "$dataDir\mysql")) {
    Write-Host "[*] Initializing system database directory with mariadb-install-db..." -ForegroundColor Cyan
    if (-not (Test-Path $dataDir)) {
        New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
    }
    $installDbExe = Join-Path $mariadbDir "bin\mariadb-install-db.exe"
    if (-not (Test-Path $installDbExe)) {
        $installDbExe = Join-Path $mariadbDir "bin\mysql_install_db.exe"
    }
    if (Test-Path $installDbExe) {
        & $installDbExe "--datadir=$dataDir" "--password=root"
    }
    Write-Host "[OK] System database initialized!" -ForegroundColor Green
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  [OK] Portable MariaDB Setup Complete! " -ForegroundColor Green
Write-Host "  Location: $mariadbDir" -ForegroundColor Green
Write-Host "  Data:     $dataDir" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
if (-not $NonInteractive) {
    Pause
}
