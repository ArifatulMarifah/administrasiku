/**
 * BACKUP & RESTORE DATA — Smart Guru DKV
 * -----------------------------------------
 * Script ini menambahkan fungsi export (download) dan import (upload)
 * untuk data yang tersimpan di localStorage.
 *
 * CARA PAKAI:
 * 1. Simpan file ini di folder yang sama dengan index.html, lalu tambahkan
 *    di bagian bawah <body>, sebelum </body>:
 *       <script src="backup-restore.js"></script>
 *
 * 2. Tambahkan 2 tombol di HTML, di tempat yang sesuai:
 *       <button onclick="exportData()">Download Backup</button>
 *       <input type="file" id="importFile" accept=".json" onchange="importData(event)" style="display:none">
 *       <button onclick="document.getElementById('importFile').click()">Import Backup</button>
 */

// Ambil SEMUA data dari localStorage lalu unduh sebagai file .json
function exportData() {
  const allData = {};

  // Ambil semua key yang ada di localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    try {
      allData[key] = JSON.parse(localStorage.getItem(key));
    } catch {
      allData[key] = localStorage.getItem(key); // kalau bukan JSON, simpan apa adanya
    }
  }

  const jsonString = JSON.stringify(allData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const tanggal = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = url;
  a.download = `backup-administrasiku-${tanggal}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  alert("Backup berhasil diunduh!");
}

// Baca file .json yang dipilih user, lalu tulis kembali ke localStorage
function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);

      const konfirmasi = confirm(
        "Import akan MENIMPA data yang ada saat ini di perangkat ini. Lanjutkan?"
      );
      if (!konfirmasi) return;

      Object.keys(data).forEach((key) => {
        const value =
          typeof data[key] === "string" ? data[key] : JSON.stringify(data[key]);
        localStorage.setItem(key, value);
      });

      alert("Data berhasil di-import! Halaman akan dimuat ulang.");
      location.reload(); // reload agar app membaca ulang data terbaru
    } catch (err) {
      alert("File tidak valid atau rusak. Pastikan ini file backup yang benar.");
      console.error(err);
    }
  };
  reader.readAsText(file);

  // reset input supaya bisa import file yang sama lagi kalau perlu
  event.target.value = "";
}
