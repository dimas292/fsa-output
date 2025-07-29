# Simulasi FSA dengan Electron

Program ini adalah aplikasi simulasi Finite State Automaton (FSA) yang berjalan di platform desktop. Aplikasi ini dibuat menggunakan Electron.

# Cara Menjalankan Program

Program ini adalah aplikasi Electron sederhana. Untuk menjalankannya, ikuti langkah-langkah berikut:

1.  Pastikan Anda sudah menginstal Node.js dan npm di komputer Anda.
2.  Buka terminal atau command prompt.
3.  Navigasi ke direktori proyek ini.
4.  Jalankan perintah `npm install` untuk menginstal semua dependensi yang diperlukan.
5.  Setelah dependensi selesai diinstal, jalankan perintah `npm start` untuk memulai aplikasi.

Aplikasi akan terbuka dalam jendela baru.

## Catatan

*   Pastikan semua dependensi terinstal dengan benar sebelum menjalankan aplikasi.
*   Jika terjadi kesalahan, periksa log untuk informasi lebih lanjut.

## Penggunaan Modulo 4 dalam Aplikasi ini

Aplikasi ini menggunakan Finite State Automaton (FSA) untuk memproses input biner. State FSA ditentukan berdasarkan hasil modulo 4 dari jumlah bit '1' dalam input biner.

*   **q0:** Merepresentasikan jumlah bit '1' % 4 = 0
*   **q1:** Merepresentasikan jumlah bit '1' % 4 = 1
*   **q2:** Merepresentasikan jumlah bit '1' % 4 = 2
*   **q3:** Merepresentasikan jumlah bit '1' % 4 = 3

### Contoh

Misalnya, kita memiliki input biner `11`.

1. Jumlah bit '1' adalah 2.
2. 2 % 4 = 2.
3. Oleh karena itu, FSA akan berhenti di state `q2`.

Contoh lain, kita memiliki input biner `1101`.

1. Jumlah bit '1' adalah 3.
2. 3 % 4 = 3.
3. Oleh karena itu, FSA akan berhenti di state `q3`.

Contoh lain, kita memiliki input biner `1111`.

1. Jumlah bit '1' adalah 4.
2. 4 % 4 = 0.
3. Oleh karena itu, FSA akan berhenti di state `q0`.

Contoh lain, kita memiliki input biner `1011`.

1. Jumlah bit '1' adalah 3.
2. 3 % 4 = 3.
3. Oleh karena itu, FSA akan berhenti di state `q3`.

Contoh lain, kita memiliki input desimal 11.

1. Konversi ke biner: 1011
2. Jumlah bit '1' adalah 3.
3. 3 % 4 = 3.
4. Oleh karena itu, FSA akan berhenti di state `q3`.