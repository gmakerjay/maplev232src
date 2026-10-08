@echo off
setlocal EnableDelayedExpansion
set "PROJECT_ROOT=%~dp0.."
for %%F in ("%PROJECT_ROOT%") do set "PROJECT_ROOT=%%~fF"
set "MARIADB_DIR=%PROJECT_ROOT%\libary\mariadb"
set "DATA_DIR=%PROJECT_ROOT%\data\db"
set "MY_INI=%MARIADB_DIR%\my.ini"

if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="status" goto status
if "%1"=="setup" goto setup
goto menu

:sync_ini
set "SAFE_BASE=!MARIADB_DIR:\=/!"
set "SAFE_DATA=!DATA_DIR:\=/!"
(
    echo [client]
    echo port=3306
    echo socket=mysql.sock
    echo default-character-set=utf8mb4
    echo.
    echo [mysqld]
    echo port=3306
    echo bind-address=127.0.0.1
    echo basedir=!SAFE_BASE!
    echo datadir=!SAFE_DATA!
    echo character-set-server=utf8mb4
    echo collation-server=utf8mb4_unicode_ci
    echo default-storage-engine=InnoDB
    echo max_allowed_packet=64M
    echo innodb_buffer_pool_size=256M
    echo innodb_log_file_size=64M
    echo sql_mode=NO_ENGINE_SUBSTITUTION
) > "%MY_INI%"
exit /b 0

:menu
cls
echo ========================================
echo   Portable MariaDB Controller
echo ========================================
echo.
echo   [1] Start Portable MariaDB
echo   [2] Stop Portable MariaDB
echo   [3] Check MariaDB Status
echo   [4] Setup Portable MariaDB (Auto-Download)
echo   [0] Back
echo.
echo ========================================
set /p mchoice="Select option: "
if "%mchoice%"=="1" goto start
if "%mchoice%"=="2" goto stop
if "%mchoice%"=="3" goto status
if "%mchoice%"=="4" goto setup
if "%mchoice%"=="0" exit /b 0
goto menu

:start
echo.
echo [*] Checking Database Port 3306...
powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 3306 -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }" >nul 2>&1
if not errorlevel 1 (
    echo [OK] MySQL/MariaDB is ALREADY running on port 3306.
    call :check_swordie232
    if not "%1"=="start" pause
    exit /b 0
)

if not exist "%MARIADB_DIR%\bin\mysqld.exe" (
    echo [!] Portable MariaDB is NOT installed in:
    echo     %MARIADB_DIR%
    echo.
    echo     Run option [4] Setup Portable MariaDB to install automatically.
    if not "%1"=="start" pause
    exit /b 1
)

if not exist "%DATA_DIR%" mkdir "%DATA_DIR%"

:: 1. Sync dynamic paths in my.ini
call :sync_ini

:: 2. Auto-initialize system tables if not found
if not exist "%DATA_DIR%\mysql" (
    echo [*] Database data directory not initialized.
    echo [*] Auto-initializing system tables with mariadb-install-db...
    if exist "%MARIADB_DIR%\bin\mariadb-install-db.exe" (
        "%MARIADB_DIR%\bin\mariadb-install-db.exe" "--datadir=%DATA_DIR%" "--password=root"
    ) else if exist "%MARIADB_DIR%\bin\mysql_install_db.exe" (
        "%MARIADB_DIR%\bin\mysql_install_db.exe" "--datadir=%DATA_DIR%" "--password=root"
    )
)

echo [*] Starting Portable MariaDB daemon on port 3306...
start "Portable MariaDB Server" /min "%MARIADB_DIR%\bin\mysqld.exe" --defaults-file="%MY_INI%" --console

:: Wait up to 10 seconds for port 3306 to listen
set "STARTED=0"
for /l %%i in (1,1,10) do (
    powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 3306 -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }" >nul 2>&1
    if not errorlevel 1 (
        set "STARTED=1"
        goto start_ok
    )
    powershell -NoProfile -Command "Start-Sleep -Milliseconds 800" >nul 2>&1
)

