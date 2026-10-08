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
netstat -ano | findstr ":3306 " | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo [OK] MySQL/MariaDB is ALREADY running on port 3306.
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

echo [*] Starting Portable MariaDB daemon on port 3306...
start "Portable MariaDB Server" /min "%MARIADB_DIR%\bin\mysqld.exe" --defaults-file="%MY_INI%" --standalone

:: Wait up to 10 seconds for port 3306 to listen
set "STARTED=0"
for /l %%i in (1,1,10) do (
    netstat -ano | findstr ":3306 " | findstr "LISTENING" >nul 2>&1
    if not errorlevel 1 (
        set "STARTED=1"
        goto start_ok
    )
    timeout /t 1 >nul
)

:start_ok
if "!STARTED!"=="1" (
    echo [OK] Portable MariaDB started successfully on port 3306!
) else (
    echo [X] WARNING: Failed to start Portable MariaDB on port 3306.
)
if not "%1"=="start" pause
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
netstat -ano | findstr ":3306 " | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3306 " ^| findstr "LISTENING"') do (
        echo   [OK] Database Server is ACTIVE on port 3306 (PID: %%a)
    )
) else (
    echo   [X] Port 3306 is INACTIVE (No Database Server running)
)
echo.
if exist "%MARIADB_DIR%\bin\mysqld.exe" (
    echo   [*] Portable MariaDB binary: INSTALLED (%MARIADB_DIR%)
) else (
    echo   [*] Portable MariaDB binary: NOT INSTALLED
)
if exist "%DATA_DIR%" (
    echo   [*] Database data directory: FOUND (%DATA_DIR%)
) else (
    echo   [*] Database data directory: NOT CREATED
)
echo.
pause
goto menu

:setup
echo.
call "%PROJECT_ROOT%\tools\setup_portable_mariadb.bat"
goto menu
