@echo off
setlocal EnableDelayedExpansion
title SwordieMS - Control Panel (Portable)
chcp 65001 >nul 2>&1
cd /d "%~dp0"

:menu
cls
echo ========================================
echo   SwordieMS - Control Panel
echo ========================================
echo.
echo   [1] Build Project
echo   [2] Run Server (with Log Window)
echo   [3] Run Server (silent)
echo   [4] Build + Run
echo   [5] Stop Server
echo   [6] View Logs
echo   [7] Check Environment
echo   [8] Kill All Processes (Force)
echo   [9] Import Database (MySQL)
echo   [0] Exit
echo.
echo ========================================
set /p choice="Select option: "

if "%choice%"=="1" goto build
if "%choice%"=="2" goto run_with_log
if "%choice%"=="3" goto run_silent
if "%choice%"=="4" goto buildrun
if "%choice%"=="5" goto stop
if "%choice%"=="6" goto viewlogs
if "%choice%"=="7" goto check
if "%choice%"=="8" goto killall
if "%choice%"=="9" goto import_db
if "%choice%"=="0" goto end
goto menu

:build
echo.
echo ----------------------------------------
echo   Building Project...
echo   Please wait, this may take a minute.
echo ----------------------------------------
echo.
call "tools\_build.bat"
echo.
pause
goto menu

:run_with_log
echo.
echo ----------------------------------------
echo   Starting Server with Log Window...
echo ----------------------------------------
echo.
:: Start log window in a new terminal
start "SwordieMS - Log Viewer" cmd /k "title SwordieMS - Live Log & type nul > logs\server_live.log & powershell -Command \"Get-Content -Path 'logs\server_live.log' -Wait -Tail 100\""

:: Start server and tee output to log file
call "tools\_run.bat" 2>&1 | powershell -Command "$input | Tee-Object -FilePath 'logs\server_live.log' -Append"
echo.
pause
goto menu

:run_silent
echo.
echo ----------------------------------------
echo   Starting Server (silent mode)...
echo   Press Ctrl+C to stop the server.
echo ----------------------------------------
echo.
call "tools\_run.bat"
echo.
pause
goto menu

:buildrun
echo.
echo ----------------------------------------
echo   Building Project...
echo   Please wait, this may take a minute.
echo ----------------------------------------
echo.
call "tools\_build.bat"
if errorlevel 1 (
    echo.
    pause
    goto menu
)
echo.
echo ----------------------------------------
echo   Starting Server with Log Window...
echo ----------------------------------------
echo.
:: Start log window in a new terminal
start "SwordieMS - Log Viewer" cmd /k "title SwordieMS - Live Log & type nul > logs\server_live.log & powershell -Command \"Get-Content -Path 'logs\server_live.log' -Wait -Tail 100\""

:: Start server and tee output to log file
call "tools\_run.bat" 2>&1 | powershell -Command "$input | Tee-Object -FilePath 'logs\server_live.log' -Append"
echo.
pause
goto menu

:stop
echo.
echo ----------------------------------------
echo   Stopping Server...
echo ----------------------------------------
echo.
set "KILLED=0"
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8484 :8483 :8585 :3000" ^| findstr "LISTENING" 2^>nul') do (
    echo   Killing process PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    set "KILLED=1"
)
for /f "tokens=2" %%a in ('tasklist /FI "IMAGENAME eq java.exe" /NH 2^>nul ^| findstr /I "java"') do (
    echo   Killing Java process PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    set "KILLED=1"
)
:: Also kill log viewer windows
taskkill /FI "WINDOWTITLE eq SwordieMS - Live Log*" /F >nul 2>&1
if "!KILLED!"=="0" (
    echo   No server process found.
) else (
    echo.
    echo   [OK] Server stopped!
)
echo.
pause
goto menu

:killall
cls
echo ========================================
echo   Kill All Processes (Force)
echo ========================================
echo.
echo   This will forcefully terminate:
echo   - All Java processes
echo   - Processes using ports 8484, 8483, 8585, 3000
echo   - All SwordieMS related windows
echo.
echo   [1] Kill Java processes only
echo   [2] Kill by Port (8484, 8483, 8585, 3000)
echo   [3] Kill ALL (Java + Ports + Windows)
echo   [4] Kill specific port
echo   [0] Back to Menu
echo.
set /p killchoice="Select option: "

