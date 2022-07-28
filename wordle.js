/*use javascript to populate files that will allow player to guess*/



document.addEventListener("DOMContentLoaded", () => {   
    formTiles();
    newWord();
    //nested array, array of words, each word will be array of letters
    let guesses = [[]];
    let freeSpace = 1;

    let word;
    let guessWordCount = 0;
    const keys = document.querySelectorAll('.keyboard-row button');

    function newWord() {
        fetch(`https://wordsapiv1.p.rapidapi.com/words/?random=true&letters=5`,
        {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': '1bc0f5708cmshdb856ed7d79f738p1cb4dcjsn2ea287082648',
              'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
            },   
        }
     )
        .then((response) => {
            return response.json(); //converting to json
        })

        .then((res) => {
            word = res.word; //storing in word variable
        })

        .catch((err) => {
            console.error(err);
        });
    }
   
    //functions below, utilization above
    function getCurrentWordArr(){
        const numGuesses = guesses.length;
        return guesses[numGuesses-1];
    }

    function updateGuessWord(letter) {
        //if the current word has not been updated completely(the 5 letters 
        // have not been filled out for the current guess, continue adding
        // letters)

        const currWordArr = getCurrentWordArr();

        //if the current word exists and it hasnt been filled all the way to 5 spaces
        if (currWordArr && currWordArr.length < 5){
            currWordArr.push(letter);
            
            const freeSpaceElement = document.getElementById(String(freeSpace));
            freeSpace++;
            freeSpaceElement.textContent = letter;
        }
    }

    function changeColor(letter, i){
        const isPresent = word.includes(letter);

        if (!isPresent){
            return "rgb(58, 58, 60)"; //if not present return gray color
        }

        const letterAtPos = word.charAt(i);
        const correctPos = letter === letterAtPos; //correctPos will contain True/False depending on if the 
                                                   // letter is at the right position

        if (correctPos){ //if its present at the right position, it will be green
            return "rgb(83, 141, 78)";
        }

        return "rgb(181, 159,59)"; //if not right position but present, tile will be yellow
    }

    function submitWord(){
        const currWordArr = getCurrentWordArr();
        if (currWordArr.length !== 5){
            window.alert("Word must be 5 letters.");
        }

        const currWord = currWordArr.join("");

        //make fetch request
        fetch(
            `https://wordsapiv1.p.rapidapi.com/words/${currWord}`,
            {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '1bc0f5708cmshdb856ed7d79f738p1cb4dcjsn2ea287082648',
                    'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
                },
            })
            
            .then((res) => {
                if (!res.ok){
                    throw Error();
                } 

        const firstLetterID = guessWordCount * 5 + 1; //5 letters in each word, add 1 to get first letter
        const interval = 200;
    
        currWordArr.forEach((letter, i) => {
            setTimeout(() => {
                const tileColor = changeColor(letter, i);

                const letterID = firstLetterID + i;
                const letterElement = document.getElementById(letterID);
                letterElement.classList.add("animate__flipInX");
                //style the the animation within js and the declaration for it rather than the css file
                letterElement.style = `background-color:${tileColor}; border-color:${tileColor}`;
            }, interval * i);
        });

        guessWordCount++;

        if (currWord === word){
            window.alert("Congratulations!");
        }

        if (guesses.length ===6){
            window.alert('Sorry, you have no more guesses! The word is ' + word + '.');
        }

        guesses.push([]);
     })
    .catch(() => {
        window.alert('Word is not recognized!');
        });
    }

    function deleteLetter(){
        const currWord = getCurrentWordArr();
        if (currWord.length === 0){
            return;
        }

        const remLetter = currWord.pop();

        guesses[guesses.length-1] = currWord;
        const lastLetterElement = document.getElementById(String(freeSpace - 1));

        lastLetterElement.textContent ='';
        freeSpace--;
    }
    //create function that makes the tiles
    function formTiles() {
        const board = document.getElementById("board");

        for (let i = 0; i < 30; i++)
        {
            let tile = document.createElement("div"); 
            //can put tiles next to each other    
            //in each iteration, the title id will be the corresponding row and column //ie: 1-2
            tile.classList.add("tile"); //adds css class of that id with all the styling (adds styling)
            tile.setAttribute("id", i+1);    
            tile.classList.add("animate__animated");      //can add multiple classess for styling 
            //add the tiles to the board
            //use js because it can utilize for loops. if done in html, the span tile would 
            // have to be added to the board multiple times
            board.appendChild(tile);
        }
    }

    //keyboard input
    for (let num = 0; num < keys.length; num++)
    {

        keys[num].onclick = ({target}) => {
            numGuesses = guesses.length;

            //allows for players to enter guesses
            const letter = target.getAttribute("data-key");

            if (letter === 'enter'){
                submitWord();
                return;
            }

            if (letter === 'del'){
                deleteLetter();
                return;
            }
            if (numGuesses === 7){
                window.alert("Sorry, you have no more guesses! The word is " + word + ".");
            }
            
            updateGuessWord(letter);
        };
    }
});

var gameOver = false;
var word = "BOUND"

//when page loads, call the function. the function will carry out/"initialize"

