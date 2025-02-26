document.addEventListener("DOMContentLoaded", function() {
    const answerWord = WordleData.answerWord; 
    let allowedGuessWords = WordleData.allowedGuessWords; //TODO: Implement checks.
    let guesses = [];
    const maxGuesses = 6;

    const grid = document.querySelector(".grid");


    const keys = document.querySelectorAll(".key");
    const enterKey = document.getElementById("enter-key");
    const backspaceKey = document.getElementById("backspace-key");
    //const guessedLetters = new Map(); 
    const currentGuessArr = [];
    const WORD_LENGTH = 5;



    function createGrid() {
        for (let i = 0; i < maxGuesses; i++) {
            const row = document.createElement("div");
            row.classList.add("row");
            for (let j = 0; j < 5; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                row.appendChild(cell);
            }
            grid.appendChild(row);
        }
    }

    function bindCell(rowNum, cellNum) {
        const row = document.querySelectorAll(".row")[rowNum];
        const cell = row.children[cellNum];
        cell.textContent = currentGuessArr[cellNum];
    }

    function unBindCells(rowNum) {
        const row = document.querySelectorAll(".row")[rowNum];
        for (let i = 0; i < WORD_LENGTH; i++) {
            const cell = row.children[i];

            document.removeEventListener("keydown", bindCell(rowNum, i));
        }
    }

    function bindCells(rowNum) {
        const row = document.querySelectorAll(".row")[rowNum];
        for (let i = 0; i < WORD_LENGTH; i++) {
            const cell = row.children[i];

            document.addEventListener("keydown", bindCell(rowNum, i));
        }
    }


    function handleGuess() {
        const guess = currentGuessArr.join("");
        

        if (guess.length !== 5) {
            alert("wrong length" );
            return;
        }
        if (guesses.length >= maxGuesses) {
            alert("no more guesses")
            return;
        }
        if (!allowedGuessWords.includes(guess)) {
            alert("not in word list")
            return;
        }

        guesses.push(guess);
        const rowNum = guesses.length - 1;
        
        guesses.push(guess);
        const row = document.querySelectorAll(".row")[rowNum];
        
        //create a map that starts with storing how many of each letter is in the answer word. 
        //Then every time we highlight a letter we decrement that, and we don’t highlight a letter if that letter in the map is at zero
        const answerLetterCounts = new Map();
        for (let i = 0; i < 26; i++) {
            var chr = String.fromCharCode(97 + i);
            answerLetterCounts.set(chr, 0);
        }
        for (let i = 0; i < 5; i++) {
            answerLetterCounts.set(answerWord[i], answerLetterCounts.get(answerWord[i]) + 1) //Increment
        }
        //Highlight correct letters in guess
        //First pass highlight green
        for (let i = 0; i < 5; i++) {
            const cell = row.children[i];
            cell.textContent = guess[i];

            if (guess[i] === answerWord[i]) {
                cell.style.backgroundColor = "green";
                answerLetterCounts.set(guess[i], answerLetterCounts.get(guess[i]) - 1) //Decrement
            } 
            else {
                cell.style.backgroundColor = "grey";
            }
        }
        //highlight yellow
        for (let i = 0; i < 5; i++) {
            const cell = row.children[i];
            cell.textContent = guess[i];
            if (answerLetterCounts.get(guess[i]) > 0) {
                cell.style.backgroundColor = "yellow";
                answerLetterCounts.set(guess[i], answerLetterCounts.get(guess[i]) - 1) //Decrement
            } 
        }
        //Highlight keyboard
        for (let i = 0; i < 5; i++) {
            if (guess[i] === answerWord[i]) {
                console.log(guess[i]);
                console.log(document.getElementById(guess[i]));
                document.getElementById(guess[i]).style.backgroundColor = "green";
            }
            else if (answerWord.includes(guess[i])) {
                document.getElementById(guess[i]).style.backgroundColor = "yellow"
            }

        }
        
        currentGuessArr.splice(0, currentGuessArr.length);
        if (guess === answerWord) {
            alert("Congratulations! You guessed the word!");
        } else if (guesses.length === maxGuesses) {
            alert("Game over! The word was " + answerWord);
        }
        else { //move entry to next row
            unBindCells(rowNum);
            bindCells(rowNum + 1);
        }
    }
    
    document.getElementById("submit-guess").addEventListener("click", handleGuess);
    createGrid();



    //Add listener for keypress
    document.addEventListener("keydown", function(event) {
        switch (event.key) {
            case "Enter":
                console.log("Enter key was pressed!");
                handleGuess();
                break;
            case "Backspace":
                console.log("Backspace key was pressed!");
                currentGuessArr.pop();
                break;
            default:
                if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)
                    && currentGuessArr.length < WORD_LENGTH) {
                    currentGuessArr.push(event.key);

                    console.log(`Letter key '${event.key}' was pressed!`);
                }
                break;
        }
        console.log(currentGuessArr);

    });
    bindCells(0); //Guess is entered on the first row to start




});
