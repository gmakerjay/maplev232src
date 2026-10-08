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

if "%PORTABLE_MODE%"=="1" (
    echo [*] Mode:  PORTABLE ^(using libary folder^)
) else (
    echo [*] Mode:  SYSTEM
)
echo [*] Java:  %JAVA_HOME%
echo [*] Maven: %MAVEN_HOME%
echo.
echo [*] Compiling... (please wait)
echo.

call mvn clean package -DskipTests "-Dmaven.repo.local=%PROJECT_ROOT%\libary\repository"

if errorlevel 1 (
    echo.
    echo [X] Build FAILED!
    exit /b 1
)

echo.
echo ========================================
echo [OK] Build successful!
echo ========================================
