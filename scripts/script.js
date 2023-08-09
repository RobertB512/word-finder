import { gameWordList } from "./gameWords.js";

let wordList = [];
let gameMode;

const focusOnInput = () => {
  const wordEntryInput = document.querySelector(".word-entry-input")

  wordEntryInput.focus()
}

const generateRandomWord = () => {
	const gameWord = document.querySelector(".game-word");
	const randomWord = Math.floor(Math.random() * gameWordList.length);
	console.log(randomWord);
	gameWord.textContent = gameWordList[randomWord].toUpperCase();
};

const displayErrorMsg = async errorMsg => {
	const errorLbl = document.querySelector(".error-msg-lbl");
	errorMsg ? (errorLbl.textContent = errorMsg) : (errorMsg.textContent = "");

	setTimeout(() => {
		errorLbl.textContent = "";
	}, 5000);
};

const resetGame = () => {
	document.querySelector(".guessed-words-section").textContent = "";
	document.querySelector(".total-words-found").textContent = "";

	wordList = [];
	generateRandomWord();
	console.log("reset game");
};

const getNewWord = () => {
	const getNewWordBtn = document.querySelector(".get-new-word-btn");

	getNewWordBtn.addEventListener("click", () => {
		resetGame();
    focusOnInput()
	});
};

const addUserWord = async guessedWord => {
	const guessedWordsSection = document.querySelector(".guessed-words-section");
	const totalWordsFound = document.querySelector(".total-words-found");

	if (guessedWord && wordList.indexOf(guessedWord) === -1) {
		console.log("valid word");
		const userWord = guessedWord;
		wordList.push(guessedWord);
		console.log("words", wordList);
		console.log("guessedWord is", userWord);
		let goodWord = document.createElement("p");
		goodWord.classList.add("mb-1", "good-word");
		goodWord.textContent = userWord;
		guessedWordsSection.append(goodWord);
	} else if (!(wordList.indexOf(guessedWord) === -1)) {
		// console.log("This word is already in the list");
		displayErrorMsg(`${guessedWord} is already in the list`);
	}
	console.log("test wordList length", wordList.length);
	totalWordsFound.textContent = wordList.length.toString();
	// wordList.length > 0
	// 	? (totalWordsFound.textContent = wordList.length.toString())
	// 	: (totalWordsFound.textContent = "0");
};

const handleWordStatus = async (wordStatus, userWord, errorMsg) =>
	wordStatus ? addUserWord(userWord) : displayErrorMsg(errorMsg);

const strictCheckWordInGameWord = async userWord => {
	const gameWord = document.querySelector(".game-word").textContent;
	let wordStatus = false;
	const gameWordCopy = gameWord.split("");

	for (let letter of userWord) {
		if (!(gameWordCopy.indexOf(letter) === -1)) {
			console.log("entered if");
			const letterPosition = gameWordCopy.indexOf(letter);
			gameWordCopy.splice(letterPosition, 1);
			wordStatus = true;
		} else {
			console.log("entered else");
			wordStatus = false;
			break;
		}
	}

	const errorMsg = `One or more letters in ${userWord} aren't in ${gameWord}, or you used some letters too much`;
	handleWordStatus(wordStatus, userWord, errorMsg);
};

const handleLevelSelection = () => {
	const easyLevel = document.querySelector(".easy-level");
	const normalLevel = document.querySelector(".normal-level");
	gameMode = strictCheckWordInGameWord;

	easyLevel.addEventListener("click", () => {
		resetGame();
		easyLevel.classList.add("active");
		normalLevel.classList.remove("active");
		gameMode = checkWordInGameWord;
    focusOnInput()
		console.log("easy mode on");
	});

	normalLevel.addEventListener("click", () => {
		resetGame();
		normalLevel.classList.add("active");
		easyLevel.classList.remove("active");
		gameMode = strictCheckWordInGameWord;
    focusOnInput()
		console.log("normal mode on");
	});

	return gameMode;
};

const checkWordInGameWord = async userWord => {
	const gameWord = document.querySelector(".game-word").textContent;
	let wordStatus = false;
	console.log(`is ${userWord} in ${gameWord}`);

	for (let letter of userWord) {
		if (!(gameWord.indexOf(letter) === -1)) {
			console.log("entered if");
			wordStatus = true;
		} else {
			console.log("entered else");
			wordStatus = false;
			break;
		}
	}

	const errorMsg = `One or more letters in ${userWord} aren't in ${gameWord}`;

	handleWordStatus(wordStatus, userWord, errorMsg);
};

const checkWord = async wordToVerify => {
	const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordToVerify}`;
	try {
		const response = await fetch(url);
		if (response.ok) {
			const data = await response.json();
			const theWord = await data[0].word;
			console.log("here is the word:", theWord);
			// strictCheckWordInGameWord(theWord.toUpperCase());
			gameMode(theWord.toUpperCase());
		} else {
			console.log("ERROR: might not be a valid word");
			displayErrorMsg(`${wordToVerify.toUpperCase()} may not be a word`);
		}
	} catch (error) {
		console.log("failed fetch:", error);
	}
};

const getWordFromUser = async () => {
	const gameWord = document.querySelector(".game-word").textContent;
	const wordEntryForm = document.querySelector(".word-entry-form");
	const wordEntryInput = document.querySelector(".word-entry-input");

	wordEntryForm.addEventListener("submit", e => {
		e.preventDefault();
		wordEntryInput.value.toUpperCase() === gameWord
			? displayErrorMsg(`${gameWord} doesn't count...`)
			: checkWord(wordEntryInput.value);

		wordEntryInput.value = "";
	});
};

const playGame = () => {
  focusOnInput()
  generateRandomWord();
  getWordFromUser();
  handleLevelSelection();
	getNewWord();
};

const prepOnPageLoad = () => {
	const startGameBtn = document.querySelector(".start-game-btn");
	const gameArea = document.querySelector(".game-area");

	gameArea.classList.add("d-none");

  startGameBtn.addEventListener("click", () => {
    gameArea.classList.remove("d-none")
    startGameBtn.classList.add("d-none")
    playGame()
  })
};



prepOnPageLoad()

// getNewWord()
// handleLevelSelection();
// generateRandomWord();
// getWordFromUser();
