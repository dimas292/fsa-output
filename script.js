const { ipcRenderer } = require('electron'); // Tetap pastikan ini ada jika menggunakan Electron

// Function to convert Decimal to Binary (manual calculation)
function decimalToBinary(decimal) {
    if (decimal === 0) {
        return "0";
    }

    let binary = "";
    let tempDecimal = decimal;

    while (tempDecimal > 0) {
        binary = (tempDecimal % 2) + binary;
        tempDecimal = Math.floor(tempDecimal / 2);
    }
    return binary;
}

// --- Perbaikan di sini: Logika Transisi FSA untuk 'jumlah bit 1 modulo 4' ---
// Nama state diubah dari A1, A2, A3, A4 menjadi q0, q1, q2, q3
// FSA State Transition Logic for 'Decimal Value Modulo 4'
const fsaTransitions = {
    'q0': { // Current value % 4 = 0
        '0': 'q0', // (0 * 2 + 0) % 4 = 0
        '1': 'q1'  // (0 * 2 + 1) % 4 = 1
    },
    'q1': { // Current value % 4 = 1
        '0': 'q2', // (1 * 2 + 0) % 4 = 2
        '1': 'q3'  // (1 * 2 + 1) % 4 = 3
    },
    'q2': { // Current value % 4 = 2
        '0': 'q0', // (2 * 2 + 0) % 4 = 4 % 4 = 0
        '1': 'q1'  // (2 * 2 + 1) % 4 = 5 % 4 = 1
    },
    'q3': { // Current value % 4 = 3
        '0': 'q2', // (3 * 2 + 0) % 4 = 6 % 4 = 2
        '1': 'q3'  // (3 * 2 + 1) % 4 = 7 % 4 = 3
    }
};


// Map states to their corresponding image URLs
// Nama state diubah dari A1, A2, A3, A4 menjadi q0, q1, q2, q3
const stateImages = {
    'q0': 'images/states/A1.jpg', // Pink (representasi 0 mod 4 - menggunakan gambar A1 yang lama jika ada)
    'q1': 'images/states/A2.png', // SteelBlue (representasi 1 mod 4 - menggunakan gambar A2 yang lama jika ada)
    'q2': 'images/states/A3.jpg', // Orchid (representasi 2 mod 4 - menggunakan gambar A3 yang lama jika ada)
    'q3': 'images/states/A4.jpg'  // LimeGreen (representasi 3 mod 4 - menggunakan gambar A4 yang lama jika ada)
};


function processInput() {
    const decimalInput = document.getElementById('decimalInput').value;
    const binaryInput = document.getElementById('binaryInput').value;
    const decimalOutputSpan = document.getElementById('decimalOutput');
    const binaryOutputSpan = document.getElementById('binaryOutput');
    const finalStateSpan = document.getElementById('finalState');
    const resultStateImage = document.getElementById('resultStateImage');
    const resultDialog = document.getElementById('resultDialog');

    let inputValue = "";
    let inputType = "";

    // Validasi input
    if (decimalInput !== "" && !isNaN(decimalInput) && parseInt(decimalInput) >= 0) {
        inputValue = parseInt(decimalInput);
        inputType = "decimal";
    } else if (binaryInput !== "" && /^[01]+$/.test(binaryInput)) {
        inputValue = binaryInput;
        inputType = "binary";
    } else {
        alert("Mohon masukkan angka desimal atau biner yang valid.");
        decimalOutputSpan.textContent = "";
        binaryOutputSpan.textContent = "";
        finalStateSpan.textContent = "Invalid Input";
        resultStateImage.src = "";
        return;
    }

    let binaryValue = "";
    let decimalValue = "";

    if (inputType === "decimal") {
        decimalValue = parseInt(inputValue);
        // --- Perbaikan di sini: Hapus atau sesuaikan validasi kelipatan 3 jika tidak relevan dengan Modulo 4 ---
        // if (decimalValue % 3 !== 0) {
        //     alert("Mohon masukkan angka desimal yang merupakan kelipatan 3.");
        //     decimalOutputSpan.textContent = "";
        //     binaryOutputSpan.textContent = "";
        //     finalStateSpan.textContent = "Invalid Input";
        //     resultStateImage.src = "";
        //     return;
        // }
        binaryValue = decimalToBinary(decimalValue);
    } else {
        binaryValue = inputValue;
        decimalValue = parseInt(binaryValue, 2);
    }

    decimalOutputSpan.textContent = decimalValue;
    binaryOutputSpan.textContent = binaryValue;

    // --- Perbaikan di sini: State awal harus q0 untuk representasi 0 modulo 4 ---
    let currentState = 'q0'; // Mulai dari state q0, yang merepresentasikan 0 modulo 4

    // Simulate FSA transitions
    for (let i = 0; i < binaryValue.length; i++) {
        const bit = binaryValue[i];
        if (fsaTransitions[currentState] && fsaTransitions[currentState][bit]) {
            currentState = fsaTransitions[currentState][bit];
        } else {
            console.error("Transisi tidak valid untuk state " + currentState + " dan bit " + bit);
            finalStateSpan.textContent = "Error dalam logika FSA";
            resultStateImage.src = "";
            resultDialog.showModal();
            return;
        }
    }

    finalStateSpan.textContent = currentState;
    resultStateImage.src = stateImages[currentState]; // Set the image source based on the final state

    // Tampilkan dialog hasil
    resultDialog.showModal();

    // Event listener for closing the dialog
    document.getElementById('closeDialog').onclick = function() {
        resultDialog.close();
    };

    // Ini adalah bagian Electron IPC yang mengirim data ke proses utama
    const finalImageData = {
        state: currentState,
        imageUrl: stateImages[currentState]
    };
    if (typeof ipcRenderer !== 'undefined') {
        ipcRenderer.send('fsa-final-state', finalImageData);
        console.log('Mengirim data ke main process:', finalImageData);
    } else {
        console.warn('ipcRenderer tidak tersedia. Mungkin Anda menjalankan ini di luar Electron.');
    }
}