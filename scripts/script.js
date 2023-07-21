const addUserWord = guessedWord => {
	const guessedWordsSection = document.querySelector(".guessed-words-section");

	if (guessedWord) {
		console.log("valid word");
		let goodWord = document.createElement("p")
    goodWord.classList.add("good-word")
    goodWord.textContent = guessedWord;
    console.log("goodWord is", goodWord)
		guessedWordsSection.append(goodWord);
	}
};

const getWordFromUser = () => {
	const wordEntryForm = document.querySelector(".word-entry-form");
	const wordEntryInput = document.querySelector(".word-entry-input");

	wordEntryForm.addEventListener("submit", e => {
		e.preventDefault();
		console.log(wordEntryInput.value);
		addUserWord(wordEntryInput.value);
	});
};

getWordFromUser();