if "%killchoice%"=="1" goto kill_java
if "%killchoice%"=="2" goto kill_ports
if "%killchoice%"=="3" goto kill_everything
if "%killchoice%"=="4" goto kill_specific_port
if "%killchoice%"=="0" goto menu
goto killall

:kill_java
echo.
echo   Killing all Java processes...
set "JAVA_KILLED=0"
for /f "tokens=2" %%a in ('tasklist /FI "IMAGENAME eq java.exe" /NH 2^>nul ^| findstr /I "java"') do (
    echo     Killing Java PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    set "JAVA_KILLED=1"
)
for /f "tokens=2" %%a in ('tasklist /FI "IMAGENAME eq javaw.exe" /NH 2^>nul ^| findstr /I "javaw"') do (
    echo     Killing Javaw PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    set "JAVA_KILLED=1"
)
if "!JAVA_KILLED!"=="0" (
    echo   No Java processes found.
) else (
    echo.
    echo   [OK] All Java processes killed!
)
echo.
pause
goto killall

:kill_ports
echo.
echo   Killing processes on ports 8484, 8483, 8585, 3000...
set "PORT_KILLED=0"
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8484 " ^| findstr "LISTENING" 2^>nul') do (
    echo     Port 8484 - Killing PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    set "PORT_KILLED=1"
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8483 " ^| findstr "LISTENING" 2^>nul') do (
    echo     Port 8483 - Killing PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    set "PORT_KILLED=1"
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8585 " ^| findstr "LISTENING" 2^>nul') do (
    echo     Port 8585 - Killing PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    set "PORT_KILLED=1"
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000 " ^| findstr "LISTENING" 2^>nul') do (
    echo     Port 3000 - Killing PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    set "PORT_KILLED=1"
)
if "!PORT_KILLED!"=="0" (
    echo   No processes found on these ports.
) else (
    echo.
    echo   [OK] All port processes killed!
)
echo.
pause
goto killall

:kill_everything
echo.
echo   ========================================
echo   Killing EVERYTHING...
echo   ========================================
echo.

