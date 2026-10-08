@echo off
call "%~dp0_config.bat"

:: Validate
if not "%JAVA_OK%"=="1" (
    echo [X] ERROR: Java JDK 21 not found!
    echo.
    echo     Solutions:
    echo       1. Copy JDK 21 to: libary\jdk-21
    echo       2. Or install to: C:\Program Files\Java\jdk-21
    echo.
    exit /b 1
)
if not "%MAVEN_OK%"=="1" (
    echo [X] ERROR: Maven not found!
    echo.
    echo     Solutions:
    echo       1. Copy Maven to: libary\apache-maven-3.x.x
    echo       2. Or install to: C:\Program Files\Maven\apache-maven-*
    echo.
    exit /b 1
)

:: Kill conflicting ports
echo [*] Checking ports...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8484 :8483 :8585 :3000" ^| findstr "LISTENING" 2^>nul') do (
    echo     Killing PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

:: Check Database on Port 3306
netstat -ano | findstr ":3306 " | findstr "LISTENING" >nul 2>&1
if errorlevel 1 (
    if exist "%PROJECT_ROOT%\libary\mariadb\bin\mysqld.exe" (
        echo [*] Database port 3306 is not active. Auto-starting Portable MariaDB...
        call "%PROJECT_ROOT%\tools\_mariadb.bat" start
    ) else (
        echo [!] WARNING: Database is NOT running on port 3306!
        echo     Please start your MySQL/MariaDB server.
    )
)

if "%PORTABLE_MODE%"=="1" (
    echo [*] Mode:  PORTABLE ^(using libary folder^)
) else (
    echo [*] Mode:  SYSTEM
)
echo [*] Java:  %JAVA_HOME%
echo [*] Maven: %MAVEN_HOME%
echo.
echo ========================================
echo   Server is starting...
echo   Press Ctrl+C to stop
echo ========================================
echo.

call mvn compile exec:java -Dexec.mainClass="net.swordie.ms.Server" -DlogLevel=%LOG_LEVEL% "-Dmaven.repo.local=%PROJECT_ROOT%\libary\repository"

echo.
echo ========================================
echo   Server stopped.
echo ========================================
