@echo off
title CEK STATUS LONEKSI DAN VPN
cls
echo ===================================================================
echo          PEMERIKSA STATUS KONEKSI VPN DAN JARINGAN
echo ===================================================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scratch_check_vpn.ps1"
echo.
echo Tekan sembarang tombol untuk keluar...
pause >nul