/*=================================================================================================
-- GLOBAL VARIABLES
	Variables that are declared outside of a function or method are called Global variables. They
	exist in the page from the moment they are declared, and can be accessed by any script running
	in the page.
-------------------------------------------------------------------------------------------------*/
//gameEngine will store an instance of the CodeBreaker class
var gameEngine;
/*===============================================================================================*/

/*=================================================================================================
-- ONLOAD LISTENER
	The various game classes and scripts cannot run until after the page has completed loading.
	The onload event (whose event type is "load") is dispatched by the window object when the page
	has completed loading, and so is a good event to use for triggering the game initialisation
	and start-up scripts. This listener calls the initialiseGame function.
-------------------------------------------------------------------------------------------------*/
window.addEventListener("load", initialiseGame, false);
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: initialiseGame():Void
	This function initialises the game. The game won't work until this function has been called.
-------------------------------------------------------------------------------------------------*/
function initialiseGame() {
	//Assign an instance of the CodeBreaker class to the gameEngine global variable
	gameEngine = new com.flametreepublishing.cfk.CodeBreaker();
	//Show the game setup panel
	showGameSetupPanel();
}
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: showGameSetupPanel():Void
	This function displays the game setup panel and hides any other panels / elements that are not
	required when the game setup panel is visible.
-------------------------------------------------------------------------------------------------*/
function showGameSetupPanel() {
	//The game over panel will be on screen if a previous game was played, so hide it
	document.getElementById("gameOverPanel").style.display = "none";
	//The "Setup New Game" button is always present in the game screen's left-hand panel. If it
	//were clicked whilst the game setup panel is already on screen then it could cause
	//bugs or unexpected behaviour. To avoid this we'll hide it
	document.getElementById("setupNewGameButton").style.display = "none";
	//Make the game setup panel visible
	document.getElementById("gameSetupPanel").style.display = "block";	
}
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: startGame():Void
	This function starts a new game based on the settings entered into the game setup panel
-------------------------------------------------------------------------------------------------*/
function startGame() {
	//The only place this function can be called from is the game setup panel, which needs to be
	//hidden before the game starts
	document.getElementById("gameSetupPanel").style.display = "none";
	//The "Setup New Game" button is hidden when the game setup panel is visible, so now the panel
	//has been hidden again we can re-show the button
	document.getElementById("setupNewGameButton").style.display = "inline";
	//Gather the values chosen in the game setup panel's <select> elements and store them in
	//variables for convenience
	var numSymbols = document.getElementById("numSymbolsOption").value;
	var codeLength = document.getElementById("codeLengthOption").value;
	var maxGuesses = document.getElementById("maxGuessesOption").value;
	//Call the gameEngine's startNewGame() method, passing in the game setup options
	gameEngine.startNewGame(numSymbols, codeLength, maxGuesses);
}
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: cycleCodeButton(eventObj:Event):Void
	This function is an event handler that's triggered when an input code button is clicked. It
	changes the symbol shown in the clicked input button. A left click will select the next
	symbol; a right click will select the previous symbol.
	
	The event listener that calls this function passes an object containing information about the
	event. We capture this obect as the eventObj parameter.
-------------------------------------------------------------------------------------------------*/
function cycleCodeButton(eventObj) {
	//Check that there is a game in progress by calling the gameEngine's getGameStatus() method
	if (gameEngine.getGameStatus() == "inProgress") {
		//Get a refernce to the input code button that was clicked
		var codeButtonElement = eventObj.currentTarget;
		//Declare a variable that will define whether to cycle the button forward or backward
		var cycleDirection;
		//Check the type of the event
		if (eventObj.type == "click") {
			//A left-click generates a "click" event - this means cycleDirection needs to be
			//"forward"
			cycleDirection = "forward"
		} else {
			//We don't need to test specifically for an event of type "contextmenu", which is the
			//event type generated by a right click - we can simply assume that if the click was
			//not a left click then it must have been a right click. However, the default action
			//of a right click is to open a context menu (hence the name of the event), but we
			//want to prevent that - calling the event object's preventDefault() method is one
			//step in preventing the context menu from being shown
			eventObj.preventDefault();
			//A right click means we want to cycle the input code symbol backwards
			cycleDirection = "backward"
		}
		//Determine which of the input code buttons was clicked by looking up the value of
		//the element's codeButtonNum attribute, which was added when the button was created
		var buttonNum = Number(codeButtonElement.getAttribute("codeButtonNum"));
		//Determine the symbol ID of the clicked button by looking up the value of the element's
		//symbolId attribute
		var currentSymbolId = codeButtonElement.getAttribute("symbolId");
		//Call the gameEngine's cycleInputCodeButton() method, passing the button number, symbol ID
		//and cycle direction as arguments
		gameEngine.cycleInputCodeButton(buttonNum, currentSymbolId, cycleDirection);
	}
	//Return a value of false; this assists in preventing the a context menu appearing if the
	//click was a right click
	return(false);
}
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: submitInputCode(eventObj:Event):Void
	This function is called by the event listener that listens for clicks on the 'Submit' button.
	The function handles the actions that need to be taken in response to an input code being
	submitted for testing against the hidden code.
	
	The event listener that calls this function passes an object containing information about the
	event. We capture this obect as the eventObj parameter.
