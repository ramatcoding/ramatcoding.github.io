/*=================================================================================================
-- GameControl
	This script defines a number of functions and variables which exist in the global namespace.
	This means they can be called from any script running on the page. Many of the functions
	here could have been included in one of the game's classes, but for reasons of clarity and
	convenience we've separated them out into this script.
=================================================================================================*/

/*=================================================================================================
-- GLOBAL VARIABLES
	Global variables are available to any script in a page. 
-------------------------------------------------------------------------------------------------*/
//gameEngine will store an instance of the HungryMan class. That instance will be created when
//the web page finished loading; for now we'll simply declare the variable in the global namespace
var gameEngine;
/*===============================================================================================*/

/*=================================================================================================
-- ONLOAD LISTENER
	This event listner will be triggered when the page has finished loading into the browser
	window. If we initialised the game prior to the onload listener being triggered, then we
	could not guarantee that all of the required scripts and HTML elements will be loaded
-------------------------------------------------------------------------------------------------*/
window.addEventListener("load", initialiseGame, false);
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: initialiseGame()
	This function handles the onload event. It starts the game engine, assigning it to the
	gameEngine global variable, and then calls the startNewGame() function to start a new game
-------------------------------------------------------------------------------------------------*/
function initialiseGame() {
	//Assign an instance of the HungryMan class to the gameEngine global variable
	gameEngine = new com.flametreepublishing.cfk.HungryMan();
	//Call the startNewGame() function
	startNewGame();
}
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: startNewGame()
	This function starts a new game by clearing anything that may be left over from a previous
	game and then resetting all game parameters.
-------------------------------------------------------------------------------------------------*/
function startNewGame() {
	//Call the gameEngine's resetGameGraphics() method
	gameEngine.resetGameGraphics();
	//Instruct the gameEngine to load a new word
	gameEngine.loadNewWord();
	//We need to know the length of the current word in order to build the currentWordDisplay
	//table - we can get the value by calling the gameEngine's getLengthOfCurrentWord() method
	var wordLength = gameEngine.getLengthOfCurrentWord();
	//Call the buildCurrentWordDisplay() function to build the table that represents the current
	//word, and reveals correctly-guessed letters
	buildCurrentWordDisplay(wordLength);
	//Call the buildLetterButtons() function to build the set of buttons that the player will
	//click when guessing a letter
	buildLetterButtons();
}
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: buildCurrentWordDisplay(numberOfLetters:Number):Void
	This function builds the currentWordTable area of the page, which represents the current word,
	showing underlines for each unquessed letter, and the locations of any correctly guessed
	letter.
	
	currentWordTable is a <table> with a single <tr> row containing a <td> element for each letter
	of the currentWord. 

	The function clears any existing <tr> element within the table before creating a new one.
-------------------------------------------------------------------------------------------------*/
function buildCurrentWordDisplay(numberOfLetters) {
	//Get a reference to the <tbody> element of the currentWordTable <table> element
	//Note the use of getElementsByTagName() which returns an array of elements of a given element
	//name. We know there's only one <tbody> element on the page, so select the first element
	//(index 0) of that array
	var currentWordTBody = document.getElementById("currentWordTable").getElementsByTagName("tbody")[0];
	//Remove any <tr> elements from the <tbody> element using a while loop which will repeat until
	//the <tbody> element has no child elements within it.
	while (currentWordTBody.hasChildNodes()) {
		currentWordTBody.removeChild(currentWordTBody.firstChild);
	}
	//Create a new <tr> element for the currentWord
	var newRow = document.createElement("tr");
	//Declare a variable in which we'll store temporarily the <td> elements that represent
	//each letter of the word. We only need store them in this variable whilst creating them;
	//once the HTML <td> element has been added to the document we can reuse the newCell
	//variable when creating the new <td> element
	var newCell;
	//Create the individual <td> elements by using a for loop
	for (var i = 0; i < numberOfLetters; i++) {
		//Create a new <td> element and assign it to the newCell variable
		newCell = document.createElement("td");
		//Add the newCell element to the <tr> element
		newRow.appendChild(newCell);
	}
	//Add the <tr> element to the page's <tbody> element so that it is displayed on the screen
	currentWordTBody.appendChild(newRow);
}
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: buildLetterButtons():Void
	This function builds the 26 buttons that the player clicks to guess a letter. The buttons
	are arranged in two rows, each being a <div> element.
	
	Any existing buttons are removed before the new letter buttons are created.
