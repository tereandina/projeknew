$Host.UI.RawUI.WindowTitle = "Pemeriksa Status VPN & IP Publik"
Clear-Host

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "             PEMERIKSA STATUS IP PUBLIK & VPN                    " -ForegroundColor White
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host " Sedang mendeteksi jaringan..." -ForegroundColor Gray

$data = $null

# Coba sumber 1: ip-api.com
try {
    $res = Invoke-RestMethod -Uri "http://ip-api.com/json" -TimeoutSec 5 -ErrorAction Stop
    if ($res -and $res.query) {
        $data = [PSCustomObject]@{
            IP      = $res.query
            Country = $res.country
            Code    = $res.countryCode
            City    = $res.city
            ISP     = $res.isp
            Org     = $res.org
        }
    }
} catch {}

# Fallback sumber 2: ipinfo.io
if (-not $data) {
    try {
        $res = Invoke-RestMethod -Uri "https://ipinfo.io/json" -TimeoutSec 5 -ErrorAction Stop
        if ($res -and $res.ip) {
            $data = [PSCustomObject]@{
                IP      = $res.ip
                Country = $res.country
                Code    = $res.country
                City    = $res.city
                ISP     = $res.org
                Org     = $res.org
            }
        }
    } catch {}
}

# Fallback sumber 3: api.ipify.org
if (-not $data) {
    try {
        $ipOnly = (Invoke-RestMethod -Uri "https://api.ipify.org" -TimeoutSec 5 -ErrorAction Stop).Trim()
        if ($ipOnly) {
            $data = [PSCustomObject]@{
                IP      = $ipOnly
                Country = "Online"
                Code    = "-"
                City    = "-"
                ISP     = "Jaringan Aktif"
                Org     = "-"
            }
        }
    } catch {}
}

Write-Host ""
if ($data) {
    Write-Host "----------------- HASIL PENGECEKAN JARINGAN ------------------" -ForegroundColor Yellow
    Write-Host ("  [+] IP Publik       : " + $data.IP) -ForegroundColor Green
    Write-Host ("  [+] Lokasi Negara   : " + $data.Country + " (" + $data.Code + ")") -ForegroundColor White
    Write-Host ("  [+] Wilayah / Kota  : " + $data.City) -ForegroundColor White
    Write-Host ("  [+] Penyedia / ISP  : " + $data.ISP) -ForegroundColor White
    Write-Host "--------------------------------------------------------------" -ForegroundColor Yellow
    Write-Host ""

    # Cek apakah terindikasi VPN / Server Luar
    $ispLower = ($data.ISP + " " + $data.Org).ToLower()
    $isVpn = ($ispLower -match "m247|surfshark|proton|mullvad|nord|datacenter|digitalocean|ovh|leaseweb|choopa|fastly|cloudflare|vultr|linode|packet") -or ($data.Code -ne "ID" -and $data.Country -ne "Indonesia")

    if ($isVpn) {
        Write-Host "  >>> STATUS: [AMAN] TERHUBUNG KE VPN / PROXY LUAR NEGERI <<<" -ForegroundColor Green
        Write-Host "      Identitas asli Anda terlindungi dan lokasi berubah." -ForegroundColor Gray
    } else {
        Write-Host "  >>> STATUS: KONEKSI LANGSUNG (LOKAL INDONESIA) <<<" -ForegroundColor Yellow
        Write-Host "      Jika ingin aman, aktifkan Surfshark VPN terlebih dahulu." -ForegroundColor Gray
    }
} else {
    Write-Host "  [-] Gagal mendeteksi IP. Pastikan komputer terhubung ke internet." -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""
