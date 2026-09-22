@echo off
title Membuka YouTube Bot di Browser Automation Studio
cd /d "%~dp0"

echo ========================================================
echo   MEMBUKA YOUTUBE BOT DI BROWSER AUTOMATION STUDIO (BAS)
echo ========================================================

echo 1. Menutup proses lama jika ada...
taskkill /F /IM BrowserAutomationStudio.exe >nul 2>&1
taskkill /F /IM Worker.exe >nul 2>&1
taskkill /F /IM worker.exe >nul 2>&1
ping 127.0.0.1 -n 2 >nul
rd /s /q "%APPDATA%\BrowserAutomationStudio\apps\30.5.0\external" >nul 2>&1
rem Sync files maintained


set "PROJ_FILE=%~dp0BAS_YouTube_Bot.xml"
set "BAS_DIR=C:\Users\Admin\AppData\Roaming\BrowserAutomationStudio\apps\30.5.0"
set "BAS_EXE=%BAS_DIR%\BrowserAutomationStudio.exe"

if not exist "%BAS_EXE%" (
    set "BAS_DIR=C:\Users\Admin\AppData\Roaming\BrowserAutomationStudio"
    set "BAS_EXE=%BAS_DIR%\BrowserAutomationStudio.exe"
)

echo 2. Membuka Browser Automation Studio...
start "" /D "%BAS_DIR%" "%BAS_EXE%" "%PROJ_FILE%"

echo.
echo ========================================================
echo  [OK] Browser Automation Studio sedang dibuka!
echo  Tunggu beberapa detik sampai jendela aplikasi muncul.
echo ========================================================
ping 127.0.0.1 -n 4 >nul
