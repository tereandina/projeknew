@echo off
title UPDATE PROXY ROTASI
cls
echo ==================================================================
echo           MEMPERBARU DAFTAR PROXY VPN ROTASI PER-TASK
echo ==================================================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0fetch_proxies.ps1"
echo.
echo Selesai! Daftar proxy baru sudah disimpan ke proxies.txt
echo Tekan sembarang tombol untuk selesai...
pause >nul