-------------------------------------------------------------------------------------------------*/
function buildLetterButtons() {
	//The letterButtonsWrapper is a <section> element that is hard-coded into the HTML document
	//and is where the letterButtons will be displayed. Grab a reference to that element and
	//store it in the variable letterButtonsWrapper.
	var letterButtonsWrapper = document.getElementById("letterButtonsWrapper");
	//Use a while loop to remove any child elements from the letterButtonsWrapper element
	while (letterButtonsWrapper.hasChildNodes()) {
		letterButtonsWrapper.removeChild(letterButtonsWrapper.firstChild);
	}
	//Create two new <div> elements, one for each row of buttons
	var row1 = document.createElement("div");
	var row2 = document.createElement("div");
	//In JavaScript, text characters have a numeric 'character code' that can be used to refer
	//to a specific letter or character. Capital A has a code of 65; capital Z has a code of 90
	//Therefore, by looping through the number 65 to 90 we can create a button for each letter
	//of the alphabet, and use the loop index value to generate the letter for the button.
	for (var i = 65; i <= 90; i++) {
		//Create a new <button> element
		var newButton = document.createElement("button");
		//Convert the loop index, i, into its corresponding letter by using the fromCharCode()
		//method of the String object
		var theLetter = String.fromCharCode(i);
		//Assign theLetter to the innerHTML property of the <button> element - this will be the
		//letter displayed on the button
		newButton.innerHTML = theLetter;
		//Create a new attribute on the <button> element called "letter", and assign the value
		//of theLetter to this element. This will be used when handling button clicks
		newButton.setAttribute("letter", theLetter);
		//Set the <button> element's style class to "untried"
		newButton.className = "untried";
		//Add an event listener to the <button> element to listen for the onclick event
		newButton.addEventListener("click", guessLetter, false);
		//If the loop index < 78 (which corresponds to the letter N) then the <button> element
		//should be added to the first row's <div> element, otherwise add it to the second row
		if (i < 78) {
			row1.appendChild(newButton);
		} else {
			row2.appendChild(newButton);
		}
	}
	//Add the two <div> rows to the letterButtonsWrapper element
	letterButtonsWrapper.appendChild(row1);
	letterButtonsWrapper.appendChild(row2);	
}
/*===============================================================================================*/


/*=================================================================================================
-- FUNCTION / EVENT HANDLER: tryLetter(eventObj:Object)
	This function is triggered by the onclick event listeners attached to the letter buttons. It
	handles the various actions that take place as a result of clicking a button. The event
	listener passes an object that contains data about the event, which the function captures as
	the eventObj parameter.
-------------------------------------------------------------------------------------------------*/
function guessLetter(eventObj) {
	//Check whether the game is over
	if (gameEngine.isGameOver()) {
		//the game is over, so exit the function without doing anything
		return;
	}
	//The target property of the eventObj is a reference to the element that was clicked; store
	//that reference in a variable called clickedButton for convenience
	var clickedButton = eventObj.target;
	//Get the value of the clickedButton's letter attribute - this is the letter that's to be
	//tested against the hidden word
	var letterToGuess = clickedButton.getAttribute("letter");
	//Check if the letter has already been guessed
	if (gameEngine.hasLetterBeenTried(letterToGuess)) {
		//The letter has been guessed - inform the player and then exit the function
		window.alert("You have already tried the letter " + letterToGuess);
		return;
	}
	//Call the game engine's guessLetter() method and capture the result in a variable
	//called guessResult. guessResult will then be an array that indicates if the guessed letter
	//has any matches in the currentWord
	var guessResult = gameEngine.guessLetter(letterToGuess);
	//The guess may result in the game finishing. Declare a variable to store the game over
	//state (which we'll work out in the following statements), but don't assign a value yet,
	//and declate a variable to indicate whether the game is won or lost - initialise that
	//variable to false
	var isGameOver;
	var isGameLost = false;
	//Check the length of the guessResult array
	if (guessResult.length == 0) {
		//If guessResult contains no elements then the letter does not occur in the currentWord.
		//The clickedButton element needs to change color to reflec that it's been clicked and
		//no match was found; we can do this by assigning it a CSS class of "nomatch"
		clickedButton.className = "nomatch";
		//Call the gameEngine's registerIncorrectGuess() method, which will return true if the
		//incorrect guess results in the game finishing, otherwise it will return false. Capture
		//the result in the isGameOver variable
		isGameOver = gameEngine.registerIncorrectGuess();
		//Check if the game is over
		if(isGameOver) {
			//The game ended as a result of an incorrect guess, which means that the game must
			//have been lost, therefore set isGameLost to true
			isGameLost = true;
		}
	} else {
		//guessResult has entries in it, which means the clicked letter does have a match in the
		//currentWord. Setting the clickedButton's CSS class to "match" will cause the
		//<button> element to change color to indicate that the letter has been tried and
		//matched a letter in currentWord
		clickedButton.className = "match";
		//Get an array of the <td> elements that represent the currentWord
		var currentWordCells = document.getElementById("currentWordWrapper").getElementsByTagName("td");
		//Loop through the guessResult array
		for (var i = 0; i < guessResult.length; i++) {
			//Each item in the guessResult array will be an index position of a correctly
			//guessed letter. Store this index as thisMatchPosition 
			var thisMatchPosition = guessResult[i];
			//The matched letter needs to be displayed in the <td> element that corresponds
			//to that letter. This <td> element will be at index thisMatchPosition of the
			//currentWordCells array; assigning the guessed letter to the innerHTML property of
			//this <td> element will cause the letter to be displayed in the correct location
			//in the currentWordTable
			currentWordCells[(thisMatchPosition)].innerHTML = letterToGuess;
		}
		//The game will be over if, as a result of this guess, the currentWord was fully revealed
		//We can test this by calling the gameEngine's isWordGuessed method
		isGameOver = gameEngine.isWordGuessed();
	}
	//Check if the game is over
	if (isGameOver) {
		//The game is over, so check whether the game is won or last
		if (isGameLost) {
			//The game is lost - tell Hungry Man to eat the food by calling the gameEngine's
			//eatTheFood() method
			gameEngine.eatTheFood();
		} else {
			//The game was won - call the gameEngine's reportGameOver() method in order to have
			//it create the game over message and panel
			gameEngine.reportGameOver();
		}
	}
}
/*===============================================================================================*/
