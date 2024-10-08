import { gameWordList } from "./gameWords.js";

let wordList = [];
let gameMode;

function toggleVisibleAndPlay() {
	// const startGameBtn = document.querySelector(".start-game-btn");
	const startGameWrapper = document.querySelector(".start-game-wrapper");
	const gameControlsWrapper = document.querySelector(".game-controls-wrapper");
  const gameMessage = document.querySelector(".game-message")
  const inputArea = document.querySelector(".input-area");
	const timerWrapper = document.querySelector(".timer-wrapper");
	const getNewWordBtn = document.querySelector(".get-new-word-btn");
	const levelSelector = document.querySelector(".level-select");
	let selectedLevel = "";

	if (levelSelector.value === "easy") {
		selectedLevel = "easy";
		console.log("entered easy level");
	} else if (levelSelector.value === "normal") {
		selectedLevel = "normal";
		console.log("entered normal level");
	} else {
		console.log("problem selecting level");
	}


	// startGameWrapper.contains(gameControlsWrapper)
	// 	? startGameWrapper.removeChild(gameControlsWrapper)
	// 	: null;
	// startGameWrapper.removeChild(gameControlsWrapper);
	gameControlsWrapper.classList.remove("d-none");
	startGameWrapper.classList.add("d-none");
  gameMessage.classList.add("d-none")
  inputArea.classList.remove("d-none");
	timerWrapper.classList.remove("d-none");
	getNewWordBtn.classList.remove("d-none");
	resetGame();
	playGame(selectedLevel);
}

// const getUserLevel = () => {
//   const levelSelector = document.querySelector(".level-select")
//   let selectedLevel = ""

//   if (levelSelector.value === "easy") {
//     selectedLevel = "easy"
//   } else if (levelSelector.value === "normal") {
//     selectedLevel = "normal"
//   }
// }

const prepOnPageLoad = () => {
	const startGameWrapper = document.querySelector(".start-game-wrapper");
	const startGameBtn = document.querySelector(".start-game-btn");
	const gameControlsWrapper = document.querySelector(".game-controls-wrapper");
	const normalLevel = document.querySelector(".normal-level");

	gameControlsWrapper.classList.add("d-none");
	startGameWrapper.classList.remove("d-none");
	// normalLevel.classList.add("active");

	startGameBtn.removeEventListener("click", toggleVisibleAndPlay);
	startGameBtn.addEventListener("click", toggleVisibleAndPlay);
};

const playGame = (selectedLevel) => {
	generateRandomWord();
	focusOnInput();
	listenForInput();
	handleTimer();
	getWordFromUser();
	handleLevelSelection("", selectedLevel);
	getNewWord();
};

const generateRandomWord = () => {
	const gameWord = document.querySelector(".game-word");
	gameWord.textContent = "";
	const randomWordIndex = Math.floor(Math.random() * gameWordList.length);
	console.log(randomWordIndex);
	const rootWord = gameWordList[randomWordIndex].toUpperCase();

	// gameWord.textContent = gameWordList[randomWordIndex].toUpperCase();
	// const rootWord = gameWord.textContent;

	createLetterWrappers(rootWord);
};

function preventFormReload(e) {
	const wordEntryInput = document.querySelector(".word-entry-input");
	const gameWord = document.querySelector(".game-word").textContent;

	e.preventDefault();
	wordEntryInput.value.toUpperCase() === gameWord
		? displayErrorMsg(`${gameWord} doesn't count...`)
		: checkIfRealWord(wordEntryInput.value);

	wordEntryInput.value = "";
  wordEntryInput.focus()
}

const listenForInput = async () => {
	const wordEntryInput = document.querySelector(".word-entry-input");

	wordEntryInput.removeEventListener("input", allowOnlyAlphabetChars);
	wordEntryInput.addEventListener("input", allowOnlyAlphabetChars);
};

const allowOnlyAlphabetChars = async () => {
	const wordEntryInput = document.querySelector(".word-entry-input");

	console.log("Are only letters taking?");
	wordEntryInput.value = wordEntryInput.value.replace(/[^a-zA-Z]/g, "");
};