:: Kill Java processes
echo   [1/4] Killing Java processes...
for /f "tokens=2" %%a in ('tasklist /FI "IMAGENAME eq java.exe" /NH 2^>nul ^| findstr /I "java"') do (
    echo       Killing Java PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=2" %%a in ('tasklist /FI "IMAGENAME eq javaw.exe" /NH 2^>nul ^| findstr /I "javaw"') do (
    echo       Killing Javaw PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

:: Kill by ports
echo   [2/4] Killing processes by port...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8484 :8483 :8585 :3000" ^| findstr "LISTENING" 2^>nul') do (
    echo       Killing PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

:: Kill SwordieMS windows
echo   [3/4] Killing SwordieMS windows...
taskkill /FI "WINDOWTITLE eq SwordieMS*" /F >nul 2>&1

:: Kill Maven processes
echo   [4/4] Killing Maven processes...
for /f "tokens=2" %%a in ('tasklist /FI "IMAGENAME eq mvn.exe" /NH 2^>nul ^| findstr /I "mvn"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo   ========================================
echo   [OK] All processes killed!
echo   ========================================
echo.
pause
goto killall

:kill_specific_port
echo.
set /p portnum="Enter port number to kill: "
if "%portnum%"=="" goto killall
echo.
echo   Searching for processes on port %portnum%...
set "SPECIFIC_KILLED=0"
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%portnum% " ^| findstr "LISTENING" 2^>nul') do (
    echo     Port %portnum% - Killing PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    set "SPECIFIC_KILLED=1"
)
if "!SPECIFIC_KILLED!"=="0" (
    echo   No process found on port %portnum%.
) else (
    echo.
    echo   [OK] Process on port %portnum% killed!
)
echo.
pause
goto killall

:viewlogs
cls
echo ========================================
echo   Log Viewer
echo ========================================
echo.
echo   [1] View Live Log (server_live.log)
echo   [2] View Latest Log File
echo   [3] Open Logs Folder
echo   [4] Clear Live Log
echo   [0] Back to Menu
echo.
set /p logchoice="Select option: "

if "%logchoice%"=="1" goto view_live_log
if "%logchoice%"=="2" goto view_latest_log
if "%logchoice%"=="3" goto open_logs_folder
if "%logchoice%"=="4" goto clear_live_log
if "%logchoice%"=="0" goto menu
goto viewlogs

:view_live_log
if not exist "logs" mkdir logs
if not exist "logs\server_live.log" (
    echo   No live log file found.
    echo   Start the server first!
    pause
    goto viewlogs
)
start "SwordieMS - Live Log" cmd /k "title SwordieMS - Live Log & powershell -Command \"Get-Content -Path 'logs\server_live.log' -Wait -Tail 100\""
goto viewlogs

:view_latest_log
if not exist "logs" (
    echo   No logs folder found.
    pause
    goto viewlogs
)
:: Find latest log file
for /f "delims=" %%F in ('dir /b /od "logs\*.log" 2^>nul') do set "LATEST_LOG=%%F"
if not defined LATEST_LOG (
    echo   No log files found.
    pause
    goto viewlogs
)
echo   Opening: logs\%LATEST_LOG%
start notepad "logs\%LATEST_LOG%"
goto viewlogs

:open_logs_folder
if not exist "logs" mkdir logs
start explorer "logs"
goto viewlogs

:clear_live_log
if exist "logs\server_live.log" (
    type nul > "logs\server_live.log"
    echo   [OK] Live log cleared!
) else (
    echo   No live log file found.
)
pause
goto viewlogs

:check
echo.
call "tools\_config.bat"
echo.
echo ========================================
echo   Environment Check Result
echo ========================================
echo.

if "%PORTABLE_MODE%"=="1" (
    echo   [*] Mode: PORTABLE ^(using libary folder^)
) else (
    echo   [*] Mode: SYSTEM
)
echo.

if "%JAVA_OK%"=="1" (
    echo   [OK] Java Found
    echo       Path: %JAVA_HOME%
) else (
    echo   [X] Java NOT FOUND
    echo.
    echo       Solutions:
    echo         1. Copy JDK 21 to: libary\jdk-21
    echo         2. Or install to: C:\Program Files\Java\jdk-21
)
echo.

if "%MAVEN_OK%"=="1" (
    echo   [OK] Maven Found
    echo       Path: %MAVEN_HOME%
) else (
    echo   [X] Maven NOT FOUND
    echo.
    echo       Solutions:
    echo         1. Copy Maven to: libary\apache-maven-3.x.x
    echo         2. Or install to: C:\Program Files\Maven\apache-maven-*
)
echo.

:: Check ports status
echo ----------------------------------------
echo   Game Ports Status (8484, 8483, 8585, 3000):
echo ----------------------------------------
set "PORT_BUSY=0"
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8484 " ^| findstr "LISTENING" 2^>nul') do (
    echo   [!] Port 8484 is IN USE ^(PID: %%a^)
    set "PORT_BUSY=1"
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8483 " ^| findstr "LISTENING" 2^>nul') do (
    echo   [!] Port 8483 is IN USE ^(PID: %%a^)
    set "PORT_BUSY=1"
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8585 " ^| findstr "LISTENING" 2^>nul') do (
    echo   [!] Port 8585 is IN USE ^(PID: %%a^)
    set "PORT_BUSY=1"
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000 " ^| findstr "LISTENING" 2^>nul') do (
    echo   [!] Port 3000 is IN USE ^(PID: %%a^)
    set "PORT_BUSY=1"
)
if "!PORT_BUSY!"=="0" (
    echo   [OK] All game ports are free ^(8484, 8483, 8585, 3000^)
) else (
    echo.
    echo   [!] Use option [8] to kill conflicting processes.
)
echo.
echo ----------------------------------------
echo   MySQL Database Port Status (3306 / 33060):
echo ----------------------------------------
set "SQL_RUNNING=0"
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3306 " ^| findstr "LISTENING" 2^>nul') do (
    echo   [OK] MySQL Server is running on port 3306 ^(PID: %%a^)
    set "SQL_RUNNING=1"
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":33060 " ^| findstr "LISTENING" 2^>nul') do (
    echo   [OK] MySQL X Protocol is active on port 33060 ^(PID: %%a^)
    set "SQL_RUNNING=1"
)
if "!SQL_RUNNING!"=="0" (
    echo   [X] WARNING: MySQL Server is NOT running on port 3306 or 33060!
    echo       Please start your database (e.g. XAMPP, Laragon, or MySQL service).
)
echo.
echo ========================================
echo.
pause
goto menu

:import_db
echo.
echo ----------------------------------------
echo   Importing Database...
echo ----------------------------------------
echo.
call "import_db.bat"
goto menu

:end
endlocal
exit /b 0
