# Simulasi FSA OUTPUT dengan Electron

Program ini adalah aplikasi simulasi Finite State Automaton (FSA) yang berjalan di platform desktop. Aplikasi ini dibuat menggunakan Electron.
![gambar fsa output](https://res.cloudinary.com/dmx8hcmxh/image/upload/v1753831699/Screenshot_2025-07-30_06-23-43_hspna4.png)


## Penggunaan Modulo 4 dalam Aplikasi ini

Aplikasi ini menggunakan Finite State Automaton (FSA) untuk memproses input biner. State FSA ditentukan berdasarkan hasil modulo 4 dari jumlah bit '1' dalam input biner.

*   **q0:** Merepresentasikan jumlah bit '1' % 4 = 0
*   **q1:** Merepresentasikan jumlah bit '1' % 4 = 1
*   **q2:** Merepresentasikan jumlah bit '1' % 4 = 2
*   **q3:** Merepresentasikan jumlah bit '1' % 4 = 3

### Contoh menggunakan input Biner

Misalnya, kita memiliki input biner `11`.
![input biner](https://res.cloudinary.com/dmx8hcmxh/image/upload/v1753832155/Screenshot_2025-07-30_06-34-25_e6avtf.png)

State akan berhenti di q3

![final state q3](https://res.cloudinary.com/dmx8hcmxh/image/upload/v1753832162/Screenshot_2025-07-30_06-34-45_bkbh2z.png)

### Contoh menggunakan input Decimal

Misalnya, kita input decimal 10.

![input decimal](https://res.cloudinary.com/dmx8hcmxh/image/upload/v1753832170/Screenshot_2025-07-30_06-35-16_egdicb.png)

Hasil 10 mod % 4 = 2.

State akan berakhir di q2

![final state](https://res.cloudinary.com/dmx8hcmxh/image/upload/v1753832175/Screenshot_2025-07-30_06-35-33_fzorap.png)


# Cara Menjalankan Program

Program ini adalah aplikasi Electron sederhana. Untuk menjalankannya, ikuti langkah-langkah berikut:

1.  Pastikan Anda sudah menginstal Node.js dan npm di komputer Anda.
2.  Buka terminal atau command prompt.
3.  Navigasi ke direktori proyek ini.
4.  Jalankan perintah `npm install` untuk menginstal semua dependensi yang diperlukan.
5.  Setelah dependensi selesai diinstal, jalankan perintah `npm start` untuk memulai aplikasi.

Aplikasi akan terbuka di new window.
