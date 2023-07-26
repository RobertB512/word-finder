const wordList = [];

const addUserWord = async guessedWord => {
	const guessedWordsSection = document.querySelector(".guessed-words-section");

	if (guessedWord && wordList.indexOf(guessedWord) === -1) {
		console.log("valid word");
		const userWord = guessedWord;
		wordList.push(guessedWord);
		console.log("words", wordList);
		console.log("guessedWord is", userWord);
		let goodWord = document.createElement("p");
		goodWord.classList.add("good-word");
		goodWord.textContent = userWord;
		console.log("goodWord is", goodWord);
		guessedWordsSection.append(goodWord);
	} else if (!(wordList.indexOf(guessedWord) === -1)) {
		console.log("This word is already in the list");
	}
};

const checkWordInGameWord = async userWord => {
	const gameWord = document.querySelector(".game-word").textContent;
	let wordStatus = false;
	console.log(`is ${userWord} in ${gameWord}`);

	for (let letter of userWord) {
    console.log(`checking letter ${letter}`);
		if (!(gameWord.indexOf(letter) === -1)) {
			console.log("entered if");
			wordStatus = true;
		} else {
			console.log("entered else");
			wordStatus = false;
			break;
		}
	}
	wordStatus
		? addUserWord(userWord)
		: console.log(`One or more letters in ${userWord} aren't in ${gameWord}`);
};

const checkWord = async wordToVerify => {
	const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordToVerify}`;
	try {
		const response = await fetch(url);
		if (response.ok) {
			const data = await response.json();
			const theWord = await data[0].word;
			console.log("here is the word:", theWord);
			checkWordInGameWord(theWord.toUpperCase());
		} else {
			console.log("ERROR: might not be a valid word");
		}
	} catch (error) {
		console.log("failed fetch:", error);
	}
};

const getWordFromUser = async () => {
	const wordEntryForm = document.querySelector(".word-entry-form");
	const wordEntryInput = document.querySelector(".word-entry-input");

	wordEntryForm.addEventListener("submit", e => {
		e.preventDefault();
		checkWord(wordEntryInput.value);
	});
};

getWordFromUser();
