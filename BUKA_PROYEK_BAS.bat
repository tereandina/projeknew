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

rem Kunci skala tampilan Qt ke 100% normal (tidak nge-zoom)
set "QT_AUTO_SCREEN_SCALE_FACTOR=0"
set "QT_SCALE_FACTOR=1"
set "QT_ENABLE_HIGHDPI_SCALING=0"
set "QT_FONT_DPI=96"

set "PROJ_FILE=%~dp0BAS_YouTube_Bot.xml"
set "BAS_DIR=C:\Users\Admin\AppData\Roaming\BrowserAutomationStudio\apps\30.5.0"
set "BAS_EXE=%BAS_DIR%\BrowserAutomationStudio.exe"

if not exist "%BAS_EXE%" (
    set "BAS_DIR=C:\Users\Admin\AppData\Roaming\BrowserAutomationStudio"
    set "BAS_EXE=%BAS_DIR%\BrowserAutomationStudio.exe"
)

echo 2. Membuka Browser Automation Studio (Skala Normal 100%)...
start "" /D "%BAS_DIR%" "%BAS_EXE%" "%PROJ_FILE%"

echo.
echo ========================================================
echo  [OK] Browser Automation Studio dibuka dengan skala normal!
echo ========================================================
timeout /t 4 >nul