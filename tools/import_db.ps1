# PowerShell Script for Automated SwordieMS Database Import
param(
    [switch]$Auto,
    [switch]$DropFirst,
    [string]$DbHost = "127.0.0.1",
    [string]$DbPort = "3306",
    [string]$DbUser = "root",
    [string]$DbPass = "root",
    [string]$DbName = "swordie232"
)

# Set encoding to UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Split-Path -Parent $scriptPath
$dbPropPath = Join-Path $projectRoot "resources\db.properties"

# Load default settings from resources/db.properties if exists
if (Test-Path $dbPropPath) {
    Get-Content $dbPropPath | ForEach-Object {
        if ($_ -match "^\s*([a-zA-Z0-9_\.]+)\s*=\s*(.*)$") {
            $k = $matches[1].Trim()
            $v = $matches[2].Trim()
            if ($k -eq "db.host" -and $DbHost -eq "127.0.0.1" -and $v) { $DbHost = $v }
            if ($k -eq "db.port" -and $DbPort -eq "3306" -and $v) { $DbPort = $v }
            if ($k -eq "db.user" -and $DbUser -eq "root" -and $v) { $DbUser = $v }
            if ($k -eq "db.password" -and $DbPass -eq "root") { $DbPass = $v }
            if ($k -eq "db.name" -and $DbName -eq "swordie232" -and $v) { $DbName = $v }
        }
    }
}

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  SwordieMS - Database Auto-Importer" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Locate mysql.exe
$mysqlPath = $null
$portableMysql = Join-Path $projectRoot "libary\mariadb\bin\mysql.exe"

$knownPaths = @(
    $portableMysql,
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.1\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe",
    "C:\xampp\mysql\bin\mysql.exe"
)
foreach ($kp in $knownPaths) {
    if (Test-Path $kp) {
        $mysqlPath = $kp
        break
    }
}

if (-not $mysqlPath) {
    $mysqlCmd = Get-Command mysql -ErrorAction SilentlyContinue
    if ($mysqlCmd) {
        $mysqlPath = $mysqlCmd.Source
    }
}

if (-not $mysqlPath -and (Test-Path "C:\Program Files\MySQL")) {
    $found = Get-ChildItem -Path "C:\Program Files\MySQL" -Filter "mysql.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
    if ($found) { $mysqlPath = $found }
}

if (-not $mysqlPath -and (Test-Path "C:\Program Files\MariaDB")) {
    $found = Get-ChildItem -Path "C:\Program Files\MariaDB" -Filter "mysql.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
    if ($found) { $mysqlPath = $found }
}

if (-not $mysqlPath -and (Test-Path "C:\laragon\bin\mysql")) {
    $found = Get-ChildItem -Path "C:\laragon\bin\mysql" -Filter "mysql.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
    if ($found) { $mysqlPath = $found }
}

$portableMysql = Join-Path $projectRoot "libary\mariadb\bin\mysql.exe"
if (-not $mysqlPath -and (Test-Path $portableMysql)) {
    $mysqlPath = $portableMysql
}

if (-not $mysqlPath) {
    Write-Host "[!] Could not locate mysql.exe automatically." -ForegroundColor Yellow
    $userInput = Read-Host "Please enter the full path to mysql.exe"
    if ($userInput) { $mysqlPath = $userInput.Trim('"', "'", " ") }
}

if (-not $mysqlPath -or -not (Test-Path $mysqlPath)) {
    Write-Host "[X] ERROR: mysql.exe not found! Please check MySQL installation." -ForegroundColor Red
    if (-not $Auto) { Pause }
    exit 1
}

Write-Host "[OK] Found MySQL Client: $mysqlPath" -ForegroundColor Green
Write-Host ""