const createLetterWrappers = async (word) => {
	const gameWord = document.querySelector(".game-word");
	// const wordInput = document.querySelector(".word-entry-input")
	// const gameWordLetterList = gameWord.split()

	for (let letter of word) {
		const letterWrapper = document.createElement("span");
		letterWrapper.classList.add("letter-wrapper");
		letterWrapper.textContent = letter;
		gameWord.append(letterWrapper);
	}

	receiveInputFromLetterTap();
};

const receiveInputFromLetterTap = async () => {
	const letterWrappers = document.querySelectorAll(".letter-wrapper");

	// letterWrappers.forEach((wrapper) => {
	// 	wrapper.addEventListener("click", () => addLetterFromTap(wrapper));
	// });

	for (let wrapper of letterWrappers) {
		wrapper.addEventListener("click", (e) => addLetterFromTap(e, wrapper));
	}
};

const addLetterFromTap = async (e, wrapper) => {
  const wordInput = document.querySelector(".word-entry-input")
  e.stopPropagation()
	console.log("entered add letter function");
	const inputField = document.querySelector(".word-entry-input");
	inputField.value = inputField.value + wrapper.textContent;
  wordInput.focus()
};

// const handleLetterTapEvent = async (wrapper) => {};

const getWordFromUser = async () => {
	const wordEntryForm = document.querySelector(".word-entry-form");

	wordEntryForm.removeEventListener("submit", preventFormReload);

	wordEntryForm.addEventListener("submit", preventFormReload);
};

