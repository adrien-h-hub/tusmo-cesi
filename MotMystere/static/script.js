import { WORDS } from "./words_filtered.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)].toLowerCase()
let wordLength = rightGuessString.length;

console.log("Mot à deviner:", rightGuessString, "Longueur:", wordLength)

function showWordPopup(word) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create popup
    const popup = document.createElement('div');
    popup.style.cssText = `
        background: white;
        padding: 40px 60px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    
    popup.innerHTML = `
        <h2 style="color: #e74c3c; font-size: 2rem; margin-bottom: 20px;">😔 Perdu!</h2>
        <p style="color: #666; font-size: 1.2rem; margin-bottom: 15px;">Le mot était:</p>
        <p style="color: #333; font-size: 2.5rem; font-weight: 800; letter-spacing: 3px; margin-bottom: 30px;">${word}</p>
        <button id="closePopup" style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        ">Nouvelle Partie</button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Close popup and reload
    document.getElementById('closePopup').addEventListener('click', () => {
        location.reload();
    });
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            location.reload();
        }
    });
}

function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"
        
        for (let j = 0; j < wordLength; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            } 

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}

function checkGuess () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != wordLength) {
        toastr.error("Pas assez de lettres!")
        return
    }

    // Convert to uppercase for comparison
    let guessUpper = guessString.toUpperCase()
    if (!WORDS.includes(guessUpper)) {
        toastr.error("Mot non valide!")
        return
    }

    
    // First pass: mark all correct positions (green)
    const letterColors = new Array(wordLength).fill('')
    const targetLetters = Array.from(rightGuessString)
    const usedPositions = new Array(wordLength).fill(false)
    
    // Pass 1: Find all exact matches (green)
    for (let i = 0; i < wordLength; i++) {
        if (currentGuess[i] === targetLetters[i]) {
            letterColors[i] = 'green'
            usedPositions[i] = true
        }
    }
    
    // Pass 2: Find misplaced letters (yellow) - only if letter exists elsewhere
    for (let i = 0; i < wordLength; i++) {
        if (letterColors[i] === '') { // Not already green
            const letter = currentGuess[i]
            let foundYellow = false
            
            // Check if this letter exists in target at a different position
            for (let j = 0; j < wordLength; j++) {
                if (!usedPositions[j] && targetLetters[j] === letter) {
                    letterColors[i] = 'yellow'
                    usedPositions[j] = true
                    foundYellow = true
                    break
                }
            }
            
            // If not found, mark as grey
            if (!foundYellow) {
                letterColors[i] = 'grey'
            }
        }
    }
    
    // Apply colors with animation
    for (let i = 0; i < wordLength; i++) {
        const box = row.children[i]
        const letter = currentGuess[i]
        const letterColor = letterColors[i]
        
        let delay = 250 * i
        setTimeout(()=> {
            //flip box
            animateCSS(box, 'flipInX')
            //shade box
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    if (guessString === rightGuessString) {
        toastr.success("Bravo! Vous avez trouvé!")
        guessesRemaining = 0
        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            setTimeout(() => {
                showWordPopup(rightGuessString.toUpperCase())
            }, 1500)
        }
    }
}

function insertLetter (pressedKey) {
    if (nextLetter === wordLength) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter]
    animateCSS(box, "pulse")
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');
    
    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target
    
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

initBoard()
