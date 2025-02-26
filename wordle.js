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
    const currentGuessArr = []




    

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



    function handleGuess() {
        const input = document.getElementById("guess-input");
        const guess = input.value.toLowerCase();

        if (guess.length !== 5 || guesses.length >= maxGuesses || !allowedGuessWords.includes(guess)) {
            alert("Invalid guess! " );
            return;
        }
        
        guesses.push(guess);
        const row = document.querySelectorAll(".row")[guesses.length - 1];
        
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
        input.value = "";
        if (guess === answerWord) {
            alert("Congratulations! You guessed the word!");
        } else if (guesses.length === maxGuesses) {
            alert("Game over! The word was " + answerWord);
        }
    }
    
    document.getElementById("submit-guess").addEventListener("click", handleGuess);
    createGrid();



    //Add listener for keypress, 
    function keyPress(event) {
        c = event.key.textContent;
        console.log(event.code);
        console.log(typeof event.code);

        console.log(typeof c);

        if (c.toLowerCase() != c.toUpperCase()) {
            
        }


        

    }
    document.addEventListener("keydown", keyPress);


});
