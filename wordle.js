document.addEventListener("DOMContentLoaded", function() {
    const answerWord = WordleData.answerWord; 
    const allowedGuessWords = WordleData.allowedGuessWords; //TODO: Implement checks.
    const MAX_GUESSES = 6;
    const WORD_LENGTH = 5;
    const currentGuessArr = [];
    let currRowNum = 0;

    function createGrid() {
        const grid = document.querySelector(".grid");
        for (let i = 0; i < MAX_GUESSES; i++) {
            const row = document.createElement("div");
            row.classList.add("row");
            for (let j = 0; j < WORD_LENGTH; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                row.appendChild(cell);
            }
            grid.appendChild(row);
        }
    }

    function bindCellsInCurrentRow() {
        let row = document.querySelectorAll(".row")[currRowNum];
        for (let i = 0; i < WORD_LENGTH; i++) {
            let cell = row.children[i];
            cell.textContent = currentGuessArr[i];
        }
    }
    function unBindCells() {
        //document.removeEventListener("keydown", bindCellsInCurrentRow);
    }
    function bindCells() {
        document.addEventListener("keydown", bindCellsInCurrentRow);
    }


    function handleGuess() {
        const guess = currentGuessArr.join("");
        if (guess.length !== WORD_LENGTH) {
            alert("wrong length" );
            return;
        }
        if (!allowedGuessWords.includes(guess)) {
            alert("not in word list")
            return;
        }
        const row = document.querySelectorAll(".row")[currRowNum];
        
        //create a map that starts with storing how many of each letter is in the answer word. 
        //Then every time we highlight a letter we decrement that, and we don’t highlight a letter if that letter in the map is at zero
        const answerLetterCounts = new Map();
        for (let i = 0; i < 26; i++) {
            var chr = String.fromCharCode(97 + i);
            answerLetterCounts.set(chr, 0);
        }
        for (let i = 0; i < WORD_LENGTH; i++) {
            answerLetterCounts.set(answerWord[i], answerLetterCounts.get(answerWord[i]) + 1) //Increment
        }
        //Highlight correct letters in guess
        //First pass highlight green
        for (let i = 0; i < WORD_LENGTH; i++) {
            const cell = row.children[i];
            //cell.textContent = guess[i];

            if (guess[i] === answerWord[i]) {
                cell.style.backgroundColor = "green";
                answerLetterCounts.set(guess[i], answerLetterCounts.get(guess[i]) - 1) //Decrement
            } 
            else {
                cell.style.backgroundColor = "grey";
            }
        }
        //highlight yellow
        for (let i = 0; i < WORD_LENGTH; i++) {
            const cell = row.children[i];
            //cell.textContent = guess[i];
            if (answerLetterCounts.get(guess[i]) > 0 && guess[i] != answerWord[i]) {
                cell.style.backgroundColor = "yellow";
                answerLetterCounts.set(guess[i], answerLetterCounts.get(guess[i]) - 1) //Decrement
            } 
        }
        //Highlight keyboard
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (guess[i] === answerWord[i]) {
                console.log(guess[i]);
                console.log(document.getElementById(guess[i]));
                document.getElementById(guess[i]).style.backgroundColor = "green";
            }
            else if (answerWord.includes(guess[i])) {
                document.getElementById(guess[i]).style.backgroundColor = "yellow"
            }
            else {
                document.getElementById(guess[i]).style.backgroundColor = "grey"
            }

        }
        
        currentGuessArr.splice(0, currentGuessArr.length);
        unBindCells();
        if (guess === answerWord) {
            alert("Congratulations! You guessed the word!");

        } else if (currRowNum + 1 === MAX_GUESSES) {
            alert("Game over! The word was " + answerWord);
        }
        else { //move entry to next row
            currRowNum += 1
            bindCells();
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
    bindCells(); //Guess is entered on the first row to start

});