const checkIfRealWord = async (userWord) => {
	if (userWord.length >= 3) {
		const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${userWord}`;
		try {
			const response = await fetch(url);
			if (response.ok) {
				const data = await response.json();
				const theWord = await data[0].word;
				// strictCheckWordInGameWord(theWord.toUpperCase());
				gameMode(theWord.toUpperCase());
			} else {
				console.log("ERROR: might not be a real word");
				displayErrorMsg(`${userWord.toUpperCase()} may not be a word`);
			}
		} catch (error) {
			console.log("failed fetch:", error);
		}
	} else if (userWord.length < 3) {
		console.log("word < 3 letters");
		displayErrorMsg("Your word must be at least 3 letters long.");
	} else {
		console.log("no word to verify");
	}
};

const checkWordInGameWord = async (userWord) => {
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

const strictCheckWordInGameWord = async (userWord) => {
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

	return gameMode;
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

	return gameMode;
}

const handleLevelSelection = (userWord, selectedLevel) => {
	// const easyLevel = document.querySelector(".easy-level");
	// const normalLevel = document.querySelector(".normal-level");
	// const levelSelector = document.querySelector(".level-select")
	// let gameMode = strictCheckWordInGameWord

	if (selectedLevel === "easy") {
		gameMode = checkWordInGameWord;
	} else if (selectedLevel === "normal") {
		gameMode = strictCheckWordInGameWord;
	}

	// gameMode = strictCheckWordInGameWord;
	// let selectedLevel = strictCheckWordInGameWord

	// easyLevel.removeEventListener("click", resetOnEasyLevel);
	// normalLevel.removeEventListener("click", resetOnNormalLevel);

	// easyLevel.addEventListener("click", resetOnEasyLevel);
	// normalLevel.addEventListener("click", resetOnNormalLevel);
};

const handleWordStatus = async (wordStatus, userWord, errorMsg) =>
	wordStatus ? addUserWord(userWord) : displayErrorMsg(errorMsg);

// const getCurrentTotalPoints = async () => {
//   const currentPoints = document.querySelector(".total-points").textContent
//   return parseInt(currentPoints)
// }

const getWordPoints = async (userWord) => {
	const totalPointsOutput = document.querySelector(".total-points");
  let wordPoints = 0;
  let totalPoints = parseInt(totalPointsOutput.textContent)

	// points are same as scrabble points
	const letterPointSystem = [
		{ letter: "a", points: 1 },
		{ letter: "b", points: 3 },
		{ letter: "c", points: 3 },
		{ letter: "d", points: 2 },
		{ letter: "e", points: 1 },
		{ letter: "f", points: 5 },
		{ letter: "g", points: 2 },
		{ letter: "h", points: 5 },
		{ letter: "i", points: 1 },
		{ letter: "j", points: 8 },
		{ letter: "k", points: 5 },
		{ letter: "l", points: 1 },
		{ letter: "m", points: 3 },
		{ letter: "n", points: 1 },
		{ letter: "o", points: 1 },
		{ letter: "p", points: 3 },
		{ letter: "q", points: 10 },
		{ letter: "r", points: 1 },
		{ letter: "s", points: 1 },
		{ letter: "t", points: 1 },
		{ letter: "u", points: 1 },
		{ letter: "v", points: 5 },
		{ letter: "w", points: 5 },
		{ letter: "x", points: 8 },
		{ letter: "y", points: 5 },
		{ letter: "z", points: 10 },
	];

  for (let userLetter of userWord) {
    console.log("enter point loop 1");
    console.log("letter :", userLetter);
    letterPointSystem.forEach(letter => {
      if (userLetter.toLowerCase() === letter.letter.toLowerCase()) {
        console.log("enter point loop 2");
        wordPoints += letter.points
      }
    })
  }

  totalPoints += wordPoints
  totalPointsOutput.textContent = totalPoints.toString()
};

const addUserWord = async (userWord) => {
	const guessedWordsSection = document.querySelector(".guessed-words-section");
	const totalWordsFound = document.querySelector(".total-words-found");

	if (userWord && wordList.indexOf(userWord) === -1) {
		console.log("valid word");
		wordList.push(userWord);

		// add addPoints function call here
    getWordPoints(userWord)

		let goodWord = document.createElement("p");
		goodWord.classList.add("good-word");
		goodWord.textContent = userWord;
		guessedWordsSection.append(goodWord);
	} else if (!(wordList.indexOf(userWord) === -1)) {
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

		if (timeOnTimer <= 10) {
			gameTimer.classList.add("time-almost-out");
		}

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

const displayErrorMsg = async (errorMsg) => {
	const errorLbl = document.querySelector(".error-msg-lbl");

	errorMsg && (errorLbl.textContent = errorMsg); // : (errorMsg.textContent = "");

	setTimeout(() => {
		errorLbl.textContent = "";
	}, 5000);
};

const resetGame = () => {
	// document.querySelector(".game-word").textContent = "";
	document.querySelector(".error-msg-lbl").textContent = "";
	document.querySelector(".word-entry-input").value = "";
	document.querySelector(".guessed-words-section").textContent = "";
	document.querySelector(".total-words-found").textContent = "0";
  document.querySelector(".total-points").textContent = "0"

	wordList = [];
	generateRandomWord();
	console.log("reset game");
};

const showGameOverScreen = () => {
	const startGameWrapper = document.querySelector(".start-game-wrapper");
	// const controlsWrapper = document.querySelector(".game-controls-wrapper");
  const startGameBtn = document.querySelector(".start-game-btn");
  const inputArea = document.querySelector(".input-area");
	const timerWrapper = document.querySelector(".timer-wrapper");
	const getNewWordBtn = document.querySelector(".get-new-word-btn");

	startGameWrapper.classList.remove("d-none");

	// startGameWrapper.append(controlsWrapper);
	getNewWordBtn.classList.add("d-none");
	inputArea.classList.add("d-none");
	timerWrapper.classList.add("d-none");

	startGameBtn.removeEventListener("click", toggleVisibleAndPlay);
	startGameBtn.addEventListener("click", toggleVisibleAndPlay);
};

const handleGameOver = () => {
	const gameMessage = document.querySelector(".game-message");
	const startGameBtn = document.querySelector(".start-game-btn");
	const wordEntryForm = document.querySelector(".word-entry-form");
  const wordEntryInput = document.querySelector(".word-entry-input")
	// const easyLevel = document.querySelector(".easy-level");
	// const normalLevel = document.querySelector(".normal-level");

  gameMessage.classList.remove("d-none")
	gameMessage.textContent = "GAME OVER";

	// easyLevel.classList.remove("active");
	// normalLevel.classList.remove("active");
	// normalLevel.classList.add("active");
	// easyLevel.removeEventListener("click", resetOnEasyLevel);
	// normalLevel.removeEventListener("click", resetOnNormalLevel);
	wordEntryForm.removeEventListener("submit", preventFormReload);
	wordEntryInput.removeEventListener("input", allowOnlyAlphabetChars);
	startGameBtn.removeEventListener("click", toggleVisibleAndPlay);

	showGameOverScreen();

	// resetGame();
	// prepOnPageLoad();
};

prepOnPageLoad();
