/*=================================================================================================
-- CodeBreaker Class
	This class acts as the main 'game engine' for the CodeBreaker game
=================================================================================================*/

/*=================================================================================================
-- NAMESPACE INITIALISATION
	In JavaScript a 'namespace' is an object in which we define other objects. The reason for
	doing this is to avoid any identifier names used in a script from 'clashing' with the same
	names used in another script. This is particularly important when defining classes, as it
	ensures all of the classes method and property names are unique, even if the same identifiers
	are used in another class or script.
	
	It's common to use a reversed domain name as a namespace - this is because you can
	be very sure that other developers won't have used your domain name as a namespace for their
	classes. Here we're using "com.flametreepublishing.cfk" as our namespace. Subsequent class
	method definitions are then assigned to this com.flametreepublishing.cfk object.
-------------------------------------------------------------------------------------------------*/
var com;
if (!com) {
	com = new Object();
}
if (!com.flametreepublishing) {
	com.flametreepublishing = new Object();
}
if (!com.flametreepublishing.cfk) {
	com.flametreepublishing.cfk = new Object();
}
/*===============================================================================================*/

/*=================================================================================================
-- CONSTRUCTOR
	This constructor creates a new instance of the CodeBreaker class, which acts as the main game
	engine.
	
	Classes always have a 'constructor' method. This is the method that's called when a new
	instance of the class is created with the 'new' keyword.
	
	The 'this' keyword, that you see used througout this script, is a reference to the instance
	of the class that's handling the method or stores the property value - I.E. the object itself.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker = function() {
	//codeSymbolFactory is an instance of the CodeSymbolFacotry class. See CodeSymbolFactory.js
	//for information about this, and on how the game generates and manages the code symbol
	//graphics that it relies on.
	this.codeSymbolFactory = new com.flametreepublishing.cfk.CodeSymbolFactory();
	//The game uses an instance of the CodeBreakerGame class to manage each individual game; the
	//currentGame property will hold a reference to that CodeBreakerGame instance
	this.currentGame = null;	
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: startNewGame(numSymbols, codeLength, maxGuesses):Void
	This method clears any existing game, and then creates a new game.
	
	The method's parameters are as follows:
		numSymbols is the number of different symbols to use in the game
		codeLength is the length of the hidden code
		maxGuesses is the maximum number of guesses allowed per-game
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.startNewGame = function(numSymbols, codeLength, maxGuesses) {
	//Check if a current game exists
	if (this.currentGame) {
		//If there were nothing assigned to currentGame then the if condition would evaluate to
		//false, so if it evaluates to true we know there's a CodeBreakerGame instance assigned
		//to the currentGame property. Call clearCurrentGame() to remove that game and its
		//on-screen elements
		this.clearCurrentGame();
	}
	//Create a new CodeBreakerGame instance, passing in the method parameters as arguments to
	//the CodeBreakerGame constructor. Those arguments are converted to numbers (just to be sure)
	//using the Number() function
	this.currentGame = new com.flametreepublishing.cfk.CodeBreakerGame(Number(numSymbols), Number(codeLength), Number(maxGuesses));
	//Call buildSymbolsInGamePanel() to create the on-screen listing of the symbols that are
	//in use in the game
	this.buildSymbolsInGamePanel();
	//Build the buttons that are used for selecting a code to test against the hidden code
	this.buildInputButtons();
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: clearCurrentGame():Void
	This method removes any existing game and resets the per-game graphics and on-screen items
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.clearCurrentGame = function() {
	//If currentGame is null then there is no current game to remove, so drop out of the method
	if (this.currentGame == null) {
		return;
	}
	//Get a reference to the <div> element with id "inputCodeButtons", which is hard-coded
	//in the HTML document
	var inputCodeButtonsEl = document.getElementById("inputCodeButtons");
	//Remove any existing input buttons by removing all child elements of the inputCodeButtonsEl
	//<div> element. Do this with a while loop.
	while (inputCodeButtonsEl.hasChildNodes()) {
		inputCodeButtonsEl.removeChild(inputCodeButtonsEl.childNodes[0]);
	}
	//Get a reference to the <tbody> element of the <table> element in which previously guessed
	//code sequences will be displayed. We're doing this with the querySelectorAll() method of
	//the HTMLDocument class, which takes as an argument a CSS selector string and returns an
	//array of elements that match the selector. I.E. the argument used here will select all
	//<tbody> elements that are descended from the element with id="resultsTable".
	var resultsTBodyEl = document.querySelectorAll("#resultsTable tbody")[0];
	//Loop through the resultsTBodyEl element removing any child elements
	while (resultsTBodyEl.hasChildNodes()) {
		resultsTBodyEl.removeChild(resultsTBodyEl.childNodes[0]);
	}
	//Get a reference to the <div> element that will contain the list of symbols that are
	//in use in the current game
	var currentSymbolsDisplayEl = document.getElementById("currentSymbolsDisplay");
	//Loop through the children of currentSymbolsDisplayEl, removing them from the page
	while (currentSymbolsDisplayEl.hasChildNodes()) {
		currentSymbolsDisplayEl.removeChild(currentSymbolsDisplayEl.childNodes[0]);
	}
	//Reset the currentGame property to null - this will delete the existing CodeBreakerGame
	//instance
	this.currentGame = null;
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: buildSymbolsInGamePanel():Void
	This method creates the on-screen output that shows the set of symbols that are in use in the
	current game. The symbols are laid out in one or two rows, depending on the number of symbols
	that are in-play.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.buildSymbolsInGamePanel = function() {
	//Create the <table> which will be used to display the current in-game symbols, and give it an
	//id of "currentSymbolsTable"
	var currentSymbolsTableEl = document.createElement("table");
	currentSymbolsTableEl.id = "currentSymbolsTable";
	//Create a <tbody> element for the new <table>
	var tbodyEl = document.createElement("tbody");
	//Set a variable that will control the maximum number of symbols to display per-row of the
	//<tbody> element.
	var maxRowLength = 8;
	//If the current symbols table has to create a second row, then we want to show an even number
	//of symbols in each row. As preparation for this, declare a variable that will control the
	//length of the first row of symbols; for now, intialise it to match the maxRowLength variable
	var row1Length = maxRowLength;
	//Create a <tr> element for the first row of symbols
	var row1El = document.createElement("tr");
	//Check to see if the in-game symbols will fit in one row
	if (this.currentGame.numSymbols > maxRowLength) {
		//If there are more symbols in the game than the maxRowLength value, then create the
		//<tr> element for that row
		var row2El = document.createElement("tr");
		//Adjust the row1Length to be half of the total number of symbols in the game. (You may
		//wish to lookup the Math class and its ciel() method on w3schools.com)
		var row1Length = Math.ceil(this.currentGame.codeSymbolIds.length / 2);
	}
	//Now that we have created the <tr> elements in which to display the in-game code symbols, and
	//know how many symbols to place in each row, loop through the list of symbols in the current
	//game (stored in the currentGame.codeSymbolIds array - see CodeBreakerGame.js) to create the
	//<td> elements that will display the symbol graphics.
	for (var i=0; i < this.currentGame.codeSymbolIds.length; i++) {
		//Create a new CodeSymbol object for this repetition of the loop
		var codeSymbol = this.codeSymbolFactory.newCodeSymbol(this.currentGame.codeSymbolIds[i], "blue");
		//Call the CodeSymbol object's getHtmlElement() method to get the HTML elements that comprise
		//the symbol
		var codeSymbolEl = codeSymbol.getHtmlElement();
		//Create a new <td> element in which to display the CodeSymbol's HTML elements
		var tdEl = document.createElement("td");
		//Add the CodeSymbol object's HTML elements to the new <td> element
		tdEl.appendChild(codeSymbolEl);
		//Add the new <td> element to one or other of the table's <tr> elements
		if (i < row1Length) {
			row1El.appendChild(tdEl);
		} else {
			row2El.appendChild(tdEl);
		}
	}
	//Add the <tr> element(s) to the <tbody> element
	tbodyEl.appendChild(row1El);
	if (row2El) {
		tbodyEl.appendChild(row2El);
	}
	//Add the <tbody> element to the <table> element
	currentSymbolsTableEl.appendChild(tbodyEl);
	//Add the <table> element to the <div> element with an id attribute value of
	//"currentSymbolsDisplay"
	document.getElementById("currentSymbolsDisplay").appendChild(currentSymbolsTableEl);	
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: buildInputButtons():Void
	The method creates the set of input buttons on-screen. The input buttons are the graphics that
	the player clicks to construct an input code.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.buildInputButtons = function() {
	//If there is no currentGame then exit the method
	if (this.currentGame == null) {
		return;
	}
	//The input buttons will initially show the graphic for the first symbol in-use in the game,
	//so lookup the symbolID for that code symbol.
	var firstSymbolIdInGame = this.currentGame.codeSymbolIds[0];
	//Get a reference to the <div> element in which the input code buttons will be displayed
	var inputCodeButtonsEl = document.getElementById("inputCodeButtons");
	//The input code buttons are laid out in a table - create that table element
	var tableEl = document.createElement("table");
	//Create a <tbody> element for the table
	var tbodyEl = document.createElement("tbody");
	//Create the single <tr> element that the new <tbody> will contain
	var trEl = document.createElement("tr");
	//The first <td> cell in the table will display the current guess number; create that
	//<td> element and add the current guess number to it
	var guessNumberTdEl = document.createElement("td");
	guessNumberTdEl.innerHTML = String(this.currentGame.guesses.length + 1) + ".";
	//Add the first <td> element to the <tr> element
	trEl.appendChild(guessNumberTdEl);
	//Use a loop to create a <td> element and code symbol graphic for each symbol in the hidden
	//code
	for (var i = 0; i < this.currentGame.codeLength; i++) {
		//Create a CodeSymbol object
		var codeSymbol = this.codeSymbolFactory.newCodeSymbol(firstSymbolIdInGame, "blue");
		//Use the CodeSymbol object's getHtmlElement() method to generate the symbol's HTML
		//elements
		var codeSymbolEl = codeSymbol.getHtmlElement();
		//The game needs to be able to tell which button has been clicked, so create an attribute
		//and value to store this information in the codeSymbolEl element
		codeSymbolEl.setAttribute("codeButtonNum", String(i));
		//The game needs to be able to tell which code symbol is currently being displayed
		//inside an input button; we can do this by creating a symbolId attribute on the
		//codeSymbolEl element, and giving it a value that matches the current symbol's ID
		codeSymbolEl.setAttribute("symbolId", codeSymbol.symbolId);
		//Style the input button using the "inputCodeButton" CSS class
		codeSymbolEl.className = "inputCodeButton";
		//When the user left-clicks the button it should cycle to show the next symbol in the
		//game. Add an event listener to listen for that click.
		codeSymbolEl.addEventListener("click", cycleCodeButton, false);
		//When the user right-clicks the button it should cycle to show the previous symbol in
		//the game. Right-clicks generate a "contextmenu" event. Add an event listener to
		//to listen for right-clicks
		codeSymbolEl.addEventListener("contextmenu", cycleCodeButton, false);
		//Create a <td> element in which the input code button will be displayed
		var tdEl = document.createElement("td");
		//Add the codeSymbolEl element to the new <td> element
		tdEl.appendChild(codeSymbolEl);
		//Add the new <td> element to the <tr> element
		trEl.appendChild(tdEl);
	}
	//The last item in the input buttons table is the "Submit" button - create its <button> element
	var submitButtonEl = document.createElement("button");
	//Give the new <button> element an ID attribute value
	submitButtonEl.id = "submitInputCodeButton";
	//Set the text that will appear as the <button> label
	submitButtonEl.innerHTML = "Submit";
	//Add a listener to the <button> to capture its onclick event
	submitButtonEl.addEventListener("click", submitInputCode, false);
	//Create a <td> element to contain the <button> element
	var tdEl = document.createElement("td");
	//Add the <button> to the new <td> element
	tdEl.appendChild(submitButtonEl);
	//Add the <td> element to the <tr> element
	trEl.appendChild(tdEl);
	//Add the <tr> element to the <tbody> element
	tbodyEl.appendChild(trEl);
	//Add the <tbody> element to the <table> element
	tableEl.appendChild(tbodyEl);
	//Finally, add the <table> element to the <div> that contains the input code buttons table
	inputCodeButtonsEl.appendChild(tableEl);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: cycleInputCodeButton(buttonNum:Number, symbolId:String, cycleDirection:String):Void
	This method changes the symbol displayed in an input button. The method's parameters are...:		
		buttonNum indicates which of the code input buttons to update
		symbolId indicates the current symbol being displayed by the button
		cycleDirection indicates whether to cycle forward or backward
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.cycleInputCodeButton = function(buttonNum, symbolId, cycleDirection) {
	//Get a reference to the code button that was clicked
	var codeButtonEl = document.getElementsByClassName("inputCodeButton")[buttonNum];
	//Declare a variable that will store the ID of the new symbol to be displayed
	var newSymbolId;
	//Get the next or previous symbol ID, depending on the value of cycleDirection
	if (cycleDirection == "forward") {
		newSymbolId = this.currentGame.getNextSymbolId(symbolId);
	} else {
		newSymbolId = this.currentGame.getPreviousSymbolId(symbolId);
	}
	//Get a new CodeSymbol object that shows the symbol with an ID of newSymbolId
	var newCodeSymbol = this.codeSymbolFactory.newCodeSymbol(newSymbolId, "blue");
	//Create the HTML element for the new CodeSymbol
	var newCodeButtonEl = newCodeSymbol.getHtmlElement();
	//Set the codeButtonNum attribute on newCodeButtonEl
	newCodeButtonEl.setAttribute("codeButtonNum", String(buttonNum));
	//Set the symbolId attribute on newCodeButtonEl
	newCodeButtonEl.setAttribute("symbolId", newSymbolId);
	//Set the CSS class for newCodeButtonEl
	newCodeButtonEl.className = "inputCodeButton";
	//Add the left and right click listeners to newCodeButtonEl
	newCodeButtonEl.addEventListener("click", cycleCodeButton, false);
	newCodeButtonEl.addEventListener("contextmenu", cycleCodeButton, false);
	//Replace the existing codeButtonEl element with newCodeButtonEl
	codeButtonEl.parentNode.replaceChild(newCodeButtonEl, codeButtonEl);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: tryCode(inputCode:Array):Array
	This method tests the code defined in the input buttons against the hidden code, and takes
	actions that result from the code being tried. The inputCode parameter is an array containing
	the symbolIDs for the configuration of the input buttons. The method returns an array that
	describes the result of the guess
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.tryCode = function(inputCode) {
	//Check that there is a game in progress
	if (this.currentGame != null) {
		//Get the result by calling the CodeBreakerGame instance's tryCode() method 
		var codeResult = this.currentGame.tryCode(inputCode);
		//Get a reference to the <td> element that shows the current guess number (alongside the
		//input buttons), and update it. Get the reference using the querySelectorAll() method of
		//the HTMLDocument class, which uses CSS selectors to find and return an array of
		//HTML elements
		var guessNumTdEl = document.querySelectorAll("#inputCodeButtons td:first-child")[0];
		//Update the guess number
		guessNumTdEl.innerHTML = String(this.currentGame.guesses.length + 1) + ".";
	}
	//Return the result of the method
	return(codeResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: displayResult(inputCode:Array, codeResult:Array):Void
	This method displays the results a guess. Guess results are shown directly below the input
	buttons, in reverse order (I.E. the topmost guess	is the most recent one). The methods
	parameters are:
		inputCode is an array of the symbolId that were submitted
		codeResult is an array indicating the result of the guess
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.displayResult = function(inputCode, codeResult) {
	//Get a reference to the <tbody> element of the <table> that displays the results
	var resultsTBodyEl = document.querySelectorAll("#resultsTable tbody")[0];
	//Create a new <tr> element that will display the results of the guess
	var newResultEl = document.createElement("tr");
	//Create the <td> element that will show the guess number
	var guessNumberTdEl = document.createElement("td");
	//Set the guess number inside the <td> element; this number will be the same as the length of
	//the currentGame's guesses array
	guessNumberTdEl.innerHTML = String(this.currentGame.guesses.length) + ".";
	//Add the <td> element to the new <tr> element
	newResultEl.appendChild(guessNumberTdEl);
	//Loop through the symbolIds of the input code to create the <td> elements required for
	//displaying the results
	for (var i = 0; i < inputCode.length; i++) {
		//Declare a variable for storing the new CodeSymbol object that will be displayed
		//in the results
		var resultCodeSymbol;
		//Switch is a conditional statement that's similar to an if statement - look it up on
		//w3schools.com if required. This switch statement creates a new code symbol colored to
		//reflect the result of that symbol. The codeResult array contains numbers between 0 and 2
		//that determine whether the corresponding symbol in the inputCode array matched the hidden
		//code or not. 0 = no match, 1 = out-of-position match, 2 = symbol and position match. The
		//new CodeSymbol object is assigned to the resultCodeSymbol variable
		switch (codeResult[i]) {
			case 0:
				resultCodeSymbol = this.codeSymbolFactory.newCodeSymbol(inputCode[i], "red");
				break;
			case 1:
				resultCodeSymbol = this.codeSymbolFactory.newCodeSymbol(inputCode[i], "amber");
				break;
			case 2:
				resultCodeSymbol = this.codeSymbolFactory.newCodeSymbol(inputCode[i], "green");
				break;
			default:
				resultCodeSymbol = this.codeSymbolFactory.newCodeSymbol(inputCode[i], "blue");
		}
		//Create the HTML elements for resultCodeSymbol
		var resultCodeSymbolEl = resultCodeSymbol.getHtmlElement();
		//Create a <td> element to contain the resultCodeSymbol element
		var tdEl = document.createElement("td");
		//Add the resultCodeSymbol element to the new <td> element
		tdEl.appendChild(resultCodeSymbolEl);
		//Add the new <td> element to the newResultsEl <tr> element
		newResultEl.appendChild(tdEl);		
	}
	//Add the new <tr> element as the first child of the results table's <tbody> element
	resultsTBodyEl.insertBefore(newResultEl, resultsTBodyEl.childNodes[0]);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getGameStatus():String
	This method returns a string indicating the current status of the game.
	Possible return values are: "noGame", "won", "lost" and "inProgress"
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.getGameStatus = function() {
	//Declare a variable to store the result
	var theResult;
	//Check if there is a game in progress
	if (this.currentGame == null) {
		//There is no game in progress, so set the method's result accordingly
		theResult = "noGame";
	} else {
		//There is a game in progress, so ask that game what the status is
		theResult = this.currentGame.getGameStatus();
	}
	//Return the method's result
	return(theResult);	
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getNumberOfPossibleCodes():Number
	This method calculates and returns the number of possible code cominations that exist in the
	current game. This number will be determined based on the current game's settings.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.getNumberOfPossibleCodes = function() {
	//Declare a variable for storing the method's result
	var theResult;
	//Check if there is a game in progress
	if (this.currentGame == null) {
		//If there is no game in progress then there are 0 possible codes in the game
		theResult = 0;
	} else {
		//The number of possible code combinations is numSymbols to the power codeLength
		//(I.E. numSymbols is multiplied by itself codeLength times). The pow() method of the
		//built-in Math object will do this calculation for us
		theResult = Math.pow(this.currentGame.numSymbols, this.currentGame.codeLength);
	}
	//Return the result of the method
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getCurrentGuessCount():Number
	This method returns the number of guesses that have been made in the current game
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.getCurrentGuessCount = function() {
	//Declare a variable for storing the method's result
	var theResult;
	//Check if a game is in progress
	if (this.currentGame == null) {
		//If no game is in progress then there are no current guesses
		theResult = 0;
	} else {
		//Set the result to be the number of guesses taken in the current game, which is the length
		//of the currentGame.guesses array
		theResult = this.currentGame.guesses.length;
	}
	//Return the result of the method
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- STATIC METHOD: getDataForCodeSymbol(aSymbolId:String):Object
	Returns the raw data for the code symbol with ID aSymbolId.
	The return object has the following properties:
		symbolId:String
			The id of the symbol (should match the aSymbolId argument)
		svg:String
			A string of svg markup
		offset:Object
			A coordinate object specifying the position at which the symbol should be offset
			from its button border. The coordinate object has the form {x:0, y:0}
-------------------------------------------------------------------------------------------------*/
/*com.flametreepublishing.cfk.CodeBreaker.getDataForCodeSymbol = function() {
	var allData = new Array();
	var s0 = new Object();
	s0.symbolId = "s0";
	s0.offset = {x:0, y:0};
	s0.svg = '<svg width="100%" height="100%" viewBox="0 0 27 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g transform="matrix(1,0,0,1,-4.38558,-5.17455)"><g transform="matrix(1.44444,0,0,1.44444,-8,-8)"><g id="s0" transform="matrix(-2.86369e-17,0.155892,-0.110765,-2.03473e-17,54.3692,-5.04238)"><path d="M91.389,304.701L92.997,294.246C93.534,290.672 94.487,287.753 95.857,285.489C97.227,283.225 99.625,280.738 103.05,278.027C106.476,275.317 111.793,271.46 119.001,266.456C136.336,254.362 149.83,248.316 159.48,248.316C162.399,248.316 164.47,248.911 165.691,250.103C166.912,251.294 167.523,253.379 167.523,256.358C167.523,258.443 166.733,261.302 165.155,264.936C163.576,268.57 160.687,274.319 156.487,282.183C152.287,290.046 148.579,297.106 145.362,303.361C142.741,308.484 139.762,313.92 136.426,319.669C133.09,325.417 130.856,329.364 129.724,331.509C128.592,333.653 128.026,335.262 128.026,336.334C128.026,337.526 128.413,338.553 129.188,339.417C129.962,340.281 130.915,340.713 132.047,340.713C133.596,340.713 135.339,339.879 137.275,338.211C139.211,336.543 143.009,332.938 148.668,327.398C151.408,324.658 154.342,321.411 157.47,317.658C160.597,313.905 164.484,309.08 169.131,303.182C173.778,297.284 178.067,291.804 181.999,286.74C184.441,283.583 186.645,280.753 188.611,278.251C190.577,275.749 192.26,273.828 193.66,272.487C195.06,271.147 196.177,270.477 197.011,270.477C197.726,270.477 198.888,271.37 200.496,273.157L202.641,275.928C204.249,278.191 205.053,279.83 205.053,280.842C205.053,282.034 202.834,286.397 198.396,293.933C193.958,301.469 190.19,307.992 187.092,313.503C183.994,319.013 179.988,326.966 175.074,337.362C170.159,347.757 165.438,359.299 160.91,371.988C173.003,362.874 181.284,356.782 185.752,353.714C190.22,350.646 193.467,349.112 195.492,349.112C196.862,349.112 197.547,349.678 197.547,350.81C197.547,352.061 196.892,353.685 195.581,355.68C194.271,357.676 192.513,359.88 190.309,362.293C188.105,364.706 184.784,368.19 180.346,372.748C175.908,377.305 171.067,382.235 165.825,387.537C162.608,390.813 159.48,394.626 156.442,398.975C153.404,403.323 151.051,406.689 149.383,409.072C147.715,411.455 146.196,412.825 144.826,413.183C142.8,413.778 140.953,413.332 139.285,411.842C137.617,410.353 136.783,408 136.783,404.783C136.783,402.519 137.93,397.843 140.224,390.754C142.517,383.664 145.987,374.848 150.634,364.303C153.374,357.989 156.174,352.017 159.034,346.387C161.893,340.757 165.184,334.562 168.908,327.8C172.631,321.039 176.28,314.62 179.854,308.543C183.429,302.467 186.467,297.284 188.969,292.995C183.012,300.799 177.099,308.38 171.231,315.737C165.363,323.094 158.81,330.839 151.572,338.97C144.334,347.102 137.022,354.712 129.635,361.801C126.418,364.84 124.109,366.91 122.709,368.012C121.309,369.114 119.477,369.665 117.214,369.665C115.784,369.665 114.399,369.173 113.059,368.19C111.718,367.208 110.601,365.927 109.708,364.348C108.814,362.769 108.367,361.235 108.367,359.746C108.367,357.244 108.739,355.04 109.484,353.134C110.229,351.227 111.525,348.368 113.371,344.555C121.473,328.173 127.371,316.943 131.064,310.867C144.289,289.659 150.902,277.774 150.902,275.213C150.902,274.379 150.604,273.708 150.008,273.202C149.413,272.696 148.668,272.443 147.774,272.443C146.106,272.443 144.111,273.172 141.787,274.632C139.464,276.091 136.545,278.251 133.03,281.11C129.515,283.97 125.241,287.395 120.207,291.387C115.173,295.378 109.886,299.191 104.346,302.825C102.142,304.254 99.655,305.952 96.885,307.918C94.114,309.884 92.521,310.867 92.104,310.867C91.27,310.867 90.853,310.45 90.853,309.616C90.853,308.841 91.032,307.203 91.389,304.701Z" style="fill:white;fill-rule:nonzero;"/></g></g></g></svg>';
	allData.push(s0);
	var s1 = new Object();
	s1.symbolId = "s1";
	s1.offset = {x:0, y:0};
	s1.svg = '<svg width="100%" height="100%" viewBox="0 0 24 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g transform="matrix(1,0,0,1,-6.27368,-5.37939)"><g transform="matrix(1.44444,0,0,1.44444,-8,-8)"><g id="s1" transform="matrix(-0.184842,-1.79768e-17,2.33698e-17,-0.152066,71.1281,89.4618)"><path d="M315.617,492.816L296.763,496.837C295.035,501.424 293.873,506.547 293.278,512.207C294.886,513.696 295.69,515.215 295.69,516.764C295.69,518.134 293.561,520.249 289.301,523.108C285.042,525.968 282.227,527.398 280.857,527.398C278.057,527.398 276.657,525.253 276.657,520.964C276.657,513.696 277.58,506.637 279.427,499.786C276.985,499.786 273.678,500.024 269.508,500.501C265.338,500.977 262.479,501.216 260.93,501.216C257.296,501.216 254.451,500.918 252.396,500.322C250.341,499.726 248.777,498.624 247.705,497.016C246.692,495.229 245.739,492.726 244.845,489.51C243.952,486.293 243.505,483.91 243.505,482.361C243.505,481.05 244.339,478.638 246.007,475.123C247.675,471.608 250.192,467.512 253.558,462.836C256.924,458.16 260.781,453.766 265.13,449.656C269.776,445.247 275.391,440.764 281.974,436.207C288.557,431.65 294.886,427.658 300.962,424.233C307.039,420.808 312.49,417.993 317.315,415.789C322.141,413.584 325,412.482 325.894,412.482C328.813,412.482 330.272,414.121 330.272,417.397C330.272,417.993 329.676,419.691 328.485,422.49C330.391,424.278 331.344,425.886 331.344,427.316C331.344,429.341 331.076,431.188 330.54,432.856C330.004,434.524 329.274,436.088 328.351,437.547C327.428,439.007 326.37,440.66 325.179,442.507C322.617,446.558 320.696,449.566 319.415,451.532C318.134,453.498 316.407,456.179 314.232,459.574C312.058,462.97 310.271,465.889 308.871,468.332C307.471,470.774 305.996,473.753 304.447,477.267C313.86,475.659 319.043,474.855 319.996,474.855C322.677,474.855 324.017,475.897 324.017,477.982C324.017,480.723 321.217,485.667 315.617,492.816ZM287.112,480.216C291.818,470.268 296.763,461.734 301.945,454.615C307.128,447.496 312.237,441.032 317.27,435.224C322.304,429.416 324.821,426.095 324.821,425.261C324.821,424.724 324.628,424.322 324.24,424.054C323.853,423.786 323.362,423.652 322.766,423.652C321.575,423.652 316.69,426.333 308.111,431.694C299.056,437.413 291.371,442.745 285.057,447.69C278.742,452.634 273.097,458.025 268.123,463.864C263.149,469.702 259.023,476.046 255.747,482.897C267.304,482.182 277.759,481.289 287.112,480.216Z" style="fill:white;fill-rule:nonzero;"/></g></g></g></svg>';
	allData.push(s1);
	var s2 = new Object();
	s2.symbolId = "s2";
	s2.offset = {x:0, y:0};
	s2.svg = '<svg width="100%" height="100%" viewBox="0 0 26 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g transform="matrix(1,0,0,1,-5.1471,-5.69562)"><g transform="matrix(1.44444,0,0,1.44444,-8,-8)"><g id="s2" transform="matrix(-0.0030582,0.311192,-0.266712,-0.00262107,175.351,-139.753)"><path d="M484.582,596.561L484.582,590.752C487.799,586.94 490.241,583.693 491.909,581.012C490.003,580.357 488.618,579.553 487.754,578.6C486.89,577.646 486.458,576.217 486.458,574.31C486.458,572.166 487.352,569.455 489.139,566.179C490.926,562.902 493.13,559.834 495.752,556.975C498.373,554.115 500.756,552.269 502.9,551.435C503.734,551.018 504.539,550.809 505.313,550.809C506.504,550.809 507.1,551.375 507.1,552.507C507.1,553.52 506.177,555.575 504.33,558.673C516.602,556.766 524.346,555.813 527.563,555.813C528.814,555.813 529.678,555.932 530.155,556.171C531.167,556.707 532.001,557.958 532.657,559.924C533.312,561.89 533.64,563.855 533.64,565.821C533.64,567.072 533.089,568.428 531.987,569.887C530.885,571.347 528.993,573.476 526.312,576.276C523.155,579.672 520.504,583.365 518.359,587.357C516.215,591.348 510.919,599.334 510.919,601.36C510.919,604.16 512.646,605.56 516.102,605.56C519.735,605.56 530.274,596.888 539.269,589.501L539.269,595.488C534.325,600.671 530.244,604.752 527.027,607.731C523.81,610.709 520.832,613.077 518.091,614.835C515.351,616.592 512.908,617.471 510.764,617.471C508.262,617.471 506.177,616.324 504.509,614.03C502.841,611.737 502.007,608.416 502.007,604.067C502.007,601.505 502.662,598.586 503.973,595.31C505.283,592.033 507.204,588.474 509.736,584.631C512.268,580.789 518.639,571.639 521.796,567.827C520.128,568.184 518.252,568.556 516.167,568.944C514.082,569.331 511.877,569.733 509.554,570.15C507.231,570.567 505.444,570.895 504.193,571.133C500.499,578.52 491.611,590.544 484.582,596.561Z" style="fill:white;fill-rule:nonzero;"/></g></g></g></svg>';
	allData.push(s2);
	var s3 = new Object();
	s3.symbolId = "s3";
	s3.offset = {x:0, y:0};
	s3.svg = '<svg width="100%" height="100%" viewBox="0 0 26 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g transform="matrix(1,0,0,1,-6.71322,-7.03653)"><g transform="matrix(1.44444,0,0,1.44444,-8,-8)"><g id="s3" transform="matrix(-0.0841438,-0.582944,0.424723,-0.154828,-141.842,203.482)"><path d="M214.819,418.16C212.885,419.726 211.219,421.015 209.819,422.027C208.42,423.04 207.163,423.827 206.049,424.389C204.935,424.95 203.936,425.231 203.052,425.231C202.408,425.231 201.612,424.775 200.663,423.864C199.715,422.953 198.905,421.825 198.233,420.481C197.561,419.136 197.225,417.838 197.225,416.586C197.225,414.284 198.389,411.909 200.719,409.46C201.269,408.881 203.48,408.799 203.262,407.802C202.685,405.149 195.661,405.703 195.661,405.703C195.661,405.703 196.833,403.103 198.029,402.996C201.931,402.648 203.53,404.008 205.519,405.81C207.052,405.94 208.392,403.56 208.853,403.315C211.946,401.667 214.368,400.843 216.117,400.843C217.038,400.843 217.903,401.146 218.713,401.754C219.523,402.362 220.159,403.034 220.619,403.77C221.079,404.507 221.309,405.078 221.309,405.483C221.309,406.072 220.914,406.785 220.122,407.623C219.33,408.461 218.46,409.221 217.512,409.902C216.563,410.583 215.96,410.924 215.703,410.924C215.592,410.924 215.537,410.85 215.537,410.703C215.537,410.482 216.071,409.838 217.139,408.77C217.728,408.18 218.023,407.692 218.023,407.306C218.023,407.066 217.912,406.947 217.691,406.947C217.323,406.947 214.887,405.685 213.377,406.311C211.867,406.937 210.247,407.775 208.516,408.825C206.785,409.874 205.22,411.099 203.82,412.498C202.771,413.585 201.979,414.717 201.445,415.896C200.911,417.074 202.141,419.541 202.141,420.149C202.141,421.015 202.647,421.447 203.66,421.447C204.249,421.447 205.165,421.199 206.408,420.701C207.651,420.204 208.959,419.532 210.33,418.685C211.702,417.838 212.858,416.945 213.797,416.006C215.785,414.036 217.171,412.751 217.954,412.153C218.736,411.555 219.44,411.255 220.067,411.255C220.508,411.255 220.881,411.37 221.185,411.601C221.489,411.831 221.641,412.13 221.641,412.498C221.641,412.627 221.079,413.594 219.956,415.398C216.807,420.554 214.492,424.311 213.01,426.667C211.527,429.024 210.146,431.11 208.867,432.923C207.587,434.737 206.362,436.169 205.193,437.218C204.024,438.268 202.988,438.793 202.086,438.793C201.552,438.793 201.285,438.434 201.285,437.716C201.285,437.126 201.658,436.104 202.403,434.65C203.149,433.195 204.074,432.486 205.179,432.523C207.37,429.448 209.129,426.902 210.455,424.886C211.78,422.87 213.235,420.628 214.819,418.16Z" style="fill:white;fill-rule:nonzero;"/></g></g></g></svg>';
	allData.push(s3);
	var s4 = new Object();
	s4.symbolId = "s4";
	s4.offset = {x:0, y:0};
	s4.svg = '<svg width="100%" height="100%" viewBox="0 0 19 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g transform="matrix(1,0,0,1,-8.93294,-4.34548)"><g transform="matrix(1.44444,0,0,1.44444,-8,-8)"><g id="s4" transform="matrix(-0.345843,0.586149,-0.444394,-0.262204,402.426,-440.001)"><path d="M877.194,179.226L877.194,180.421C877.194,180.913 877.097,181.224 876.904,181.353C876.711,181.481 876.002,181.827 874.777,182.39C873.552,182.952 872.378,183.614 871.253,184.376C871.686,183.743 872.082,183.274 872.439,182.97C872.797,182.665 873.28,182.284 873.889,181.827C873.362,181.616 872.63,181.511 871.692,181.511C870.239,181.511 868.672,181.798 866.99,182.372C865.308,182.946 863.879,183.632 862.701,184.429C861.523,185.226 860.934,185.894 860.934,186.433C860.934,186.714 861.113,186.945 861.47,187.127C861.828,187.309 862.402,187.449 863.193,187.549C863.984,187.648 864.971,187.716 866.155,187.751C867.339,187.786 868.798,187.804 870.532,187.804C871.798,187.804 872.612,187.851 872.975,187.944C873.339,188.038 873.52,188.255 873.52,188.595C873.52,189.028 873.306,189.523 872.879,190.08C872.451,190.637 871.885,190.968 871.182,191.073C870.092,191.249 869.225,191.398 868.581,191.521C867.936,191.645 867.172,191.853 866.287,192.145C865.402,192.438 864.421,192.86 863.342,193.411C861.737,194.255 860.483,195.11 859.581,195.978C858.678,196.845 858.227,197.612 858.227,198.28C858.227,198.854 858.55,199.303 859.194,199.625C859.839,199.947 860.764,200.108 861.971,200.108C866.132,200.108 870.368,198.239 874.68,194.501C874.704,195.649 874.578,196.66 874.302,197.533C874.027,198.406 873.467,199.241 872.624,200.038C871.921,200.706 870.892,201.345 869.539,201.954C868.185,202.563 866.709,203.05 865.109,203.413C863.509,203.776 862.007,203.958 860.6,203.958C858.971,203.958 857.624,203.568 856.557,202.789C855.491,202.01 854.958,200.976 854.958,199.687C854.958,198.749 855.216,197.817 855.731,196.892C856.247,195.966 857.038,195.078 858.104,194.228C859.171,193.379 860.521,192.608 862.156,191.917C863.791,191.226 865.675,190.681 867.807,190.282C868.112,190.224 868.264,190.13 868.264,190.001C868.264,189.86 868.086,189.775 867.728,189.746C867.371,189.717 866.715,189.696 865.759,189.685C864.804,189.673 863.964,189.632 863.237,189.562C862.51,189.491 861.743,189.339 860.934,189.104C860.102,188.847 859.461,188.395 859.009,187.751C858.558,187.106 858.333,186.392 858.333,185.606C858.333,184.599 858.696,183.585 859.423,182.565C860.149,181.546 861.175,180.626 862.499,179.806C863.823,178.985 865.425,178.326 867.306,177.828C869.187,177.33 871.247,177.081 873.485,177.081C874.774,177.081 875.674,177.154 876.183,177.301C876.693,177.447 876.989,177.641 877.071,177.881C877.153,178.121 877.194,178.569 877.194,179.226Z" style="fill:white;fill-rule:nonzero;"/></g></g></g></svg>';
	allData.push(s4);
	var s5 = new Object();
	s5.symbolId = "s5";
	s5.offset = {x:0, y:0};
	s5.svg = '<svg width="100%" height="100%" viewBox="0 0 25 27" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g transform="matrix(1,0,0,1,-5.75684,-4.53211)"><g transform="matrix(1.44444,0,0,1.44444,-8,-8)"><g id="s5" transform="matrix(-0.692308,-0.36674,1.02266e-16,-0.835066,412.983,438.462)"><path d="M567.973,250.842L568.729,250.842C570.194,248.651 571.453,246.875 572.508,245.516C573.656,244.051 574.664,242.823 575.531,241.833C576.399,240.843 577.216,239.985 577.984,239.258C578.751,238.531 579.431,237.995 580.023,237.65C580.614,237.304 581.133,237.131 581.578,237.131C581.965,237.131 582.261,237.26 582.466,237.518C582.671,237.776 582.774,238.151 582.774,238.643C582.774,239.346 582.507,240.28 581.974,241.446C581.441,242.612 580.483,244.508 579.1,247.133L579.645,247.713C578.813,248.756 577.995,249.591 577.193,250.218C576.39,250.845 575.848,251.158 575.567,251.158C575.262,251.158 575.11,250.883 575.11,250.332C575.11,249.887 575.277,249.222 575.611,248.337C575.945,247.452 576.375,246.582 576.903,245.727C577.43,244.871 577.919,244.077 578.37,243.345C578.822,242.612 579.147,242.053 579.346,241.666C579.545,241.279 579.645,241.004 579.645,240.84C579.645,240.641 579.557,240.541 579.381,240.541C578.994,240.541 578.192,241.25 576.973,242.668C576.563,243.16 576.147,243.655 575.725,244.154C575.303,244.652 574.691,245.416 573.888,246.447C573.085,247.479 572.488,248.258 572.095,248.785C571.702,249.313 571.172,250.057 570.504,251.018C571.559,251.123 577.721,252.694 578.295,252.928C578.869,253.163 579.156,253.438 579.156,253.755C579.156,254.048 578.951,254.194 578.541,254.194C578.506,254.194 578.063,254.13 577.214,254.001C576.364,253.872 570.223,252.401 569.485,252.389L567.428,255.447C568.612,255.565 569.763,255.74 570.882,255.975C572.001,256.209 573.044,256.458 574.011,256.722C574.978,256.986 575.986,257.261 577.034,257.548C578.083,257.835 579,258.049 579.785,258.19C578.098,260.463 576.838,261.6 576.006,261.6C575.584,261.6 574.864,261.48 573.844,261.239C572.824,260.999 571.723,260.73 570.539,260.431C569.356,260.132 568.222,259.886 567.138,259.693C566.054,259.499 565.049,259.403 564.123,259.403C563.467,259.403 562.899,259.479 562.418,259.631C561.938,259.783 561.302,260.018 560.511,260.334C559.72,260.651 559.184,260.809 558.903,260.809C558.492,260.809 558.287,260.58 558.287,260.123C558.287,259.912 558.516,259.449 558.973,258.735C559.383,258.078 559.79,257.53 560.195,257.091C560.599,256.652 561.03,256.315 561.487,256.08C561.944,255.846 562.5,255.676 563.156,255.571C563.813,255.465 564.615,255.412 565.565,255.412L567.551,252.424C566.754,252.436 565.969,252.512 565.196,252.653C564.422,252.793 564.065,252.863 564.123,252.863C563.865,252.863 563.737,252.74 563.737,252.494C563.737,252.319 563.813,252.116 563.965,251.888C564.117,251.659 564.328,251.469 564.598,251.317C565.16,251 566.285,250.842 567.973,250.842Z" style="fill:white;fill-rule:nonzero;"/></g></g></g></svg>';
	allData.push(s5);
	var s6 = new Object();
	s6.symbolId = "s6";
	s6.offset = {x:0, y:0};
	s6.svg = '<svg width="100%" height="100%" viewBox="0 0 21 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g transform="matrix(1,0,0,1,-7.36614,-6.01407)"><g transform="matrix(1.44444,0,0,1.44444,-8,-8)"><g id="s6" transform="matrix(1.38903,0.684549,-0.471094,0.575156,-800.287,-535.871)"><path d="M658.838,190.876C658.862,191.26 658.82,191.638 658.712,192.01C658.604,192.382 658.49,192.724 658.37,193.036C658.202,193.444 657.938,193.804 657.578,194.116C657.218,194.428 656.894,194.728 656.606,195.016C656.51,195.112 656.306,195.28 655.994,195.52C655.682,195.76 655.328,196.024 654.932,196.312C654.536,196.6 654.122,196.894 653.69,197.194C653.258,197.494 652.862,197.77 652.502,198.022C652.142,198.274 651.848,198.49 651.62,198.67C651.392,198.85 651.278,198.94 651.278,198.94L651.278,177.304C650.87,177.712 650.576,178.018 650.396,178.222C650.216,178.426 650.042,178.6 649.874,178.744C649.706,178.888 649.496,179.044 649.244,179.212C648.992,179.38 648.602,179.644 648.074,180.004C648.698,179.236 649.184,178.6 649.532,178.096C649.88,177.592 650.168,177.094 650.396,176.602C650.624,176.11 650.84,175.576 651.044,175C651.248,174.424 651.518,173.668 651.854,172.732C652.166,173.644 652.418,174.388 652.61,174.964C652.802,175.54 652.306,176.097 652.214,177.268L652.214,189.184C652.55,188.872 652.856,188.62 653.132,188.428C653.408,188.236 653.684,188.086 653.96,187.978C654.236,187.87 654.524,187.792 654.824,187.744C655.124,187.696 655.466,187.672 655.85,187.672C656.306,187.672 656.714,187.768 657.074,187.96C657.434,188.152 657.74,188.404 657.992,188.716C658.244,189.028 658.442,189.376 658.586,189.76C658.73,190.144 658.814,190.516 658.838,190.876ZM655.634,192.964C655.754,192.412 655.784,191.872 655.724,191.344C655.664,190.816 655.466,190.36 655.13,189.976C655.01,189.832 654.842,189.712 654.626,189.616C654.41,189.52 654.188,189.472 653.96,189.472C653.732,189.472 653.498,189.544 653.258,189.688C653.018,189.832 652.802,190.084 652.61,190.444C652.37,190.9 652.244,191.47 652.232,192.154C652.22,192.838 652.214,193.456 652.214,194.008L652.214,197.104C652.214,197.104 652.286,197.05 652.43,196.942C652.574,196.834 652.748,196.69 652.952,196.51C653.156,196.33 653.372,196.132 653.6,195.916C653.828,195.7 654.038,195.508 654.23,195.34C654.542,195.028 654.818,194.692 655.058,194.332C655.298,193.972 655.49,193.516 655.634,192.964Z" style="fill:white;fill-rule:nonzero;"/></g></g></g></svg>';
	allData.push(s6);
	var s7 = new Object();
	s7.symbolId = "s7";
	s7.offset = {x:0, y:0};
	s7.svg = '<svg width="100%" height="100%" viewBox="0 0 22 27" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g transform="matrix(1,0,0,1,-6.62389,-4.54588)"><g transform="matrix(1.44444,0,0,1.44444,-8,-8)"><g id="s7" transform="matrix(0.670898,-0.57729,0.536209,0.5075,-611.203,392.176)"><path d="M798.32,177.1C798.609,177.04 798.915,176.954 799.238,176.844C799.622,176.712 800.019,176.534 800.428,176.309C800.692,176.146 800.999,175.932 801.348,175.666C801.697,175.401 802.053,175.063 802.414,174.654C802.776,174.245 803.126,173.769 803.464,173.226C803.802,172.684 804.116,172.074 804.407,171.398C804.698,170.639 804.923,169.819 805.083,168.937C805.242,168.055 805.323,167.244 805.326,166.505C805.33,165.643 805.255,164.729 805.103,163.764C804.951,162.798 804.708,161.956 804.375,161.236L809.614,165.302C810.303,166.906 805.862,164.526 805.903,166.415C805.924,167.011 805.904,167.621 805.841,168.247C805.779,168.873 805.686,169.504 805.564,170.14C805.515,170.448 805.423,170.837 805.289,171.309C805.156,171.781 804.98,172.278 804.762,172.8C804.543,173.323 804.301,173.846 804.035,174.368C803.769,174.891 803.491,175.367 803.202,175.797C802.502,176.8 801.802,177.706 801.103,178.514C800.483,179.231 799.9,179.912 799.355,180.557C799.324,180.605 799.29,180.651 799.255,180.696C799.148,180.829 799.037,180.958 798.922,181.083C798.48,181.648 798.073,182.281 797.701,182.981C797.354,183.634 797.145,184.269 797.073,184.884C797.23,185.132 797.419,185.38 797.64,185.628C797.896,185.916 798.152,186.192 798.409,186.456C798.665,186.72 798.896,186.936 799.101,187.104L798.229,187.392C797.819,187.104 797.426,186.828 797.05,186.564C796.708,186.348 796.367,186.126 796.025,185.898C795.683,185.67 795.427,185.472 795.256,185.304C794.675,184.824 794.154,184.296 793.692,183.72C793.231,183.144 793,182.652 793,182.244C793,181.62 793.154,181.116 793.461,180.732C793.769,180.348 794.102,180 794.461,179.688C794.82,179.376 795.153,179.052 795.461,178.716C795.768,178.38 795.922,177.948 795.922,177.42C795.922,177.036 795.768,176.682 795.461,176.358C795.153,176.034 794.82,175.704 794.461,175.368C794.102,175.032 793.769,174.684 793.461,174.324C793.154,173.964 793,173.556 793,173.1C793,172.476 793.154,171.972 793.461,171.588C793.769,171.204 794.102,170.856 794.461,170.544C794.82,170.232 795.153,169.908 795.461,169.572C795.768,169.236 795.922,168.804 795.922,168.276C795.922,167.724 795.683,167.22 795.204,166.764C794.726,166.308 794.299,165.852 793.923,165.396L794.641,165.216C794.982,165.456 795.324,165.684 795.666,165.9L797.255,167.016C797.836,167.496 798.392,168.012 798.921,168.564C799.451,169.116 799.716,169.596 799.716,170.004C799.716,170.652 799.562,171.168 799.255,171.552C798.947,171.936 798.605,172.284 798.229,172.596C797.853,172.908 797.512,173.232 797.204,173.568C796.896,173.904 796.743,174.336 796.743,174.864C796.743,175.32 796.896,175.716 797.204,176.052C797.512,176.388 797.853,176.712 798.229,177.024C798.26,177.049 798.29,177.075 798.32,177.1Z" style="fill:white;"/></g></g></g></svg>';
	allData.push(s7);
	var s8 = new Object();
	s8.symbolId = "s8";
	s8.offset = {x:0, y:0};
	s8.svg = '<svg width="100%" height="100%" viewBox="0 0 17 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g transform="matrix(1,0,0,1,-10.1432,-4.16641)"><g transform="matrix(1.44444,0,0,1.44444,-8,-8)"><g id="s8" transform="matrix(1.35123,0,-0.0934865,0.672945,12.4279,15.3758)"><path d="M0.54,-10.332C0.54,-9.444 0.756,-8.52 1.188,-7.56C1.62,-6.6 2.1,-5.748 2.628,-5.004C3.228,-4.164 3.876,-3.27 4.572,-2.322C5.268,-1.374 5.964,-0.312 6.66,0.864C6.948,1.368 7.224,1.926 7.488,2.538C7.752,3.15 7.992,3.762 8.208,4.374C8.424,4.986 8.598,5.568 8.73,6.12C8.862,6.672 8.952,7.128 9,7.488C9.12,8.232 9.21,8.97 9.27,9.702C9.33,10.434 9.348,11.148 9.324,11.844C9.276,14.052 8.904,16.092 8.208,17.964L7.776,17.892C8.112,17.052 8.358,16.068 8.514,14.94C8.67,13.812 8.748,12.744 8.748,11.736C8.748,10.872 8.67,9.924 8.514,8.892C8.358,7.86 8.136,6.9 7.848,6.012C7.56,5.22 7.248,4.506 6.912,3.87C6.576,3.234 6.228,2.676 5.868,2.196C5.508,1.716 5.154,1.32 4.806,1.008C4.458,0.696 4.152,0.444 3.888,0.252C3.48,-0.012 3.084,-0.222 2.7,-0.378C2.316,-0.534 1.956,-0.648 1.62,-0.72C1.236,-0.816 0.876,-0.876 0.54,-0.9L0.036,-0.9L0.036,-10.332L0.54,-10.332Z" style="fill:white;fill-rule:nonzero;"/></g></g></g></svg>';
	allData.push(s8);
	var s9 = new Object();
	s9.symbolId = "s9";
	s9.offset = {x:0, y:0};
	s9.svg = '<svg width="100%" height="100%" viewBox="0 0 26 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g transform="matrix(1,0,0,1,-5.37567,-9.26489)"><g transform="matrix(1.44444,0,0,1.44444,-8,-8)"><g id="s9" transform="matrix(-0.394616,0.600755,0.367179,0.433288,181.147,-433.57)"><path d="M612.372,208.028L612.372,209.171C610.403,211.362 608.596,213.17 606.949,214.594C605.303,216.018 603.694,217.113 602.124,217.881C600.554,218.648 599.036,219.032 597.571,219.032C596.305,219.032 595.219,218.78 594.31,218.276C593.402,217.772 592.717,217.037 592.254,216.07C591.791,215.104 591.559,213.958 591.559,212.634C591.559,211.591 591.726,210.486 592.06,209.32C592.394,208.154 592.878,206.977 593.511,205.787C594.143,204.598 594.92,203.37 595.84,202.105C596.76,200.839 597.841,199.509 599.083,198.114C600.372,196.673 601.643,195.428 602.897,194.379C604.151,193.33 605.288,192.507 606.307,191.909C607.327,191.312 608.273,190.866 609.146,190.573C610.019,190.28 610.743,190.134 611.317,190.134C611.903,190.134 612.401,190.274 612.811,190.556C613.221,190.837 613.538,191.247 613.761,191.786C613.983,192.325 614.095,192.946 614.095,193.649C614.095,194.974 613.643,196.447 612.741,198.07C611.839,199.693 610.714,201.261 609.366,202.772C608.018,204.284 606.732,205.518 605.508,206.473C604.283,207.428 603.401,207.905 602.862,207.905C602.499,207.905 602.162,207.762 601.851,207.475C601.541,207.188 601.386,206.862 601.386,206.499C601.386,205.831 601.74,205.022 602.449,204.073C603.158,203.124 603.931,202.254 604.769,201.463C605.607,200.672 606.108,200.276 606.272,200.276C606.354,200.276 606.395,200.312 606.395,200.382C606.395,200.487 606.334,200.669 606.211,200.927C606.088,201.185 606.026,201.343 606.026,201.401C606.026,201.495 606.061,201.542 606.132,201.542C606.331,201.542 606.905,201.009 607.854,199.942C608.804,198.876 609.674,197.701 610.465,196.418C611.256,195.135 611.651,194.083 611.651,193.263C611.651,192.923 611.578,192.662 611.431,192.481C611.285,192.299 611.065,192.208 610.772,192.208C609.952,192.208 608.707,192.873 607.037,194.203C605.367,195.533 603.656,197.227 601.904,199.283C600.152,201.34 598.69,203.464 597.518,205.655C596.346,207.847 595.761,209.774 595.761,211.439C595.761,212.399 595.904,213.202 596.191,213.847C596.478,214.491 596.9,214.989 597.457,215.341C598.013,215.692 598.684,215.868 599.47,215.868C601.169,215.868 603.096,215.206 605.253,213.882C607.409,212.558 609.782,210.606 612.372,208.028Z" style="fill:white;fill-rule:nonzero;"/></g></g></g></svg>';
	allData.push(s9);	
	return(allData[aSymbolId]);	
}*/

