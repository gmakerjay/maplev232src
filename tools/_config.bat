@echo off
:: ==========================================
:: Auto-detect Java and Maven (Portable First)
:: ==========================================
:: Priority: libary folder > jdk/maven folders > system PATH
:: ==========================================

set "LOG_LEVEL=DEBUG"
set "JAVA_HOME="
set "MAVEN_HOME="

:: Get project root directory
set "PROJECT_ROOT=%~dp0.."
for %%F in ("%PROJECT_ROOT%") do set "PROJECT_ROOT=%%~fF"

:: ==========================================
:: STEP 1: Find Java JDK 21 (Portable First)
:: ==========================================

:: 1.0 PORTABLE: Check libary folder FIRST!
if exist "%PROJECT_ROOT%\libary\jdk-21\bin\java.exe" (
    set "JAVA_HOME=%PROJECT_ROOT%\libary\jdk-21"
    goto :java_done
)

:: 1.0b Check for any jdk-21* in libary
for /d %%D in ("%PROJECT_ROOT%\libary\jdk-21*") do (
    if exist "%%~D\bin\java.exe" (
        set "JAVA_HOME=%%~D"
        goto :java_done
    )
)

:: 1.1 Portable in project jdk folder
if exist "%PROJECT_ROOT%\jdk\bin\java.exe" (
    set "JAVA_HOME=%PROJECT_ROOT%\jdk"
    goto :java_done
)

:: 1.2 Standard Oracle/Adoptium path
if exist "C:\Program Files\Java\jdk-21\bin\java.exe" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-21"
    goto :java_done
)

:: 1.3 Adoptium (Temurin) with version suffix
for /d %%D in ("C:\Program Files\Eclipse Adoptium\jdk-21*") do (
    if exist "%%~D\bin\java.exe" (
        set "JAVA_HOME=%%~D"
        goto :java_done
    )
)

:: 1.4 Amazon Corretto
for /d %%D in ("C:\Program Files\Amazon Corretto\jdk21*") do (
    if exist "%%~D\bin\java.exe" (
        set "JAVA_HOME=%%~D"
        goto :java_done
    )
)

:: 1.5 Microsoft OpenJDK
for /d %%D in ("C:\Program Files\Microsoft\jdk-21*") do (
    if exist "%%~D\bin\java.exe" (
        set "JAVA_HOME=%%~D"
        goto :java_done
    )
)

:: 1.6 Zulu
for /d %%D in ("C:\Program Files\Zulu\zulu-21*") do (
    if exist "%%~D\bin\java.exe" (
        set "JAVA_HOME=%%~D"
        goto :java_done
    )
)

:: 1.7 Root of C drive
for /d %%D in ("C:\jdk-21*") do (
    if exist "%%~D\bin\java.exe" (
        set "JAVA_HOME=%%~D"
        goto :java_done
    )
)
for /d %%D in ("C:\jdk21*") do (
    if exist "%%~D\bin\java.exe" (
        set "JAVA_HOME=%%~D"
        goto :java_done
    )
)

:: 1.8 Any Java 21 in Program Files\Java
for /d %%D in ("C:\Program Files\Java\jdk-21*") do (
    if exist "%%~D\bin\java.exe" (
        set "JAVA_HOME=%%~D"
        goto :java_done
    )
)

:java_done

:: ==========================================
:: STEP 2: Find Maven (Portable First)
:: ==========================================

:: 2.0 PORTABLE: Check libary folder FIRST!
for /d %%M in ("%PROJECT_ROOT%\libary\apache-maven-*") do (
    if exist "%%~M\bin\mvn.cmd" (
        set "MAVEN_HOME=%%~M"
        goto :maven_done
    )
)

:: 2.0b Check libary\maven folder
if exist "%PROJECT_ROOT%\libary\maven\bin\mvn.cmd" (
    set "MAVEN_HOME=%PROJECT_ROOT%\libary\maven"
    goto :maven_done
)

:: 2.1 Portable in project maven folder
if exist "%PROJECT_ROOT%\maven\bin\mvn.cmd" (
    set "MAVEN_HOME=%PROJECT_ROOT%\maven"
    goto :maven_done
)

:: 2.2 Standard path in Program Files\Maven
for /d %%M in ("C:\Program Files\Maven\apache-maven-*") do (
    if exist "%%~M\bin\mvn.cmd" (
        set "MAVEN_HOME=%%~M"
        goto :maven_done
    )
)

:: 2.3 Direct in Program Files
for /d %%M in ("C:\Program Files\apache-maven-*") do (
    if exist "%%~M\bin\mvn.cmd" (
        set "MAVEN_HOME=%%~M"
        goto :maven_done
    )
)

:: 2.4 Root of C drive
for /d %%M in ("C:\apache-maven-*") do (
    if exist "%%~M\bin\mvn.cmd" (
        set "MAVEN_HOME=%%~M"
        goto :maven_done
    )
)
for /d %%M in ("C:\Maven\apache-maven-*") do (
    if exist "%%~M\bin\mvn.cmd" (
        set "MAVEN_HOME=%%~M"
        goto :maven_done
    )
)

:maven_done

:: ==========================================
:: STEP 3: Update PATH (Portable paths first)
:: ==========================================
if defined JAVA_HOME set "PATH=%JAVA_HOME%\bin;%PATH%"
if defined MAVEN_HOME set "PATH=%MAVEN_HOME%\bin;%PATH%"

:: ==========================================
:: STEP 4: Final Validation
:: ==========================================
set "JAVA_OK=0"
set "MAVEN_OK=0"
set "PORTABLE_MODE=0"

if defined JAVA_HOME (
    if exist "%JAVA_HOME%\bin\java.exe" set "JAVA_OK=1"
)

if defined MAVEN_HOME (
    if exist "%MAVEN_HOME%\bin\mvn.cmd" set "MAVEN_OK=1"
)

:: Check if running in portable mode
echo "%JAVA_HOME%" | findstr /I "libary" >nul 2>&1
if not errorlevel 1 set "PORTABLE_MODE=1"