:start_ok
if "!STARTED!"=="1" (
    echo [OK] Portable MariaDB started successfully on port 3306!
    call :check_swordie232
) else (
    echo [X] WARNING: Failed to start Portable MariaDB on port 3306.
)
if not "%1"=="start" pause
exit /b 0

:check_swordie232
:: Verify if swordie232 database exists, auto-import if missing
if exist "%MARIADB_DIR%\bin\mysql.exe" (
    "%MARIADB_DIR%\bin\mysql.exe" -h 127.0.0.1 -P 3306 -u root -proot -e "USE swordie232;" >nul 2>&1
    if errorlevel 1 (
        echo [*] Database 'swordie232' not found. Auto-importing base game tables...
        call powershell -NoProfile -ExecutionPolicy Bypass -File "%PROJECT_ROOT%\tools\import_db.ps1" -Auto
    )
)
exit /b 0

:stop
echo.
echo [*] Stopping Portable MariaDB...
set "STOPPED=0"

if exist "%MARIADB_DIR%\bin\mysqladmin.exe" (
    "%MARIADB_DIR%\bin\mysqladmin.exe" -u root -P 3306 shutdown >nul 2>&1
    if not errorlevel 1 set "STOPPED=1"
)

:: Terminate portable mysqld if still running
for /f "tokens=2" %%a in ('tasklist /FI "IMAGENAME eq mysqld.exe" /NH 2^>nul ^| findstr /I "mysqld"') do (
    taskkill /F /PID %%a >nul 2>&1
    set "STOPPED=1"
)

if "!STOPPED!"=="1" (
    echo [OK] Portable MariaDB stopped.
) else (
    echo [*] MariaDB is not running or already stopped.
)
if not "%1"=="stop" pause
exit /b 0

:status
echo.
echo ========================================
echo   MariaDB / Database Status
echo ========================================
echo.
powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 3306 -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }" >nul 2>&1
if errorlevel 1 goto status_not_running
for /f "tokens=1" %%a in ('powershell -NoProfile -Command "(Get-NetTCPConnection -LocalPort 3306 -State Listen -ErrorAction SilentlyContinue).OwningProcess"') do (
    echo   [OK] Database Server is ACTIVE on port 3306 [PID: %%a]
)
goto status_check_files

:status_not_running
echo   [X] Port 3306 is INACTIVE [No Database Server running]

:status_check_files
echo.
if exist "%MARIADB_DIR%\bin\mysqld.exe" (
    echo   [*] Portable MariaDB binary: INSTALLED [%MARIADB_DIR%]
) else (
    echo   [*] Portable MariaDB binary: NOT INSTALLED
)
if exist "%DATA_DIR%" (
    echo   [*] Database data directory: FOUND [%DATA_DIR%]
) else (
    echo   [*] Database data directory: NOT CREATED
)

if exist "%MARIADB_DIR%\bin\mysql.exe" (
    netstat -ano | findstr ":3306 " | findstr "LISTENING" >nul 2>&1
    if not errorlevel 1 (
        "%MARIADB_DIR%\bin\mysql.exe" -h 127.0.0.1 -P 3306 -u root -proot -e "USE swordie232;" >nul 2>&1
        if errorlevel 1 (
            echo   [^!] Game Database: 'swordie232' NOT FOUND [Will auto-import on start]
        ) else (
            echo   [OK] Game Database: 'swordie232' is READY
        )
    ) else (
        if exist "%DATA_DIR%\swordie232" (
            echo   [OK] Game Database: 'swordie232' FOUND in data folder
        ) else (
            echo   [^!] Game Database: 'swordie232' NOT FOUND [Will auto-import on start]
        )
    )
)

echo.
if not "%1"=="status" (
    pause
    goto menu
)
exit /b 0

:setup
echo.
call "%PROJECT_ROOT%\tools\setup_portable_mariadb.bat"
goto menu
