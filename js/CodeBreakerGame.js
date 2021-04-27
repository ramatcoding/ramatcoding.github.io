/*=================================================================================================
-- CodeBreakerGame Class
	This class represents a single game of CodeBreaker
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
	This constructor creates a new instance of the CodeBreakerGame class. The call to the
	constructor should contain three arguments, captured as the following parameters:
		aNumSymbols is the number of code symbols to use in the game
		aCodeLength is the length of the hidden code
		aMaxGuesses is the maximum number of guesses allowed in the game
	
	Classes always have a 'constructor' method. This is the method that's called when a new
	instance of the class is created with the 'new' keyword.
	
	The 'this' keyword, that you see used througout this script, is a reference to the instance
	of the class that's handling the method or stores the property value - I.E. the object itself.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreakerGame = function(aNumSymbols, aCodeLength, aMaxGuesses) {
	//Check that aNumSymbols has been provided, and then set the CodeBreakerGame instance's
	//numSymbols property accordingly
	if (aNumSymbols == null) {
		//aNumSymbols is not provided, so default to 6 (minimum allowed)
		this.numSymbols = 6;
	} else if (aNumSymbols < 6) {
		//aNumSymbols is below the minimum allowed, so default to the minimum allowed
		this.numSymbols = 6;
	} else if (aNumSymbols > 10) {
		//aNumSymbols is higher than the maximum allowed, so default to the maximum allowed
		this.numSymbols = 10;
	} else {
		//aNumSymbols is valid so assign it to the numSymbols property
		this.numSymbols = aNumSymbols;
	}
	//Check that aCodeLength has been provided, and then set the CodeBreakerGame instance's
	//codeLength property accordingly
	if (aCodeLength == null) {
		//aCodeLength is not provided, so default to 4 (minimum allowed)
		this.codeLength = 4;
	} else if (aCodeLength < 4) {
		//aCodeLength is below the minimum allowed, so default to that minimum
		this.codeLength = 4;
	} else if (aCodeLength > 8) {
		//aCodeLength is larger than the maximum allowed, so default to that maximum
		this.codeLength = 8;
	} else {
		//aCodeLength is valid so assign it to the codeLength property
		this.codeLength = aCodeLength
	}
	//Check that aMaxGuesses has been provided, and then set the CodeBreakerGame instance's
	//maxGuesses property accordingly
	if (aMaxGuesses == null) {
		//aMaxGuesses is not provided, so default to 10
		this.maxAttempts = 10;
	} else if (aMaxGuesses < 8) {
		//aMaxGuesses is below the minimum allowed, so default to the minimum
		this.maxAttempts = 8;
	} else if (aMaxGuesses > 12) {
		//aMaxGuesses is above the maximum allowed, so default to the maximum
		this.maxAttempts = 12;
	} else {
		//aMaxGuesses is valid, so assign it to the maxAttempts property
		this.maxAttempts = aMaxGuesses;
	}
	//Choose the code symbols that will be used in the current game
	this.codeSymbolIds = this.chooseCodeSymbolIdsForGame();
	//Generate the hidden code for the game
	this.hiddenCode = this.buildHiddenCode();
	//Initialise the guesses array, which will store each guess that's made
	this.guesses = new Array();
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getNextSymbolID(aSymbolId:String):String
	This method returns the next symbolId that is in use in the game, relative to the the symbol
	indicated by the aSymbolId parameter. 
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreakerGame.prototype.getNextSymbolId = function(aSymbolId) {
	//Declare a variable for storing the method's result
	var theResult;
	//Loop through the array of code symbols in the current game
	for (var i = 0; i < this.codeSymbolIds.length; i++) {
		//Check to see if the code symbol ID at index i matches the aSymbolId parameter
		if (this.codeSymbolIds[i] == aSymbolId) {
			//There is a match. Check to see if the match is with the last symbol in the
			//codeSymbolIds array
			if (i == this.codeSymbolIds.length -1) {
				//The match is with the last symbol in the codeSymbolIds array, so the next
				//symbol ID will be the first symbol ID in the array
				theResult = this.codeSymbolIds[0];
			} else {
				//The match is not with the last symbol in the codeSymbolIds array, so the next
				//symbol ID is the one in the next index position of the array
				theResult = this.codeSymbolIds[(i+1)];
			}
			//We have a result so can break from the loop
			break;
		}
	}
	//Return the method's result
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getPreviousSymbolID(aSymbolId:String):String
	This method returns the previous symbolId that is in use in the game, relative to the symbol
	indicated by the aSymbolId parameter
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreakerGame.prototype.getPreviousSymbolId = function(aSymbolId) {
	//Declare a variable for storing the method's result
	var theResult;
	//Loop through the array of code symbols in the current game
	for (var i = 0; i< this.codeSymbolIds.length; i++) {
		//Check to see if the code symbol ID at index i matches the aSymbolId parameter
		if (this.codeSymbolIds[i] == aSymbolId) {
			//There is a match. Check to see if the match is with the first symbol in the
			//codeSymbolIds array
			if (i == 0){
				//The match is with the first symbol in the codeSymbolIds array, so the previous
				//symbol ID is the last one in the array
				theResult = this.codeSymbolIds[(this.codeSymbolIds.length -1)];
			} else{
				//The match is not with the first symbol in the codeSymbolIds array, so the
				//previous symbol ID is the one in the previous index position of the array
				theResult = this.codeSymbolIds[(i -1)];
			}
		}
	}
	//Return the method's result
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: tryCode(inputCode:Array):Array
	This method tests the sequence of code symbols indicated by the inputCode paramter against the
	hidden code. The method returns an array that contains a number between 0 and 2 corresponding
	to each item in the inputCode array. The numbers have the following meanings:
		0: no matching symbol in the hidden code
		1: a symbol in the hidden code matches, but is in a different position
		2: a symbol in the hidden code matches and is in the same position
	
	Note that the logic used to determine the matching of each input code symbol is trickier than
	it may on the surface appear:
	a) If a hidden code symbol is same-position matched to an input code symbol, then that hidden
	code symbol can't be different-position matched to any other input code symbols;
	b) If a hidden code symbol has been different-position matched to to an input symbol then
	that hidden code symbol can't be used to create a different-position match to any other input
	symbol.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreakerGame.prototype.tryCode = function(inputCode) {
	//Add the guess to the guesses array
	this.guesses.push(inputCode);
	//Create a variable to contain the method's result; assign a new array to the variable
	var theResult = new Array();
	//Make a copy of the hiddenCode. We need to copy it because the method needs to manipulate the
	//hidden code array which, if done on the hidden code itself, would mess-up the hideen code
	//and break the game.
	//The slice method of the Array class can make this copy for us 
	var hiddenCodeCopy = this.hiddenCode.slice(0);
	//Loop through the inputCode, looking for same-position matches
	for (var i = 0; i < inputCode.length; i++) {
		//Compare the inputCode symbol at index i with the hiddenCodeCopy symbol at index i
		if (inputCode[i] == hiddenCodeCopy[i]) {
			//If the two codes match then this is an exact-position match, so create an element
			//in theResult array at index position i with a value of 2
			theResult[i] = 2;
			//Replace the symbol ID in hiddenCodeCopy with the word "matched"; this ensures that
			//the hiddenCode symbol cannot be matched against any other inputCode symbol when
			//testing for different-position matches
			hiddenCodeCopy[i] = "matched"
		}
	}
	//Loop through inputCode again, this time looking for different-position matches
	for (var i = 0; i < inputCode.length; i++) {
		//Check that the symbol being tested has not already been matched as a same-position match
		//If it has not already been tested then its index position in theResult array will be
		//undefined
		if (theResult[i] == undefined) {
			//The symbol is not already matched.
			//For convenience, declare a variable and assign to it the inputCode symbol being
			//tested
			var inputSymbol = inputCode[i];
			//Create a temporary array to store any matches between the input code symbol and
			//any symbol in the copy of the hidden code
			var matches = new Array();
			//Loop through the hiddenCodeCopy array looking for any symbols that match the
			//input code symbol
			for (var j = 0; j < hiddenCodeCopy.length; j++) {
				//Check to see if the hiddenCodeCopy symbol at index j matches the inputSymbol
				if (hiddenCodeCopy[j] == inputSymbol) {
					//If there is a match then add the match position, j, to the temporary
					//matches array
					matches.push(j);
				}
			}
			//Check to see if any different-position matches were found
			if (matches.length == 0) {
				//No different-position matches were found, and so the result for this input code
				//symbol is no match (0)
				theResult[i] = 0;
			} else {
				//At least one different-position match was found. A hidden code symbol can only
				//be matched to one input code symbol, so we'll match the input code symbol with
				//first different-position matched hidden code symbol that was found.
				//Set the result number for this input code position (i) to 1 to indicate a
				//different position match
				theResult[i] = 1;
				//Set the matched symbol in hiddenCodeCopy to "matched" so that it doesn't get
				//matched to any other input code symbols
				hiddenCodeCopy[(matches[0])] = "matched";
			}
		}
	}
	//Return the result of the method
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getGameStatus():String
	This method works out the status of the current game and returns this as a string. Possible
	return values are "won", "lost" and "inProgress"
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreakerGame.prototype.getGameStatus = function() {
	//Declare a variable to store the method's result
	var theResult;
	//Call the isCodeCracked() method to find out if the code has been cracked or not
	var codeCracked = this.isCodeCracked();
	//Check the result of isCodeCracked() and that the number of guesses is within that allowed
	//by the maxAttempts property
	if (codeCracked && this.guesses.length <= this.maxAttempts) {
		//The code is cracked within the allowed number of attempts, so the game is won
		theResult = "won";
	} else if (this.guesses.length >= this.maxAttempts) {
		//The player has taken too many guesses, so the game is lost
		theResult = "lost"
	} else {
		//If the game is neither won nor lost then it must be in progress
		theResult = "inProgress";
	}
	//Return the method's result
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getCodeSymbolIdsForGame():Array
	This method chooses the code symbols that will be used in the game. Code symbols are managed
	internally using an ID string that runs from "s0" for the first symbol through to "s9" for the
	tenth.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreakerGame.prototype.chooseCodeSymbolIdsForGame = function() {
	//Declare a variable to store the method's result, and assign a new array to that variable
	var theResult = new Array();
	//Create an array that lists all of the available symbol IDs; assign this to an array called
	//unselectedIds (because these are the symbol IDs that have not yet been selected for the game)
	var unselectedIds = new Array("s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9");
	//Check to see if the game is set to use all available symbols (I.E. 10 symbols)
	if (this.numSymbols == 10) {
		//The game is using all 10 symbols, so simply assign unselectedIds to theResult
		theResult = unselectedIds;
	} else {
		//The game is using fewer than 10 symbols, so pick the symbols using a for loop
		for (var i = 0; i < this.numSymbols; i++) {
			//Generate a random index number that's between 0 and the current length of the
			//unselectedIds array
			var randIndex = Math.floor(Math.random() * unselectedIds.length);
			//Copy the symbol ID at index randIndex from the unselectedSymbolIds array to
			//theResult array
			theResult.push(unselectedIds[randIndex]);
			//Remove the chosen symbol ID from unselectedSymbolIds
			unselectedIds.splice(randIndex, 1);
		}
	}
	//Use the sort() method of the Array class to put the symbols into order
	theResult.sort();
	//Return the method's result
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: buildHiddenCode():Array
	This method creates the hidden code that the player must try to guess. It should only be
	called after getSymbolIdsForGame() has been called.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreakerGame.prototype.buildHiddenCode = function() {
	//Declare a variable to store the method's result; initialise the variable with a new array
	var theResult = new Array();
	//Choose codeLength number of symbols to comprise the hidden code
	for (var i = 0; i < this.codeLength; i++) {
		//Generate a random index number between 0 and the number of code symbols in the game
		var randIndex = Math.floor(Math.random() * this.numSymbols);
		//Add the code symbol at index randIndex to theResult array
		theResult.push(this.codeSymbolIds[randIndex]);
	}
	//Return the method's result
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: isCodeCracked():Boolean
	This method looks at the last entry in the guesses array and returns true if that guess matches
	the hidden code
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeBreakerGame.prototype.isCodeCracked = function() {
	//Declare a variable for storing the return value, and initialise to true
	var theResult = true;
	//Check that some guesses have been made
	if (this.guesses.length == 0) {
		//No guesses have been made so the code is not cracked
		theResult = false;
	} else {
		//Get the last guess from the guesses array; it will be at the last index position of
		//the array, which is the array's length -1
		var lastGuess = this.guesses[(this.guesses.length -1)];
		//Loop through each symbol of the hidden code, comparing it to the symbol in the same
		//position within the lastGuess array
		for (var i = 0; i < this.codeLength; i++) {
			//Check to see if the hidden code symbol matches the lastGuess symbol
			if (this.hiddenCode[i] != lastGuess[i]) {
				//If the two symbols don't match then the code is not cracked
				theResult = false;
				//We have a result so can break from the array
				break;
			}
		}
	}
	//Return the method's result
	return(theResult);
}
/*===============================================================================================*/