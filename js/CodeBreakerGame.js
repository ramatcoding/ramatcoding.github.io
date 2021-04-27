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
com.flametreepublishing.cfk.CodeBreakerGame = function(aNumSymbols, aCodeLength, aMaxGuesses) {
	if (aNumSymbols == null) {
		this.numSymbols = 6;
	} else if (aNumSymbols < 6) {
		this.numSymbols = 6;
	} else if (aNumSymbols > 10) {
		this.numSymbols = 10;
	} else {
		this.numSymbols = aNumSymbols;
	}
	if (aCodeLength == null) {
		this.codeLength = 4;
	} else if (aCodeLength < 4) {
		this.codeLength = 4;
	} else if (aCodeLength > 8) {
		this.codeLength = 8;
	} else {
		this.codeLength = aCodeLength
	}
	if (aMaxGuesses == null) {
		this.maxAttempts = 10;
	} else if (aMaxGuesses < 8) {
		this.maxAttempts = 8;
	} else if (aMaxGuesses > 12) {
		this.maxAttempts = 12;
	} else {
		this.maxAttempts = aMaxGuesses;
	}
	this.codeSymbolIds = this.chooseCodeSymbolIdsForGame();
	this.hiddenCode = this.buildHiddenCode();
	this.guesses = new Array();
}
/*===============================================================================================*/

/***************************************************************************************************************************************
															PUBLIC METHODS
***************************************************************************************************************************************/

/*=================================================================================================
-- METHOD: getNextSymbolID(aSymbolId:String):String
-------------------------------------------------------------------------------------------------*/

com.flametreepublishing.cfk.CodeBreakerGame.prototype.getNextSymbolId = function(aSymbolId) {
	var theResult;
	for (var i = 0; i < this.codeSymbolIds.length; i++) {
		if (this.codeSymbolIds[i] == aSymbolId) {
			if (i == this.codeSymbolIds.length -1) {
				theResult = this.codeSymbolIds[0];
			} else {
				theResult = this.codeSymbolIds[(i+1)];
			}
			break;
		}
	}
	return(theResult);
}

/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getPreviousSymbolID(aSymbolId:String):String
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreakerGame.prototype.getPreviousSymbolId = function(aSymbolId) {
	var theResult;
	for (var i = 0; i< this.codeSymbolIds.length; i++) {
		if (this.codeSymbolIds[i] == aSymbolId) {
			if (i == 0){
				theResult = this.codeSymbolIds[(this.codeSymbolIds.length -1)];
			} else{
				theResult = this.codeSymbolIds[(i -1)];
			}
		}
	}
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: tryCode(inputCode:Array):Array
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreakerGame.prototype.tryCode = function(inputCode) {
	this.guesses.push(inputCode);
	var theResult = new Array();
	var hiddenCodeCopy = this.hiddenCode.slice(0);
	//look for identical position matches
	for (var i = 0; i < inputCode.length; i++) {
		if (inputCode[i] == hiddenCodeCopy[i]) {
			theResult[i] = 2;
			hiddenCodeCopy[i] = "matched"
		}
	}
	//look for different position matches,
	for (var i = 0; i < inputCode.length; i++) {
		if (theResult[i] == undefined) {
			var inputSymbol = inputCode[i];
			var matches = new Array();
			for (var j = 0; j < hiddenCodeCopy.length; j++) {
				if (hiddenCodeCopy[j] == inputSymbol) {
					matches.push(j);
				}
			}
			if (matches.length == 0) {
				theResult[i] = 0;
			} else {
				theResult[i] = 1;
				hiddenCodeCopy[(matches[0])] = "matched";
			}
		}
	}	
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getGameStatus():String
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreakerGame.prototype.getGameStatus = function() {
	var theResult;
	var codeCracked = this.isCodeCracked();
	if (codeCracked && this.guesses.length <= this.maxAttempts) {
		theResult = "won";
	} else if (this.guesses.length >= this.maxAttempts) {
		theResult = "lost"
	} else {
		theResult = "inProgress";
	}
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getCodeSymbolIdsForGame():Array
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreakerGame.prototype.chooseCodeSymbolIdsForGame = function() {
	var theResult = new Array();
	var unselectedIds = new Array("s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9");
	if (this.numSymbols == 10) {
		theResult = unselectedIds;
	} else {
		for (var i = 0; i < this.numSymbols; i++) {
			var randIndex = Math.floor(Math.random() * unselectedIds.length);
			theResult.push(unselectedIds[randIndex]);
			unselectedIds.splice(randIndex, 1);
		}
	}
	theResult.sort();
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: buildHiddenCode():Array
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreakerGame.prototype.buildHiddenCode = function() {
	var theResult = new Array();
	for (var i = 0; i < this.codeLength; i++) {
		var randIndex = Math.floor(Math.random() * this.codeSymbolIds.length);
		theResult.push(this.codeSymbolIds[randIndex]);
	}
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: isCodeCracked():Boolean
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreakerGame.prototype.isCodeCracked = function() {
	var theResult = true;
	if (this.guesses.length == 0) {
		theResult = false;
	} else {
		var lastGuess = this.guesses[(this.guesses.length -1)];
		for (var i = 0; i < this.codeLength; i++) {
			if (this.hiddenCode[i] != lastGuess[i]) {
				theResult = false;
				break;
			}
		}
	}
	return(theResult);
}
/*===============================================================================================*/