# Helper to run mysql command
function Invoke-MySql {
    param(
        [string]$Query,
        [string]$TargetDatabase = $null,
        [switch]$Silent
    )
    $argsList = @("-h", $DbHost, "-P", $DbPort, "-u", $DbUser)
    if (-not [string]::IsNullOrEmpty($DbPass)) {
        $argsList += "-p$DbPass"
    }
    if ($TargetDatabase) {
        $argsList += @("--default-character-set=utf8mb4", $TargetDatabase)
    }
    $argsList += @("-e", $Query)
    if ($Silent) {
        & $mysqlPath $argsList 2>$null
    } else {
        & $mysqlPath $argsList
    }
    return $LASTEXITCODE
}

# 2. Interactive Menu if not in Auto mode
if (-not $Auto) {
    Write-Host "Database Connection Profile:" -ForegroundColor White
    Write-Host "  Host: $DbHost | Port: $DbPort | User: $DbUser | DB: $DbName" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Please select an option:" -ForegroundColor Yellow
    Write-Host "  [1] Quick Full Import (Drop & Recreate '$DbName' - Recommended)"
    Write-Host "  [2] Safe Import (Keep existing tables, update scripts)"
    Write-Host "  [3] Custom Database Connection (Host / Port / User / Pass / DB)"
    Write-Host "  [4] Clean / Drop Residual Databases"
    Write-Host "  [0] Exit"
    Write-Host ""
    $choice = Read-Host "Select option [Default: 1]"
    if ([string]::IsNullOrWhiteSpace($choice)) { $choice = "1" }

    switch ($choice) {
        "1" {
            $DropFirst = $true
        }
        "2" {
            $DropFirst = $false
        }
        "3" {
            $inHost = Read-Host "MySQL Host [Default: $DbHost]"
            if (-not [string]::IsNullOrWhiteSpace($inHost)) { $DbHost = $inHost }

            $inPort = Read-Host "MySQL Port [Default: $DbPort]"
            if (-not [string]::IsNullOrWhiteSpace($inPort)) { $DbPort = $inPort }

            $inUser = Read-Host "MySQL User [Default: $DbUser]"
            if (-not [string]::IsNullOrWhiteSpace($inUser)) { $DbUser = $inUser }

            $inPass = Read-Host "MySQL Password [Default: $DbPass, Type 'EMPTY' for no password]"
            if ($inPass -eq "EMPTY") { $DbPass = "" }
            elseif (-not [string]::IsNullOrWhiteSpace($inPass)) { $DbPass = $inPass }

            $inDb = Read-Host "Database Name [Default: $DbName]"
            if (-not [string]::IsNullOrWhiteSpace($inDb)) { $DbName = $inDb }

            $dropPrompt = Read-Host "Drop and recreate '$DbName'? (y/N)"
            if ($dropPrompt -match "^[yY]") { $DropFirst = $true } else { $DropFirst = $false }
        }
        "4" {
            Write-Host "Checking non-system databases..." -ForegroundColor Cyan
            $argsList = @("-h", $DbHost, "-P", $DbPort, "-u", $DbUser)
            if (-not [string]::IsNullOrEmpty($DbPass)) { $argsList += "-p$DbPass" }
            $argsList += @("-e", "SHOW DATABASES;")
            & $mysqlPath $argsList
            $targetDrop = Read-Host "Enter database name to DROP (leave empty to cancel)"
            if (-not [string]::IsNullOrWhiteSpace($targetDrop) -and $targetDrop -notmatch "^(information_schema|mysql|performance_schema|sys)$") {
                Invoke-MySql -Query "DROP DATABASE IF EXISTS $targetDrop;"
                Write-Host "[OK] Database '$targetDrop' dropped successfully." -ForegroundColor Green
            } else {
                Write-Host "[*] Drop operation cancelled." -ForegroundColor Yellow
            }
            if (-not $Auto) { Pause }
            exit 0
        }
        "0" {
            Write-Host "Operation cancelled."
            exit 0
        }
        Default {
            $DropFirst = $true
        }
    }
}

