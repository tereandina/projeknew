# PANDUAN LENGKAP PENGGUNAAN BOT YOUTUBE VIEW & AUTO-SKIP ADS DI BROWSER AUTOMATION STUDIO (BAS)

Dokumen ini adalah panduan lengkap langkah demi langkah untuk menggunakan, menguji, menjalankan multi-thread, serta meng-compile **YouTube Viewer & Auto-Skip Ads Bot** menggunakan **Browser Automation Studio (BAS) versi 30.5.0**.

---

## 1. File Proyek yang Telah Disediakan

Semua file telah disiapkan di folder proyek Anda:
- **`BAS_YouTube_Bot.xml`** (`C:\Users\Admin\Documents\PROJEK\BAS_YouTube_Bot.xml`): File master proyek Browser Automation Studio.
- **`BUKA_PROYEK_BAS.bat`** (`C:\Users\Admin\Documents\PROJEK\BUKA_PROYEK_BAS.bat`): Shortcut 1-klik untuk membuka langsung proyek ini di BAS.
- **`urls.txt`**: Daftar link video YouTube target yang akan ditonton.
- **`useragents.txt`**: Daftar User-Agent browser untuk penyamaran.
- **`proxies.txt`**: Daftar proxy (opsional, format `ip:port` atau `ip:port:user:pass`).

---

## 2. Cara Membuka Proyek di Browser Automation Studio (BAS)

Karena software BAS sedang terbuka di layar Anda:

### Cara 1: Buka Lewat Menu BAS (Paling Cepat)
1. Di jendela **Browser Automation Studio** yang sedang terbuka, klik menu **Project** di pojok kiri atas.
2. Pilih **Open** (atau tekan tombol ikon folder **Open** di toolbar atas).
3. Arahkan ke file:
   `C:\Users\Admin\Documents\PROJEK\BAS_YouTube_Bot.xml`
4. Klik **Open**.
5. Anda akan melihat di panel sebelah kanan (**Data**) seluruh input resource otomatis muncul (URLs, Threads, Total Tasks, Min/Max Durasi, Jeda Task, dll.).

### Cara 2: Tutup dan Buka Lewat Shortcut Batch
1. Tutup jendela Browser Automation Studio yang sedang terbuka.
2. Klik ganda (double-click) file **`BUKA_PROYEK_BAS.bat`** di folder `C:\Users\Admin\Documents\PROJEK`.
3. BAS akan terbuka dan langsung memuat proyek ini.

---

## 3. Penjelasan Struktur Resource (Panel Kanan "Data")

Saat proyek terbuka di BAS, Anda memiliki kontrol penuh atas parameter bot melalui panel **Data** di sisi kanan:

| Nama Resource | Jenis Input | Fungsi & Nilai Default |
|---|---|---|
| **urls** | File (.txt) | Membaca baris link video YouTube dari `urls.txt`. Tiap browser akan mengambil link secara acak/bergantian. |
| **threads** | Angka | Jumlah browser yang dibuka secara bersamaan (Default: **3**). Dapat dinaikkan ke 5-10 sesuai kapasitas RAM/CPU. |
| **total_tasks** | Angka | Target total penayangan video yang ingin dicapai (Default: **10**). |
| **duration_min** | Angka | Durasi minimal menonton tiap video dalam detik (Default: **30** detik). |
| **duration_max** | Angka | Durasi maksimal menonton tiap video dalam detik (Default: **60** detik). Tiap task akan memilih durasi acak antara Min dan Max. |
| **delay_between** | Angka | Jeda istirahat antar penayangan dalam detik (Default: **5** detik). |
| **proxies** | File / Teks | Daftar proxy jika ingin menggunakan IP berbeda per browser (Default: Kosong / Koneksi langsung). |
| **proxy_type** | Dropdown | Protokol proxy: `http` atau `socks5`. |
| **user_agents** | File (.txt) | Mengubah User-Agent browser dari `useragents.txt` agar tidak terbaca sebagai satu perangkat. |
| **auto_skip_ads** | Dropdown | `Aktif` / `Nonaktif`. Mempercepat video iklan 16x speed & auto-klik tombol lewati iklan. |
| **human_emulation**| Dropdown | `Aktif` / `Nonaktif`. Melakukan scroll halus secara berkala untuk meniru penonton asli. |
| **clear_cache_cookies** | Dropdown | `Aktif` / `Nonaktif`. Membersihkan cookies dan cache browser setiap kali video selesai ditonton. |

---

## 4. Cara Uji Coba (Test Script) di Mode "Record"

Mode **Record** berguna jika Anda ingin melihat jendela browser secara langsung dan menguji bagaimana bot memutar video serta melompati iklan langkah demi langkah.

