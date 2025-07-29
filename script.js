const { ipcRenderer } = require('electron');

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

// FSA State Transition Logic for 'Decimal Value Modulo 4'
// State q0, q1, q2, q3 merepresentasikan nilai desimal biner modulo 4
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
const stateImages = {
    'q0': 'images/states/A1.jpg', // Asumsi A1.jpg digunakan untuk q0
    'q1': 'images/states/A2.png', // Asumsi A2.png digunakan untuk q1
    'q2': 'images/states/A3.jpg', // Asumsi A3.jpg digunakan untuk q2
    'q3': 'images/states/A4.jpg'  // Asumsi A4.jpg digunakan untuk q3
};


function processInput() {
    const decimalOutputSpan = document.getElementById('decimalOutput');
    const binaryOutputSpan = document.getElementById('binaryOutput');
    const finalStateSpan = document.getElementById('finalState');
    const resultStateImage = document.getElementById('resultStateImage');
    const resultDialog = document.getElementById('resultDialog');

    let inputValue = "";
    let inputType = "";
    let isValidInput = false;

    if (document.getElementById('decimalRadio').checked) {
        const decimalInput = document.getElementById('decimalInput').value.trim();
        if (decimalInput !== "" && !isNaN(decimalInput) && parseInt(decimalInput) >= 0) {
            inputValue = parseInt(decimalInput);
            inputType = "decimal";
            isValidInput = true;
        } else {
            alert("Mohon masukkan angka desimal yang valid (bilangan bulat non-negatif).");
            decimalOutputSpan.textContent = "";
            binaryOutputSpan.textContent = "";
            finalStateSpan.textContent = "Invalid Input";
            resultStateImage.src = "";
            return;
        }
    } else {
        const binaryInput = document.getElementById('binaryInput').value.trim();
        if (binaryInput !== "" && /^[01]+$/.test(binaryInput)) {
            inputValue = binaryInput;
            inputType = "binary";
            isValidInput = true;
        } else {
            alert("Mohon masukkan angka biner yang valid (hanya 0 dan 1).");
            decimalOutputSpan.textContent = "";
            binaryOutputSpan.textContent = "";
            finalStateSpan.textContent = "Invalid Input";
            resultStateImage.src = "";
            return;
        }
    }

    if (!isValidInput) {
        return; // Stop if input is not valid
    }

    let binaryValue = "";
    let decimalValue = "";

    if (inputType === "decimal") {
        decimalValue = parseInt(inputValue);
        binaryValue = decimalToBinary(decimalValue);
    } else { // inputType === "binary"
        binaryValue = inputValue;
        decimalValue = parseInt(binaryValue, 2);
    }

    decimalOutputSpan.textContent = decimalValue;
    binaryOutputSpan.textContent = binaryValue;

    let currentState = 'q0';

    // Simulate FSA transitions
    for (let i = 0; i < binaryValue.length; i++) {
        const bit = binaryValue[i];
        if (fsaTransitions[currentState] && fsaTransitions[currentState][bit]) {
            currentState = fsaTransitions[currentState][bit];
        } else {
            console.error("Kesalahan internal FSA: Transisi tidak valid untuk state " + currentState + " dan bit " + bit);
            finalStateSpan.textContent = "Error Logika FSA Internal";
            resultStateImage.src = "";
            resultDialog.showModal();
            return;
        }
    }

    finalStateSpan.textContent = currentState;
    resultStateImage.src = stateImages[currentState];
    resultDialog.showModal();

    document.getElementById('closeDialog').onclick = function() {
        resultDialog.close();
    };

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