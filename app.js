const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

let key;

async function generateKey() {
    key = await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

async function encryptText(plainText) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const encodedText = textEncoder.encode(plainText);

    const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encodedText
    );

    return {
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encryptedBuffer))
    };
}

async function decryptText(encryptedData) {
    const iv = new Uint8Array(encryptedData.iv);
    const encryptedBuffer = new Uint8Array(encryptedData.data).buffer;

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encryptedBuffer
    );

    return textDecoder.decode(decryptedBuffer);
}

document.getElementById('encryptButton').addEventListener('click', async () => {
    const inputText = document.getElementById('inputText').value;
    const encryptedData = await encryptText(inputText);
    document.getElementById('encryptedText').value = JSON.stringify(encryptedData);
});

document.getElementById('decryptButton').addEventListener('click', async () => {
    const encryptedText = document.getElementById('encryptedText').value;
    const encryptedData = JSON.parse(encryptedText);
    const decryptedText = await decryptText(encryptedData);
    document.getElementById('decryptedText').value = decryptedText;
});

// Generate encryption key on page load
generateKey();
