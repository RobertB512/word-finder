import { gameWordList } from "./gameWords.js";

let wordList = [];
let gameMode;

function toggleVisibleAndPlay() {
	const startGameBtn = document.querySelector(".start-game-btn");
  const playBtnWrapper = document.querySelector(".play-btn-wrapper")
	const gameControlsWrapper = document.querySelector(".game-controls-wrapper ");
	gameControlsWrapper.classList.remove("d-none");
  playBtnWrapper.classList.add("d-none");
	playGame();
}

const prepOnPageLoad = () => {
	const playBtnWrapper = document.querySelector(".play-btn-wrapper")
  const startGameBtn = document.querySelector(".start-game-btn");
	const gameControlsWrapper  = document.querySelector(".game-controls-wrapper");
  const normalLevel = document.querySelector(".normal-level")

	gameControlsWrapper.classList.add("d-none");
  playBtnWrapper.classList.remove("d-none");
  normalLevel.classList.add("active");

	startGameBtn.removeEventListener("click", toggleVisibleAndPlay);

	startGameBtn.addEventListener("click", toggleVisibleAndPlay);
};

const playGame = () => {
	generateRandomWord();
	focusOnInput();
	handleTimer();
	getWordFromUser();
	handleLevelSelection();
	getNewWord();
};

const generateRandomWord = () => {
	const gameWord = document.querySelector(".game-word");
	const randomWordIndex = Math.floor(Math.random() * gameWordList.length);
	console.log(randomWordIndex);
	gameWord.textContent = gameWordList[randomWordIndex].toUpperCase();
  gameWord.classList.remove("calc-font-size")
};
// const preventFormReload = () {

// }

function preventFormReload(e) {
	const wordEntryInput = document.querySelector(".word-entry-input");
	const gameWord = document.querySelector(".game-word").textContent;

	e.preventDefault();
	wordEntryInput.value.toUpperCase() === gameWord
		? displayErrorMsg(`${gameWord} doesn't count...`)
		: checkIfRealWord(wordEntryInput.value);

	wordEntryInput.value = "";
}

const getWordFromUser = async () => {
	const wordEntryForm = document.querySelector(".word-entry-form");

	wordEntryForm.removeEventListener("submit", preventFormReload);

	wordEntryForm.addEventListener("submit", preventFormReload);
};

const checkIfRealWord = async userWord => {
	if (userWord) {
		const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${userWord}`;
		try {
			const response = await fetch(url);
			if (response.ok) {
				const data = await response.json();
				const theWord = await data[0].word;
				// console.log("here is the word:", theWord);
				// strictCheckWordInGameWord(theWord.toUpperCase());
				gameMode(theWord.toUpperCase());
			} else {
				console.log("ERROR: might not be a real word");
				displayErrorMsg(`${userWord.toUpperCase()} may not be a word`);
			}
		} catch (error) {
			console.log("failed fetch:", error);
		}
	} else {
		console.log("no word to verify");
	}
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

function resetOnEasyLevel() {
	const easyLevel = document.querySelector(".easy-level");
	const normalLevel = document.querySelector(".normal-level");

	resetGame();
	easyLevel.classList.add("active");
	normalLevel.classList.remove("active");
	// gameMode = checkWordInGameWord;
	gameMode = checkWordInGameWord;
	focusOnInput();
	console.log("easy mode on");

  return gameMode
}

function resetOnNormalLevel() {
  const easyLevel = document.querySelector(".easy-level");
  const normalLevel = document.querySelector(".normal-level");

  resetGame();
  normalLevel.classList.add("active");
  easyLevel.classList.remove("active");
  // gameMode = strictCheckWordInGameWord;
  gameMode = strictCheckWordInGameWord;
  focusOnInput();
  console.log("normal mode on");

  return gameMode
}

const handleLevelSelection = userWord => {
	const easyLevel = document.querySelector(".easy-level");
	const normalLevel = document.querySelector(".normal-level");

	gameMode = strictCheckWordInGameWord;
	// let selectedLevel = strictCheckWordInGameWord

	easyLevel.removeEventListener("click", resetOnEasyLevel);
	normalLevel.removeEventListener("click", resetOnNormalLevel);

	easyLevel.addEventListener("click", resetOnEasyLevel);
	normalLevel.addEventListener("click", resetOnNormalLevel);
};

const handleWordStatus = async (wordStatus, userWord, errorMsg) =>
	wordStatus ? addUserWord(userWord) : displayErrorMsg(errorMsg);

const addUserWord = async userWord => {
	const guessedWordsSection = document.querySelector(".guessed-words-section");
	const totalWordsFound = document.querySelector(".total-words-found");

	if (userWord && wordList.indexOf(userWord) === -1) {
		console.log("valid word");
		wordList.push(userWord);
		// console.log("words", wordList);
		// console.log("guessedWord is", userWord);
		let goodWord = document.createElement("p");
		goodWord.classList.add("good-word");
		goodWord.textContent = userWord;
		guessedWordsSection.append(goodWord);
	} else if (!(wordList.indexOf(userWord) === -1)) {
		// console.log("This word is already in the list");
		displayErrorMsg(`${userWord} is already in the list`);
	}
	totalWordsFound.textContent = wordList.length.toString();
	// wordList.length > 0
	// 	? (totalWordsFound.textContent = wordList.length.toString())
	// 	: (totalWordsFound.textContent = "0");
};

const getNewWord = () => {
	const getNewWordBtn = document.querySelector(".get-new-word-btn");

	getNewWordBtn.removeEventListener("click", resetAndFocus);

	function resetAndFocus() {
		resetGame();
		focusOnInput();
	}

	getNewWordBtn.addEventListener("click", resetAndFocus);

	// console.log("getNewWord function read");
};

const handleTimer = () => {
	const gameTimer = document.querySelector(".game-timer");

	gameTimer.classList.remove("time-almost-out");

	let timeOnTimer = 300; // seconds
	const countDownInterval = setInterval(() => {
		updateTimer();
	}, 1000);

	const updateTimer = () => {
		let minutes = Math.floor(timeOnTimer / 60);
		let seconds = timeOnTimer % 60;

		let formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
		let formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

		gameTimer.textContent = `${formattedMinutes}:${formattedSeconds}`;

		timeOnTimer <= 10 && gameTimer.classList.add("time-almost-out");

		if (timeOnTimer === 0) {
			clearInterval(countDownInterval);
			handleGameOver();
		}

		timeOnTimer--;
	};
};

const focusOnInput = () => {
	const wordEntryInput = document.querySelector(".word-entry-input");
	wordEntryInput.focus();
};

const displayErrorMsg = async errorMsg => {
	const errorLbl = document.querySelector(".error-msg-lbl");

	errorMsg && (errorLbl.textContent = errorMsg); // : (errorMsg.textContent = "");

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

const handleGameOver = () => {
	const startGameBtn = document.querySelector(".start-game-btn");
	const wordEntryForm = document.querySelector(".word-entry-form");
  const easyLevel = document.querySelector(".easy-level");
	const normalLevel = document.querySelector(".normal-level");

  easyLevel.classList.remove("active")
  normalLevel.classList.remove("active")
  normalLevel.classList.add("active")
  easyLevel.removeEventListener("click", resetOnEasyLevel);
	normalLevel.removeEventListener("click", resetOnNormalLevel);
	wordEntryForm.removeEventListener("submit", preventFormReload);
	startGameBtn.removeEventListener("click", toggleVisibleAndPlay);

	resetGame();
	prepOnPageLoad();
};

prepOnPageLoad();