1. Di menu utama BAS, klik tombol merah **[ Record ]** (di bagian tengah).
2. Sebuah jendela dialog parameter akan muncul. Anda dapat membiarkan nilai default atau menyesuaikan sesuai kebutuhan.
3. Klik **OK**.
4. BAS akan memuat mesin browser dan membuka panel editor visual.
5. Anda akan melihat browser Chromium terbuka, memuat link YouTube dari `urls.txt`, memutar video secara otomatis, melompati iklan jika ada, dan melakukan scroll emulasi manusia.
6. Anda dapat melihat log eksekusi secara real-time di bagian panel bawah.
7. Jika sudah selesai menguji, klik tombol silang atau kembali ke menu utama.

---

## 5. Cara Menjalankan Bot Multi-Thread di Mode "Run"

Mode **Run** adalah mode kerja utama untuk penayangan massal (Multi-Thread):

1. Di menu utama BAS, klik tombol hijau **[ Run ]** (di bawah tombol Record).
2. Jendela antarmuka form pengisian akan muncul:
   - Pilih file `urls.txt`.
   - Atur **Concurrent Browsers (Threads)**: misalnya `3` atau `5`.
   - Atur **Target Total Views (Tasks)**: misalnya `20` atau `50`.
   - Atur rentang durasi tonton (misal 45 - 90 detik).
   - Atur pilihan skip iklan dan pembersihan cache.
3. Klik tombol **OK** atau **Start**.
4. Bot akan langsung membuka beberapa thread browser sesuai jumlah `threads` yang Anda tentukan:
   - Status penayangan sukses/gagal dihitung otomatis.
   - Grafik progress dan log setiap browser ditampilkan secara rapi.
   - Bot akan terus berjalan hingga target total tasks tercapai, lalu berhenti secara otomatis.

---

## 6. Cara Meng-Compile Menjadi Aplikasi Standalone (.exe)

Salah satu keunggulan terbesar Browser Automation Studio adalah Anda dapat mengubah proyek ini menjadi aplikasi `.exe` mandiri yang dapat dijalankan di komputer mana pun tanpa perlu membuka BAS:

1. Di menu bar toolbar atas BAS, klik ikon **Compile** (ikon kotak kardus cokelat bertuliskan **Compile** di sebelah tombol Stop).
2. Jendela **Script Compilation** akan muncul:
   - **Script Name**: Beri nama aplikasi, misalnya `YouTube Viewer Bot`.
   - **Version**: Masukkan versi, misalnya `1.0.0`.
   - **Icon**: Anda dapat memilih file `.ico` custom jika memiliki logo sendiri.
   - **Protection / License**: Pilih `No Protection` untuk penggunaan bebas.
3. Klik tombol **Compile**.
4. Tunggu beberapa detik hingga proses build selesai.
5. BAS akan membuat folder output berisi file executable `.exe`.
6. Anda sekarang memiliki aplikasi bot YouTube mandiri dengan antarmuka grafis (GUI) modern yang siap digunakan kapan saja!

---

## 7. Tips Penggunaan Proxy & Surfshark VPN

- **Jika Menggunakan Proxy**:
  - Buka file `proxies.txt` di notepad.
  - Masukkan daftar proxy dengan format: `ip:port` atau `ip:port:username:password` (satu proxy per baris).
  - Pada input form BAS di bagian **proxies**, ubah jenis input ke **LinesFromFile** lalu pilih file `proxies.txt`.
  - Setiap browser thread yang dibuka oleh BAS akan otomatis menggunakan proxy yang berbeda!
- **Jika Menggunakan Surfshark VPN**:
  - Anda dapat mengaktifkan aplikasi Surfshark VPN Desktop pada komputer Anda dan mengaktifkan fitur *CleanWeb* / *Auto-Connect*.
  - Atau gunakan fitur **SOCKS5 / HTTP Proxy credentials** dari akun Surfshark Anda (tersedia di dashboard web Surfshark di menu *VPN -> Manual Setup -> SOCKS5*) lalu masukkan daftar IP server Surfshark tersebut ke dalam `proxies.txt`.

---

## 8. Ringkasan Keunggulan Proyek BAS ini

1. **Anti-Deteksi Kuat**: BAS menggunakan native Chromium Embedded Framework dengan flag anti-bot (`--disable-blink-features=AutomationControlled`).
2. **Dual-Engine Skip Iklan**: Iklan dipercepat hingga 16x lipat sehingga iklan berdurasi 15-30 detik selesai dalam 1-2 detik, disertai auto-click tombol lewati iklan.
3. **Multi-Thread Sangat Ringan**: Pengelolaan multi-browser dikelola secara efisien oleh C++ native engine BAS tanpa membebani sistem secara berlebih.
4. **Bisa Di-Compile Menjadi .exe**: Menghasilkan installer / standalone binary yang siap dibagikan atau dijalankan langsung.
