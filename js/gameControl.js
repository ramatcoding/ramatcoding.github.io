/*=================================================================================================
	For notes and explanations on this script and its functions, see the version of the script
	contained in the "Exercise17\complete\" folder
=================================================================================================*/

/*=================================================================================================
-- GLOBAL VARIABLES
-------------------------------------------------------------------------------------------------*/
var gameEngine;
/*===============================================================================================*/

/*=================================================================================================
-- ONLOAD LISTENER
-------------------------------------------------------------------------------------------------*/
window.addEventListener("load", initialiseGame, false);
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: initialiseGame():Void
-------------------------------------------------------------------------------------------------*/
function initialiseGame() {
	gameEngine = new com.flametreepublishing.cfk.CodeBreaker();
	showGameSetupPanel();
}
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: showGameSetupPanel():Void
-------------------------------------------------------------------------------------------------*/
function showGameSetupPanel() {
	document.getElementById("gameOverPanel").style.display = "none";
	document.getElementById("setupNewGameButton").style.display = "none";
	document.getElementById("gameSetupPanel").style.display = "block";
}
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: startGame():Void
-------------------------------------------------------------------------------------------------*/
function startGame() {
	document.getElementById("gameSetupPanel").style.display = "none";
	document.getElementById("setupNewGameButton").style.display = "inline";
	var numSymbols = document.getElementById("numSymbolsOption").value;
	var codeLength = document.getElementById("codeLengthOption").value;
	var maxGuesses = document.getElementById("maxGuessesOption").value;
	gameEngine.startNewGame(numSymbols, codeLength, maxGuesses);
}
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: cycleCodeButton(eventObj:Event):Void
-------------------------------------------------------------------------------------------------*/
function cycleCodeButton(eventObj) {
	if (gameEngine.getGameStatus() == "inProgress") {
		var codeButtonElement = eventObj.currentTarget;
		var cycleDirection;
		if (eventObj.type == "click") {
			cycleDirection = "forward"
		} else {
			eventObj.preventDefault();
			cycleDirection = "backward"
		}
		var buttonNum = Number(codeButtonElement.getAttribute("codeButtonNum"));
		var currentSymbolId = codeButtonElement.getAttribute("symbolId");
		gameEngine.cycleInputCodeButton(buttonNum, currentSymbolId, cycleDirection);
	}
	return(false);
}
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: submitInputCode(eventObj:Event):Void
-------------------------------------------------------------------------------------------------*/
function submitInputCode(eventObj) {
	if (gameEngine.getGameStatus() == "inProgress") {
		var inputCodeButtons = document.getElementsByClassName("inputCodeButton");
		var inputCode = new Array();
		for (var i = 0; i < inputCodeButtons.length; i++) {
			inputCode.push(inputCodeButtons[i].getAttribute("symbolId"));
		}
		var codeResult = gameEngine.tryCode(inputCode);
		gameEngine.displayResult(inputCode, codeResult);
		var gameStatus = gameEngine.getGameStatus();
		if (gameStatus == "won" || gameStatus == "lost") {
			reportGameOver(gameStatus);
		}
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- FUNCTION: reportGameOver(gameStatus:String):Void
-------------------------------------------------------------------------------------------------*/
function reportGameOver(gameStatus) {
		var gameOverPanel = document.getElementById("gameOverPanel");
		var messageElement = document.getElementById("gameOverMeassge");
		var numberOfPossibleCodes = gameEngine.getNumberOfPossibleCodes();
		var currentGuessCount = gameEngine.getCurrentGuessCount();

		if (gameStatus == "won") {
			var messageText = "Success!<br><br>There were " + numberOfPossibleCodes.toLocaleString() + 
			" possible combinations for the hidden code, and you cracked it in " + currentGuessCount + " tries."
		} else {
			var messageText = "You failed to crack the code!<br><br>There were " + numberOfPossibleCodes +
			" possible combinations for the hidden code.";
		}
		messageElement.innerHTML = messageText;
		gameOverPanel.style.display = "block";
}







