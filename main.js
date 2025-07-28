const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

let mainWindow; // Referensi global ke window utama

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            // Penting: Mengaktifkan nodeIntegration dan contextIsolation
            // untuk memungkinkan ipcRenderer di script renderer Anda.
            // Untuk keamanan, disarankan menggunakan preload script
            // tapi untuk contoh cepat, nodeIntegration: true lebih sederhana.
            nodeIntegration: true, // Hati-hati dengan ini di produksi
            contextIsolation: false, // Hati-hati dengan ini di produksi
            preload: path.join(__dirname, 'preload.js') // Pilihan lebih aman
        }
    });

    mainWindow.loadFile('index.html'); // Memuat HTML Anda

    // Opsional: Buka DevTools saat aplikasi dimulai
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// **Perubahan di sini:** Menerima pesan dari renderer process
ipcMain.on('fsa-final-state', (event, finalImageData) => {
    console.log('Received final state from renderer:', finalImageData);

    // Di sini Anda bisa melakukan sesuatu dengan data yang diterima:
    // 1. Log ke konsol main process (sudah dilakukan di atas)
    // 2. Tampilkan di jendela lain (jika ada jendela kedua)
    // 3. Simpan ke file
    // 4. Lakukan operasi backend lainnya

    // Contoh: Mengirim kembali ke renderer atau ke window lain
    // Jika Anda ingin mengirim kembali ke renderer yang sama:
    // event.sender.send('response-from-main', 'Data berhasil diterima!');

    // Contoh: Membuka window baru untuk menampilkan gambar (jika itu yang Anda inginkan)
    // createImageViewerWindow(finalImageData.imageUrl);
});

// Fungsi opsional untuk membuka window baru (jika diperlukan)
function createImageViewerWindow(imageUrl) {
    let imageWindow = new BrowserWindow({
        width: 400,
        height: 400,
        title: 'Final State Image',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Anda bisa membuat file HTML terpisah untuk window ini
    // Misalnya, image_viewer.html yang memiliki <img> tag
    // imageWindow.loadFile('image_viewer.html');
    // imageWindow.webContents.on('did-finish-load', () => {
    //     imageWindow.webContents.send('load-image', imageUrl);
    // });

    // Atau langsung memuat konten HTML dengan gambar
    imageWindow.loadURL(`data:text/html;charset=utf-8,
        <!DOCTYPE html>
        <html>
        <head>
            <title>Gambar State Akhir</title>
            <style>
                body { margin: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; background-color: #f0f0f0; }
                img { max-width: 90%; max-height: 90%; border: 3px solid #007bff; border-radius: 8px; }
                p { font-family: Arial, sans-serif; margin-top: 10px; }
            </style>
        </head>
        <body>
            <p>State Berhenti:</p>
            <img src="${imageUrl}" alt="Final State Image">
        </body>
        </html>
    `);
}