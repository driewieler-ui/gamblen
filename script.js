// --- SPREEK MET DE DATABASE (LocalStorage) ---

// Zorg dat het saldo in het begin altijd op 0 start als er nog niks is opgeslagen
let munten = parseInt(localStorage.getItem('munten'));
if (isNaN(munten)) {
    munten = 0;
}

// Haal actieve codes op of start met een lege database
let codes = JSON.parse(localStorage.getItem('actieveCodes')) || {};

// Zet direct het juiste saldo op het scherm zodra de pagina laadt
document.getElementById('munt-saldo').innerText = munten;
updateAdminCodeList();


// --- ADMIN PANEEL FUNCTIES ---

// Laat het admin paneel in- of uitklappen
function toggleAdmin() {
    const adminSec = document.getElementById('adminSec');
    if (adminSec.style.display === 'block') {
        adminSec.style.display = 'none';
    } else {
        adminSec.style.display = 'block';
    }
}

// Maak een nieuwe code aan als admin
function createCode() {
    const codeInput = document.getElementById('newCode').value.trim().toUpperCase();
    const valueInput = parseInt(document.getElementById('codeValue').value);

    // Controleer of de admin wel alles goed heeft ingevuld
    if (!codeInput || isNaN(valueInput) || valueInput <= 0) {
        alert("Vul een geldige code en een aantal munten in!");
        return;
    }

    // Voeg de code toe aan het object en sla het op
    codes[codeInput] = valueInput;
    localStorage.setItem('actieveCodes', JSON.stringify(codes));
    
    // Maak de invoervelden weer netjes leeg
    document.getElementById('newCode').value = '';
    document.getElementById('codeValue').value = '';
    
    // Vernieuw de lijst op het scherm
    updateAdminCodeList();
}

// Toon de lijst met alle gemaakte codes in het admin paneel
function updateAdminCodeList() {
    const listDiv = document.getElementById('activeCodesList');
    listDiv.innerHTML = '';
    
    // Loop door alle codes heen
    for (const [code, waarde] of Object.entries(codes)) {
        listDiv.innerHTML += `
            <div class="code-item">
                <span>🔑 <strong>${code}</strong></span>
                <span style="color: var(--accent-color);">${waarde} goud</span>
            </div>
        `;
    }
}


// --- GEBRUIKERS FUNCTIES ---

// Code inwisselen om munten te krijgen
function redeemCode() {
    const input = document.getElementById('claimCodeInput').value.trim().toUpperCase();
    const feedback = document.getElementById('claimFeedback');

    // Controleer of de ingevulde code bestaat
    if (codes.hasOwnProperty(input)) {
        const beloning = codes[input];
        munten += beloning;
        
        // Sla het nieuwe saldo op
        localStorage.setItem('munten', munten);
        document.getElementById('munt-saldo').innerText = munten;

        // Verwijder de code zodat hij direct onbruikbaar wordt voor de volgende keer
        delete codes[input];
        localStorage.setItem('actieveCodes', JSON.stringify(codes));

        // Geef groene succesfeedback
        feedback.style.color = "#22c55e";
        feedback.innerText = `Succes! Je hebt ${beloning} goud ontvangen.`;
        document.getElementById('claimCodeInput').value = '';
        
        // Update het admin overzicht
        updateAdminCodeList();
    } else {
        // Geef rode foutfeedback
        feedback.style.color = "#ef4444";
        feedback.innerText = "Helaas, deze code is onjuist of al gebruikt.";
    }
}

// Spelen op de gokkast (kost 10 munten per keer)
function playSlots() {
    const slotDisplay = document.getElementById('slotDisplay');
    const slotFeedback = document.getElementById('slotFeedback');

    // Check of de speler wel genoeg goud heeft
    if (munten < 10) {
        slotFeedback.style.color = "#ef4444";
        slotFeedback.innerText = "Je hebt minimaal 10 goud nodig!";
        return;
    }

    // Schrijf 10 goud af van het saldo
    munten -= 10;
    localStorage.setItem('munten', munten);
    document.getElementById('munt-saldo').innerText = munten;

    // Gokkast rollen bepalen
    const opties = ['💎', '🏴‍☠️', '🌋', '🌴', '🦀'];
    const slot1 = opties[Math.floor(Math.random() * opties.length)];
    const slot2 = opties[Math.floor(Math.random() * opties.length)];
    const slot3 = opties[Math.floor(Math.random() * opties.length)];

    // Toon de emoticons op het scherm
    slotDisplay.innerText = `${slot1}${slot2}${slot3}`;

    // Check of er 3 dezelfde symbolen zijn (Winst!)
    if (slot1 === slot2 && slot2 === slot3) {
        munten += 100;
        localStorage.setItem('munten', munten);
        document.getElementById('munt-saldo').innerText = munten;
        slotFeedback.style.color = "#22c55e";
        slotFeedback.innerText = "JACKPOT! +100 goud gewonnen!";
    } else {
        slotFeedback.style.color = var(--text-muted);
        slotFeedback.innerText = "Helaas, geen prijs. Probeer het nog eens!";
    }
}
