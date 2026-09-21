$resp = Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt' -UseBasicParsing
$lines = $resp.Content -split "`r`n|`n" | Where-Object { $_.Trim() -ne '' }
Write-Host "Total proxies fetched: $($lines.Count)"
$selected = $lines | Select-Object -First 60
[System.IO.File]::WriteAllLines('C:\Users\Admin\Documents\PROJWK NEW\proxies.txt', $selected, [System.Text.Encoding]::ASCII)
Write-Host "Saved $($selected.Count) proxies into C:\Users\Admin\Documents\PROJWK NEW\proxies.txt"
