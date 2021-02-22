/*=================================================================================================
	For notes and explanations on this class and its methods, see the version of the class
	contained in the "Exercise16\complete\" folder
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
com.flametreepublishing.cfk.HungryMan = function() {
	this.wordList = new com.flametreepublishing.cfk.WordList();
	this.foodNames = ["apple","burger","chicken","french fries","hotdog","meat joint","orange",
					  "orange juice","pear","pizza","sandwich","strawberries","sub sandwich"];
	this.currentWord = "";
	this.guessedLetters = new Array();
	this.lettersFound = 0;
	this.incorrectGuesses = 0;
	this.gameOver = false;
	this.foodEndPos = {x:720, y:120};
	this.gameGraphics = new Object();
	this.initialiseGameGraphics();	
}
/*===============================================================================================*/

/*=================================================================================================
-- CONSTANTS
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.HAND_MAX_DEFLECTION = {x:238, y:0};
com.flametreepublishing.cfk.HungryMan.TONGUE_MAX_DEFLECTION = {x:-150, y:0};
com.flametreepublishing.cfk.HungryMan.MAX_INCORRECT_GUESSES = 10;
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: loadNewWord():Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.loadNewWord = function() {
	this.currentWord = this.wordList.getRandomWord().toUpperCase();
	this.guessedLetters = new Array();
	this.lettersFound = 0;
	this.incorrectGuesses = 0;
	this.gameOver = false;
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: resetGameGraphics():Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.resetGameGraphics = function() {
	var gameOverMessage = document.getElementById("gameOverMessage");
	if (gameOverMessage != null) {
		document.getElementById("graphicsDisplayWrapper").removeChild(gameOverMessage);
	}
	this.gameOver = false;
	this.gameGraphics.faceBG.resetGraphic();
	this.gameGraphics.faceFG.resetGraphic();
	this.gameGraphics.handBG.resetGraphic();
	this.gameGraphics.handFG.resetGraphic();
	this.gameGraphics.tongue.resetGraphic();
	var randomFoodName = this.getRandomFoodName();
	if (this.gameGraphics.food) {
		this.gameGraphics.food.removeFromDocument();
		while (this.gameGraphics.food.name == randomFoodName) {
			randomFoodName = this.getRandomFoodName();
		}		
	}	
	this.gameGraphics.food = new com.flametreepublishing.cfk.GameGraphics(randomFoodName);
	this.gameGraphics.food.addToDocument();
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: playSound():Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.playSound = function() {
	var audioEl = document.getElementById("sfxPlayer");
	audioEl.play();	
}

/*=================================================================================================
-- METHOD: getLengthOfCurrentWord():Number
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.getLengthOfCurrentWord = function() {
	return(this.currentWord.length);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: hasLetterBeenTried(aLetter:String):Boolean
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.hasLetterBeenTried = function(aLetter) {
	var theResult = false;
	for (var i = 0; i < this.guessedLetters.length; i++) {
		if (this.guessedLetters[i] == aLetter) {
			theResult = true;
			break;
		}
	}
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: guessLetter(aLetter:String):Array
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.guessLetter = function(aLetter) {
	var theResult = new Array();
	if (!this.gameOver) {
		for (var i = 0; i < this.currentWord.length; i++) {
			if (this.currentWord.charAt(i) == aLetter) {
				theResult.push(i);
				this.lettersFound++;
			}
		}
		this.guessedLetters.push(aLetter);
	}
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: registerIncorrectGuess():Boolean
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.registerIncorrectGuess = function() {
	this.incorrectGuesses++;
	if (this.incorrectGuesses >= com.flametreepublishing.cfk.HungryMan.MAX_INCORRECT_GUESSES) {
		this.gameOver = true;
	} else {	
		for (var prop in this.gameGraphics) {
			if (this.gameGraphics[prop]) {
				this.gameGraphics[prop].moveToStep(this.incorrectGuesses);
			}
		}
	}
	return(this.gameOver);	
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: eatTheFood():Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.eatTheFood = function() {
	this.gameGraphics.lastFoodEaten = this.gameGraphics.food;
	this.gameGraphics.food.imageEl.style.left = String(this.foodEndPos.x) + "px";
	this.gameGraphics.food.imageEl.style.top = String(this.foodEndPos.y) + "px";
	this.playSound();
	window.setTimeout("gameEngine.reportGameOver();", 1100);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: isWordGuessed():Boolean
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.isWordGuessed = function() {
	if (this.lettersFound == this.currentWord.length) {
		this.gameOver = true;
	}
	return(this.gameOver);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getMaxIncorrectGuesses():Number
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.getMaxIncorrectGuesses = function() {
	return(com.flametreepublishing.cfk.HungryMan.MAX_INCORRECT_GUESSES);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: reportGameOver():Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.reportGameOver = function() {
	var gameOverMsg;
	if (this.gameOver) {
		if (this.incorrectGuesses >= com.flametreepublishing.cfk.HungryMan.MAX_INCORRECT_GUESSES) {
			gameOverMsg = "Oh no! You didn't guess that Hungry Man was thinking of the word '" + this.currentWord.toUpperCase() + "' and so he gobbled-up your " + this.gameGraphics.food.name + ". <br/>Better luck next time.";
		} else {
			gameOverMsg = "Well done! You saved your " + this.gameGraphics.food.name + " from Hungry Man's greedy guts, but he's hungrier than ever now so why not try again?";
		}
	}
	var graphicsDisplayWrapper = document.getElementById("graphicsDisplayWrapper");
	var messageWrapperEl = document.createElement("div");
	messageWrapperEl.id = "gameOverMessage";
	var gameOverBannerEl = document.createElement("h2");
	gameOverBannerEl.innerHTML = "Game Over";
	messageWrapperEl.appendChild(gameOverBannerEl);
	var messageEl = document.createElement("p");
	messageEl.innerHTML = gameOverMsg;
	messageWrapperEl.appendChild(messageEl);
	graphicsDisplayWrapper.appendChild(messageWrapperEl);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: isGameOver():Boolean
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.isGameOver = function() {
	return(this.gameOver);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: clearEatenFood():Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.clearEatenFood = function() {
	if (this.gameGraphics.lastFoodEaten) {
		this.gameGraphics.lastFoodEaten.removeFromDocument();
		this.gameGraphics.lastFoodEaten = null;
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: initialiseGameGraphics():Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.initialiseGameGraphics = function() {
	this.gameGraphics = new Object();
	this.gameGraphics.faceBG = new com.flametreepublishing.cfk.GameGraphics("faceBG");
	this.gameGraphics.faceBG.addToDocument();
	this.gameGraphics.handBG = new com.flametreepublishing.cfk.GameGraphics("handBG");
	this.gameGraphics.handBG.addToDocument();
	this.gameGraphics.tongue = new com.flametreepublishing.cfk.GameGraphics("tongue");
	this.gameGraphics.tongue.addToDocument();
	this.gameGraphics.food = null;
	this.gameGraphics.lastFoodEaten = null;
	this.gameGraphics.handFG = new com.flametreepublishing.cfk.GameGraphics("handFG");
	this.gameGraphics.handFG.addToDocument();
	this.gameGraphics.faceFG = new com.flametreepublishing.cfk.GameGraphics("faceFG");
	this.gameGraphics.faceFG.addToDocument();
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getRandomFoodName():String
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.getRandomFoodName = function() {	
	return(this.foodNames[(Math.floor(Math.random() * this.foodNames.length))]);
}
/*===============================================================================================*/