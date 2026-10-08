@echo off
title SwordieMS - Database Auto Importer
chcp 65001 >nul 2>&1
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "tools\import_db.ps1" %*
if errorlevel 1 pause