-------------------------------------------------------------------------------------------------*/
function submitInputCode(eventObj) {
	//Check that there is a game in progress
	if (gameEngine.getGameStatus() == "inProgress") {
		//Get an array of all of the input code button elements using the getElementsByClassName()
		//method of the document object. This method returns an array containing references to all
		//elements that have the specified CSS style class name.
		var inputCodeButtons = document.getElementsByClassName("inputCodeButton");
		//Declare a new array in which to store that actual input code
		var inputCode = new Array();
		//Loop through the array of input code buttons, extracting the symbol IDs and storing them
		//in the inputCode array
		for (var i = 0; i < inputCodeButtons.length; i++) {
			inputCode.push(inputCodeButtons[i].getAttribute("symbolId"));
		}
		//Call the gameEngine's tryCode() method and store the result in the codeResult variable.
		//This result will be an array that indicates if any of the input code buttons matched
		//to any symbols in the hidden code
		var codeResult = gameEngine.tryCode(inputCode);
		//The gameEngine's displayResult() method will add a line at the top of the results list
		//showing the input code color-coded to show its accuract
		gameEngine.displayResult(inputCode, codeResult);
		//Get the game's current status
		var gameStatus = gameEngine.getGameStatus();
		//Check the value returned by the call to getGameStatus()
		if (gameStatus == "won" || gameStatus == "lost") {
			//If gameStatus is "won" or "lost" then we know the game has finished as a result of
			//submitting the input code (either the code was guessed correctly, or the maximum
			//guess count was exceeded). Either way, calling the reportGameOver() function will
			//display the game over panel
			reportGameOver(gameStatus);
		}
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: reportGameOver(gameStatus:String):Void
	This function updates the text in within the game over panel, and displays the panel on screen.
	If is passed a string that indicates whether the game was won or lost, and this is captured
	as the gameStatus parameter
-------------------------------------------------------------------------------------------------*/
function reportGameOver(gameStatus) {
	//Get a reference to the gameOverPanel element
	var gameOverPanel = document.getElementById("gameOverPanel");
	//Get a reference to the message element within the gameOverPanel
	var messageElement = document.getElementById("gameOverMessage");
	//Ask the gameEngine to calculate the total number of possible code combinations that existed
	//in the game
	var numberOfPossibleCodes = gameEngine.getNumberOfPossibleCodes();
	//Get the number of guesses that the player has taken
	var currentGuessCount = gameEngine.getCurrentGuessCount();
	//Check the value of the gameStatus parameter
	if (gameStatus == "won") {
		//The game was won - generate a suitable message
		var messageText = "Success!<br><br>There were " + numberOfPossibleCodes.toLocaleString() + " possible combinations for the hidden code, and you cracked it in " + currentGuessCount + " tries.";
	} else {
		//The game was lost - generate a suitabl message
		var messageText = "You failed to crack the code!<br><br>There were " + numberOfPossibleCodes + " possible combinations for the hidden code.";
	}
	//Assign the generated message as the HTML content of the messageElement element
	messageElement.innerHTML = messageText;
	//Display the gameOverPanel
	gameOverPanel.style.display = "block";
}
/*===============================================================================================*/