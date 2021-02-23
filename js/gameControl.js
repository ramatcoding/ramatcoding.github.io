/*=================================================================================================
-- GLOBAL VARIABLES
	These variables will be available to all of the page's scripts
-------------------------------------------------------------------------------------------------*/
var gameEngine;
/*===============================================================================================*/

/*=================================================================================================
-- ONLOAD LISTENER
-------------------------------------------------------------------------------------------------*/
window.addEventListener("load", initialiseGame, false);
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: initialiseGame()
	Starts the game engine, assigning it to the global variable called 'gameEngine'.
	Also starts a new game.
-------------------------------------------------------------------------------------------------*/
function initialiseGame() {
	gameEngine = new com.flametreepublishing.cfk.HungryMan();
	startNewGame();
}
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: startNewGame()
	Starts a new game by clearing anything that may be left over from a previous game and then
	resetting all game parameters
-------------------------------------------------------------------------------------------------*/
function startNewGame() {
	gameEngine.resetGameGraphics();
	gameEngine.loadNewWord();
	var wordLength = gameEngine.getLengthOfCurrentWord();
	buildCurrentWordDisplay(wordLength);
	buildLetterButtons();
}
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: buildCurrentWordDisplay(numberOfLetters:Number):Void
	A one row table is used for displaying the "slots" in which the letters of the mystery
	word are displayed (and shown as empty when the letter is unguessed).
	This method clears the tr element containing the current word/guesses and then creates a new
	tr element with the number of td elements indicated by numberOfLetters 
-------------------------------------------------------------------------------------------------*/
function buildCurrentWordDisplay(numberOfLetters) {
	var currentWordTBody = document.getElementById("currentWordTable").getElementsByTagName("tbody")[0];
	while (currentWordTBody.hasChildNodes()) {
		currentWordTBody.removeChild(currentWordTBody.firstChild);
	}
	var newRow = document.createElement("tr");
	var newCell;
	for (var i = 0; i < numberOfLetters; i++) {
		newCell = document.createElement("td");
		newRow.appendChild(newCell);
	}
	currentWordTBody.appendChild(newRow);
}
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: buildLetterButtons():Void
	Clears the letter buttons from the previous game (if any exist) and then creates a new set
	of 26 buttons that the player clicks to guess a letter. The buttons are arranged in two rows,
	each row being a div element
-------------------------------------------------------------------------------------------------*/
function buildLetterButtons() {
	var letterButtonsWrapper = document.getElementById("letterButtonsWrapper");
	while (letterButtonsWrapper.hasChildNodes()) {
		letterButtonsWrapper.removeChild(letterButtonsWrapper.firstChild);
	}
	var row1 = document.createElement("div");
	var row2 = document.createElement("div");
	for (var i = 65; i <= 90; i++) {
		var newButton = document.createElement("button");
		var theLetter = String.fromCharCode(i);
		newButton.innerHTML = theLetter;
		newButton.setAttribute("letter", theLetter);
		newButton.className = "untried";
		newButton.addEventListener("click", guessLetter, false);
		if (i < 78) {
			row1.appendChild(newButton);
		} else {
			row2.appendChild(newButton);
		}
	}
	letterButtonsWrapper.appendChild(row1);
	letterButtonsWrapper.appendChild(row2);	
}
/*===============================================================================================*/


/*=================================================================================================
-- FUNCTION / EVENT HANDLER: tryLetter(eventObj:Object)
	Triggered when the player clicks on a letter button. Handles the subsequent actions
-------------------------------------------------------------------------------------------------*/
function guessLetter(eventObj) {
	if (gameEngine.isGameOver()) {
		//the game is over, so exit the function without doing anything
		return;
	}
	var clickedButton = eventObj.target;
	var letterToGuess = clickedButton.getAttribute("letter");
	if (gameEngine.hasLetterBeenTried(letterToGuess)) {
		window.alert("You have already tried the letter " + letterToGuess);
		return;
	}
	var guessResult = gameEngine.guessLetter(letterToGuess);
	var isGameOver;
	var isGameLost = false;
	if (guessResult.length == 0) {
		clickedButton.className = "nomatch";
		isGameOver = gameEngine.registerIncorrectGuess();
		if(isGameOver) {
			isGameLost = true;
		}
	} else {
		clickedButton.className = "match";
		var currentWordCells = document.getElementById("currentWordWrapper").getElementsByTagName("td");
		for (var i = 0; i < guessResult.length; i++) {
			var thisMatchPosition = guessResult[i];
			currentWordCells[(thisMatchPosition)].innerHTML = letterToGuess;
		}
		isGameOver = gameEngine.isWordGuessed();
	}
	if (isGameOver) {
		if (isGameLost) {
			gameEngine.eatTheFood();
		} else {
			gameEngine.reportGameOver();
		}
	}
}
/*===============================================================================================*/




