@echo off
title SwordieMS - Portable MariaDB Setup
chcp 65001 >nul 2>&1
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup_portable_mariadb.ps1" %*
if errorlevel 1 pause
