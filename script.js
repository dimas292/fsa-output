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

// FSA State Transition Logic
const fsaTransitions = {
    'A1': {
        '0': 'A2',
        '1': 'A1'
    },
    'A2': {
        '0': 'A3',
        '1': 'A1'
    },
    'A3': {
        '0': 'A4',
        '1': 'A1'
    },
    'A4': {
        '0': 'A4',
        '1': 'A4'
    }
};

// Map states to their corresponding image URLs
const stateImages = {
    'A1': 'images/states/A1.jpg', // Pink
    'A2': 'images/states/A2.png', // SteelBlue
    'A3': 'images/states/A3.jpg', // Orchid
    'A4': 'images/states/A4.jpg'  // LimeGreen
};


function processInput() {
    const decimalInput = document.getElementById('decimalInput').value;
    const decimalOutputSpan = document.getElementById('decimalOutput');
    const binaryOutputSpan = document.getElementById('binaryOutput');
    const finalStateSpan = document.getElementById('finalState');
    const resultStateImage = document.getElementById('resultStateImage'); // Get the image element
    const resultDialog = document.getElementById('resultDialog'); // <<< Pastikan ini ada

    if (decimalInput === "" || isNaN(decimalInput) || parseInt(decimalInput) < 0) {
        alert("Mohon masukkan angka desimal yang valid (bilangan bulat non-negatif).");
        decimalOutputSpan.textContent = "";
        binaryOutputSpan.textContent = "";
        finalStateSpan.textContent = "Invalid Input";
        resultStateImage.src = "";
        return;
    }

    const decimalValue = parseInt(decimalInput);
    const binaryValue = decimalToBinary(decimalValue);

    decimalOutputSpan.textContent = decimalValue;
    binaryOutputSpan.textContent = binaryValue;

    let currentState = 'A1'; // Start from initial state A1

    // Simulate FSA transitions
    for (let i = 0; i < binaryValue.length; i++) {
        const bit = binaryValue[i];
        if (fsaTransitions[currentState] && fsaTransitions[currentState][bit]) {
            currentState = fsaTransitions[currentState][bit];
        } else {
            console.error("Invalid transition for state " + currentState + " and bit " + bit);
            finalStateSpan.textContent = "Error in FSA logic";
            resultStateImage.src = "";
            resultDialog.showModal(); // Pastikan dialog muncul bahkan jika ada error logika
            return;
        }
    }

    finalStateSpan.textContent = currentState;
    resultStateImage.src = stateImages[currentState]; // Set the image source based on the final state

    // **Ini adalah baris yang memastikan dialog muncul di frontend Anda**
    resultDialog.showModal(); // <<< PENTING: Panggil ini untuk menampilkan dialog

    // Event listener for closing the dialog
    document.getElementById('closeDialog').onclick = function() {
        resultDialog.close();
    };

    // Ini adalah bagian Electron IPC yang mengirim data ke proses utama
    // Ini tidak berpengaruh pada tampilan dialog di window renderer ini
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