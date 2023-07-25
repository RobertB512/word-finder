const addUserWord = async guessedWord => {
	const guessedWordsSection = document.querySelector(".guessed-words-section");

	if (guessedWord) {
		console.log("valid word");
		const userWord = guessedWord;
		console.log("guessedWord is", userWord);
		let goodWord = document.createElement("p");
		goodWord.classList.add("good-word");
		goodWord.textContent = userWord;
		console.log("goodWord is", goodWord);
		guessedWordsSection.append(goodWord);
	}
};

const checkWord = async wordToVerify => {
	const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordToVerify}`;
	try {
		const response = await fetch(url);
		if (response.ok) {
			const data = await response.json();
			const theWord = await data[0].word;
			console.log("here is the word:", theWord);
			addUserWord(theWord);
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