# 3. Connection and DB Initialization
Write-Host "--- Database Connection Target ---" -ForegroundColor Cyan
Write-Host "  Host:     $DbHost"
Write-Host "  Port:     $DbPort"
Write-Host "  User:     $DbUser"
Write-Host "  Database: $DbName"
Write-Host ""

if ($DropFirst) {
    Write-Host "[*] Dropping existing database '$DbName'..." -ForegroundColor Yellow
    Invoke-MySql -Query "DROP DATABASE IF EXISTS $DbName;" -Silent | Out-Null
}

Write-Host "[*] Creating database '$DbName' (utf8mb4)..." -ForegroundColor Cyan
$code = Invoke-MySql -Query "CREATE DATABASE IF NOT EXISTS $DbName DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if ($code -ne 0) {
    Write-Host "[X] ERROR: Could not connect to MySQL server! Please verify your Host, Port, User, or Password." -ForegroundColor Red
    if (-not $Auto) { Pause }
    exit 1
}

Write-Host "[OK] Database '$DbName' is ready." -ForegroundColor Green
Write-Host ""

# Update resources/db.properties so the Game Server connects seamlessly!
$propLines = @(
    "# Database Configuration for SwordieMS v232",
    "# Auto-synced by import_db.ps1",
    "db.host=$DbHost",
    "db.port=$DbPort",
    "db.user=$DbUser",
    "db.password=$DbPass",
    "db.name=$DbName"
)
Set-Content -Path $dbPropPath -Value $propLines -Encoding UTF8
Write-Host "[OK] Synced connection settings with resources/db.properties" -ForegroundColor Green
Write-Host ""

# 4. Import Core SQL Scripts (Base Game Only)
$sqlFolder = Join-Path $projectRoot "sql"
$coreFiles = @(
    "InitTables_characters.sql",
    "InitTable_npc.sql",
    "InitTable_equip_drops.sql",
    "InitTables_MonsterCollection.sql",
    "InitTables_cashshop.sql",
    "InitTables_drops.sql",
    "InitTables_shops.sql",
    "InitTables_indexes.sql",
    "Init_Admin_accounts.sql",
    "Init_Migration_at_V79.sql"
)

Write-Host "--- Importing Base Game Database Tables & Data ---" -ForegroundColor Cyan
$step = 1
$totalSteps = $coreFiles.Count
foreach ($file in $coreFiles) {
    $filePath = Join-Path $sqlFolder $file
    if (Test-Path $filePath) {
        Write-Host "  [$step/$totalSteps] Importing: $file ..." -NoNewline
        $mysqlArgs = @("-h", $DbHost, "-P", $DbPort, "-u", $DbUser)
        if (-not [string]::IsNullOrEmpty($DbPass)) { $mysqlArgs += "-p$DbPass" }
        $mysqlArgs += @("--default-character-set=utf8mb4", $DbName)
        
        Get-Content -Raw -Encoding UTF8 $filePath | & $mysqlPath $mysqlArgs 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host " [FAILED]" -ForegroundColor Red
        } else {
            Write-Host " [OK]" -ForegroundColor Green
        }
    } else {
        Write-Host "  [$step/$totalSteps] Skip (Not Found): $file" -ForegroundColor Yellow
    }
    $step++
}
Write-Host ""

Write-Host ""

# 6. Verify Tables Count
$countResult = & $mysqlPath -h $DbHost -P $DbPort -u $DbUser $(if (-not [string]::IsNullOrEmpty($DbPass)) { "-p$DbPass" }) -N -e "SELECT count(*) FROM information_schema.tables WHERE table_schema='$DbName';" 2>$null
$tableCount = 0
if ($countResult -match "\d+") {
    $tableCount = [int]$matches[0]
}

Write-Host "=========================================" -ForegroundColor Green
Write-Host "  [OK] Database Import Complete!" -ForegroundColor Green
Write-Host "  Database:     $DbName (${DbHost}:${DbPort})" -ForegroundColor Green
Write-Host "  Total Tables: $tableCount tables created" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

if (-not $Auto) {
    Pause
}
