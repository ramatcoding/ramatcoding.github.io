/*=================================================================================================
	For notes and explanations on this class and its methods, see the version of the class
	contained in the "Exercise17\complete\" folder
=================================================================================================*/

/*=================================================================================================
-- NAMESPACE INITIALISATION
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
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker = function() {
	this.codeSymbolFactory = new com.flametreepublishing.cfk.CodeSymbolFactory();
	this.currentGame = null;
	
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: startNewGame(numSymbols, codeLength, maxGuesses):Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.startNewGame = function(numSymbols, codeLength, maxGuesses) {
	if (this.currentGame) {
		this.clearCurrentGame();
	}
	this.currentGame = new com.flametreepublishing.cfk.CodeBreakerGame(Number(numSymbols), Number(codeLength), Number(maxGuesses));
	this.buildSymbolsInGamePanel();
	this.buildInputButtons();
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: clearCurrentGame():Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.clearCurrentGame = function() {
	if (this.currentGame == null) {
		return;
	}
	var inputCodeButtonsEl = document.getElementById("inputCodeButtons");
	while (inputCodeButtonsEl.hasChildNodes()) {
		inputCodeButtonsEl.removeChild(inputCodeButtonsEl.childNodes[0]);
	}
	var resultsTBodyEl = document.querySelectorAll("#resultsTable tbody")[0];
	while (resultsTBodyEl.hasChildNodes()) {
		resultsTBodyEl.removeChild(resultsTBodyEl.childNodes[0]);
	}
	var currentSymbolsDisplayEl = document.getElementById("currentSymbolsDisplay");
	while (currentSymbolsDisplayEl.hasChildNodes()) {
		currentSymbolsDisplayEl.removeChild(currentSymbolsDisplayEl.childNodes[0]);
	}
	this.currentGame = null;
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: buildSymbolsInGamePanel():Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.buildSymbolsInGamePanel = function() {
	var currentSymbolsTableEl = document.createElement("table");
	currentSymbolsTableEl.id = "currentSymbolsTable";
	var tbodyEl = document.createElement("tbody");
	var maxRowLength = 8;
	var row1Length = maxRowLength;
	var row1El = document.createElement("tr");
	if (this.currentGame.numSymbols > maxRowLength) {
		var row2El = document.createElement("tr");
		var row1Length = Math.ceil(this.currentGame.codeSymbolIds.length / 2);
	}
	for (var i=0; i < this.currentGame.codeSymbolIds.length; i++) {
		var codeSymbol = this.codeSymbolFactory.newCodeSymbol(this.currentGame.codeSymbolIds[i], "blue");
		var codeSymbolEl = codeSymbol.getHtmlElement();
		var tdEl = document.createElement("td");
		tdEl.appendChild(codeSymbolEl);
		if (i < row1Length) {
			row1El.appendChild(tdEl);
		} else {
			row2El.appendChild(tdEl);
		}
	}
	tbodyEl.appendChild(row1El);
	if (row2El) {
		tbodyEl.appendChild(row2El);
	}
	currentSymbolsTableEl.appendChild(tbodyEl);
	document.getElementById("currentSymbolsDisplay").appendChild(currentSymbolsTableEl);	
}


/*=================================================================================================
-- METHOD: buildInputButtons():Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.buildInputButtons = function() {
	if (this.currentGame == null) {
		return;
	}
	var firstSymbolIdInGame = this.currentGame.codeSymbolIds[0];
	var inputCodeButtonsEl = document.getElementById("inputCodeButtons");
	var tableEl = document.createElement("table");
	var tbodyEl = document.createElement("tbody");
	var trEl = document.createElement("tr");
	var guessNumberTdEl = document.createElement("td");
	guessNumberTdEl.innerHTML = String(this.currentGame.guesses.length + 1) + ".";
	trEl.appendChild(guessNumberTdEl);	
	for (var i = 0; i < this.currentGame.codeLength; i++) {
		var codeSymbol = this.codeSymbolFactory.newCodeSymbol(firstSymbolIdInGame, "blue");
		var codeSymbolEl = codeSymbol.getHtmlElement();
		codeSymbolEl.setAttribute("codeButtonNum", String(i));
		codeSymbolEl.setAttribute("symbolId", codeSymbol.symbolId);
		codeSymbolEl.className = "inputCodeButton";
		codeSymbolEl.addEventListener("click", cycleCodeButton, false);
		codeSymbolEl.addEventListener("contextmenu", cycleCodeButton, false);
		var tdEl = document.createElement("td");
		tdEl.appendChild(codeSymbolEl);
		trEl.appendChild(tdEl);
	}
	var submitButtonEl = document.createElement("button");
	submitButtonEl.id = "submitInputCodeButton";
	submitButtonEl.innerHTML = "Submit";
	submitButtonEl.addEventListener("click", submitInputCode, false);
	var tdEl = document.createElement("td");
	tdEl.appendChild(submitButtonEl);
	trEl.appendChild(tdEl);
	tbodyEl.appendChild(trEl);
	tableEl.appendChild(tbodyEl);
	inputCodeButtonsEl.appendChild(tableEl);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: cycleInputCodeButton(buttonNum:Number, symbolId:String, cycleDirection:String):Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.cycleInputCodeButton = function(buttonNum, symbolId, cycleDirection) {
	var codeButtonEl = document.getElementsByClassName("inputCodeButton")[buttonNum];
	var newSymbolId;
	if (cycleDirection == "forward") {
		newSymbolId = this.currentGame.getNextSymbolId(symbolId);
	} else {
		newSymbolId = this.currentGame.getPreviousSymbolId(symbolId);
	}
	var newCodeSymbol = this.codeSymbolFactory.newCodeSymbol(newSymbolId, "blue");
	var newCodeButtonEl = newCodeSymbol.getHtmlElement();
	newCodeButtonEl.setAttribute("codeButtonNum", String(buttonNum));
	newCodeButtonEl.setAttribute("symbolId", newSymbolId);
	newCodeButtonEl.className = "inputCodeButton";
	newCodeButtonEl.addEventListener("click", cycleCodeButton, false);
	newCodeButtonEl.addEventListener("contextmenu", cycleCodeButton, false);
	codeButtonEl.parentNode.replaceChild(newCodeButtonEl, codeButtonEl);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: tryCode(inputCode:Array):Array
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.tryCode = function(inputCode) {
	if (this.currentGame != null) {
		var codeResult = this.currentGame.tryCode(inputCode);
		var guessNumTdEl = document.querySelectorAll("#inputCodeButtons td:first-child")[0];
		guessNumTdEl.innerHTML = String(this.currentGame.guesses.length + 1) + ".";
	}
	return(codeResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: displayResult(inputCode:Array, codeResult:Array):Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.displayResult = function(inputCode, codeResult) {
	var resultsTBodyEl = document.querySelectorAll("#resultsTable tbody")[0];
	var newResultEl = document.createElement("tr");
	var guessNumberTdEl = document.createElement("td");
	guessNumberTdEl.innerHTML = String(this.currentGame.guesses.length) + ".";
	newResultEl.appendChild(guessNumberTdEl);
	for (var i = 0; i < inputCode.length; i++) {
		var resultCodeSymbol;
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
		var resultCodeSymbolEl = resultCodeSymbol.getHtmlElement();
		var tdEl = document.createElement("td");
		tdEl.appendChild(resultCodeSymbolEl);
		newResultEl.appendChild(tdEl);		
	}
	resultsTBodyEl.insertBefore(newResultEl, resultsTBodyEl.childNodes[0]);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getGameStatus():String
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.getGameStatus = function() {
	var theResult;
	if (this.currentGame == null) {
		theResult = "noGame";
	} else {
		theResult = this.currentGame.getGameStatus();
	}
	return(theResult);	
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getNumberOfPossibleCodes():Number
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.getNumberOfPossibleCodes = function() {
	var theResult;
	if (this.currentGame == null) {
		theResult = 0;
	} else {
		theResult = Math.pow(this.currentGame.numSymbols, this.currentGame.codeLength);
	}
	return(theResult);
}

/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getCurrentGuessCount():Number
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreaker.prototype.getCurrentGuessCount = function() {
	var theResult;
	if (this.currentGame == null) {
		theResult = 0;
	} else {
		theResult = this.currentGame.guesses.length;
	}
	return(theResult);
}
/*===============================================================================================*/