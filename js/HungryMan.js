/*=================================================================================================
-- HungryMan Class
	This class acts as the main game engine, controlling and managing the different scripts
	and assets used by the game.
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
	This constructor creates a new instance of the HungryMan class.
	
	Classes always have a 'constructor' method. This is the method that's called when a new
	instance of the class is created with the 'new' keyword.
	
	The 'this' keyword, that you see used througout this script, is a reference to the instance
	of the class that's handling the method or stores the property value - I.E. the object itself.	
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan = function() {
	//wordList is an instance of the WordList class (see WordList.js)
	this.wordList = new com.flametreepublishing.cfk.WordList();
	//foodNames is a list of the food names the game will use
	this.foodNames = ["apple","burger","chicken","french fries","hotdog","meat joint","orange",
					  "orange juice","pear","pizza","sandwich","strawberries","sub sandwich"];
	//currentWord stores the current word to be guessed
	this.currentWord = "";
	//guessedLetters is an array that indicates which letters of the currentWord have been
	//guessed correctly
	this.guessedLetters = new Array();
	//lettersFound counts the number of letters that have been found in the currentWord
	this.lettersFound = 0;
	//incorrectGuesses counts the number of incorrect guesses that have been made
	this.incorrectGuesses = 0;
	//gameOver indicates whether the game is over
	this.gameOver = false;
	//foodEndPos is the position that the food will be moved to if the game is not guessed.
	//It is a location outside of the visible graphics display area - when the food moves
	//to this location it gives the appearance of being eaten by Hungry Man.
	this.foodEndPos = {x:720, y:120};
	//gameGraphics is an object for storing the various graphical elements that make up the
	//game's graphics display area. Each graphical element is represented by a GameGraphics
	//object (see GameGraphics.js)
	this.gameGraphics = new Object();
	//Call the initialiseGameGraphics() method to load and initialise the graphics
	this.initialiseGameGraphics();	
}
/*===============================================================================================*/

/*=================================================================================================
-- CONSTANTS
	Constants are values that are intended to remain static and unchanged throughout the operation
	of an app. JavaScript does not have a formal way of declaring constants and then protecting
	them from being changed, but it is convention to name them with capital letters only - it is
	then for the programmer to avoid changing these constant values.
	
	These constants are declared on the class definition. This allows them to be accessed directly
	from the class definition itself, rather than from objects of the class (although objects of
	the class can also access the constants easily too).
-------------------------------------------------------------------------------------------------*/
//HAND_MAX_DEFLECTION is an object that states the maximum amount of movement that the game's hand
//graphics (including any food in the hand) can move in x and y directions
com.flametreepublishing.cfk.HungryMan.HAND_MAX_DEFLECTION = {x:238, y:0};
//TONGUE_MAX_DEFLECTION is an object that states the maximum amount of movement that the game's
//tongue graphic can move in x and y directions
com.flametreepublishing.cfk.HungryMan.TONGUE_MAX_DEFLECTION = {x:-150, y:0};
//MAX_INCORRECT_GUESSES is the maximum number of guesses that can be made before Hungry Man eats
//the food in his hand. You can change this number to make the game easier or harder
com.flametreepublishing.cfk.HungryMan.MAX_INCORRECT_GUESSES = 10;
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: loadNewWord():Void
	This method initialises a new game by selecting a word at random from the wordList object and
	then resetting the various per-game properties of the HungryMan game engine object.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.loadNewWord = function() {
	//Call the getRandomWord() method of the wordList object to get a new word. Also call the
	//toUpperCase() method of the String class to convert the new word to upper case. Assign the
	//new word to the currentWord property
	this.currentWord = this.wordList.getRandomWord().toUpperCase();
	//Reset the guessedLetters array
	this.guessedLetters = new Array();
	//Reset the lettersFound counter
	this.lettersFound = 0;
	//Reset the incorrectGuesses counter
	this.incorrectGuesses = 0;
	//Reset the gameOver property
	this.gameOver = false;
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: resetGameGraphics():Void
	This method returns the various game graphics to their default starting positions. This is
	done as part of the process of initialising a new game.
	
	The game uses a number of different graphics objects that are layered, grouped and moved to
	create the graphical feedback of the game. The face has a foreground and background, as does
	the hand. Hungry Man's tongue is layered between the two graphics of Hungry Man's face to give
	the impression of the tongue coming out of the mouth. The hand is also layered with the food
	graphic, so that the food looks like it is being held in Hungry Man's hand.
	
	You will probably need to study the initialiseGameGraphics() and the GameGraphics class in
	order to fully understand what this method is doing.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.resetGameGraphics = function() {
	//This method is likely to be called after the end of a game, so the gameOverMessage element
	//may be visible, so we'll get a reference to it from the document
	var gameOverMessage = document.getElementById("gameOverMessage");
	//Check if we actually got a reference to the gameOverMessage element
	if (gameOverMessage != null) {
		//We did get a reference so it must be present - get rid of it!
		document.getElementById("graphicsDisplayWrapper").removeChild(gameOverMessage);
	}
	//If the graphics are being reset then the gameOver property should also be reset to false
	this.gameOver = false;
	//Reset each GameGraphics object
	this.gameGraphics.faceBG.resetGraphic();
	this.gameGraphics.faceFG.resetGraphic();
	this.gameGraphics.handBG.resetGraphic();
	this.gameGraphics.handFG.resetGraphic();
	this.gameGraphics.tongue.resetGraphic();
	//Select a food name at random
	var randomFoodName = this.getRandomFoodName();
	//Check to see if the current game has a food graphic already loaded
	if (this.gameGraphics.food) {
		//If a food graphic is already loaded then remove it
		this.gameGraphics.food.removeFromDocument();
		//Make sure that the random food name that we selected just now is not the same as the
		//food graphic that was used in the previous game
		while (this.gameGraphics.food.name == randomFoodName) {
			//If the current food item's name is the same as the randomFoodName then recaluclate
			//randomFoodName. The while loop will repeat until a different food name is selected
			randomFoodName = this.getRandomFoodName();
		}		
	}
	//The GameGraphics object that represents the food item is recreated for each new game. Now
	//that we have a food name that differs from the food used in the previous game we can create
	//the GameGraphics object that will represent the food
	this.gameGraphics.food = new com.flametreepublishing.cfk.GameGraphics(randomFoodName);
	//Add the GameGraphics object to the game
	this.gameGraphics.food.addToDocument();
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: playSound():Void
	This method plays the burp sound effect loaded in the HTML audio element with id sfxPlayer
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.playSound = function() {
	//Get a reference to the <audio> element
	var audioEl = document.getElementById("sfxPlayer");
	//Tell the <audio> element to play its sound
	audioEl.play();	
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getLengthOfCurrentWord():Number
	This method provides a quick way of looking up the currentWord's length (the length property
	of the String object tells us this).
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.getLengthOfCurrentWord = function() {
	return(this.currentWord.length);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: hasLetterBeenTried(aLetter:String):Boolean
	This method checks to see whether a letter - captured as the aLetter parameter - has already
	been tried. The method returns true if so, otherwise false.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.hasLetterBeenTried = function(aLetter) {
	//Declare a variable for storing the method's result, and initialise to false
	var theResult = false;
	//Step through each letter in the guessedLetters array and see if any match	aLetter.  
	for (var i = 0; i < this.guessedLetters.length; i++) {
		//Check to see if the letter at index i of the guessedLetter array is the same as aLetter
		if (this.guessedLetters[i] == aLetter) {
			//The letters match and so the method's result will is true
			theResult = true;
			//We've found a result and so can break from the loop
			break;
		}
	}
	//Return the method's result
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: guessLetter(aLetter:String):Array
	This method tests a letter - captured as the parameter aLetter - against the currentWord. The
	method returns an array indicating the index positions at which there was a match, or an empty
	array if there are no matches.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.guessLetter = function(aLetter) {
	//Declare a variable for storing the method's result, and initialise it to be a new array
	var theResult = new Array();
	//The method should not act if the game is over, so check the gameOver property
	if (!this.gameOver) {
		//The game is not over so loop through currentWord and see if any of its letters match
		//aLetter
		for (var i = 0; i < this.currentWord.length; i++) {
			//Check the currentWord letter at index i against aLetter
			if (this.currentWord.charAt(i) == aLetter) {
				//The two letters match, so add the current loop index value to the results array
				theResult.push(i);
				//Increment the lettersFound property
				this.lettersFound++;
			}
		}
		//Add aLetter to the guessedLetters array
		this.guessedLetters.push(aLetter);
	}
	//Return the result of the method
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: registerIncorrectGuess():Boolean
	This method is called when the player has made an incorrect guess. The method updates the
	graphics, increments incorrectGuesses, and determines if the game has ended as a result of the
	incorrect guess. The method returns the resulting gameOver value.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.registerIncorrectGuess = function() {
	//Increment the incorrectGuesses property
	this.incorrectGuesses++;
	//Check the number of incorrect guesses against the MAX_INCORRECT_GUESSES constant
	if (this.incorrectGuesses >= com.flametreepublishing.cfk.HungryMan.MAX_INCORRECT_GUESSES) {
		//The number of incorrect guesses is greater than or equal to MAX_INCORRECT_GUESSES,
		//so the game is over
		this.gameOver = true;
	} else {
		//The player still has some more guesses remaining. Loop through the gameGraphics object,
		//updating the position of each graphic
		for (var prop in this.gameGraphics) {
			//Check the gameGraphics[prop] has a value assigned to it (If the property references
			//a GameGraphic object then it will evaluate to true when converted to Boolean by the
			//if statement; null and undefined values evaluate to false) 
			if (this.gameGraphics[prop]) {
				//Tell the GameGraphics object to move to the next 'step' (see GameGraphics.js)
				this.gameGraphics[prop].moveToStep(this.incorrectGuesses);
			}
		}
	}
	//Return the gameOver property value
	return(this.gameOver);	
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: eatTheFood():Void
	This method is called when the game is over and the word has not been guessed. The method
	triggers the animation that will cause the food to disappear down Hungey Man's greedy gullet.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.eatTheFood = function() {
	//Get a reference to the GameGraphics object that is about to be eaten. This will be used to
	//ensure the next food item chosen is not the same as the current food item
	this.gameGraphics.lastFoodEaten = this.gameGraphics.food;
	//Move the food GameGraphics' HTML element by setting its left and top offset style properties
	//to match the foodEndPosition.x and foodEndPosition.y property values
	this.gameGraphics.food.imageEl.style.left = String(this.foodEndPos.x) + "px";
	this.gameGraphics.food.imageEl.style.top = String(this.foodEndPos.y) + "px";
	//Trigger the burp sound effect
	this.playSound();
	//Create a timeout which will make the game over message appear. A 'timeout' triggers 
	//a function or method after a period of time has elapsed. We're using it so that the player
	//will see the food disappearing down Hungry Man's gullet before the game over message is
	//displayed.
	window.setTimeout("gameEngine.reportGameOver();", 1100);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: isWordGuessed():Boolean
	This method evaluates the current position of the game, updates the gameOver property
	accordingly, and returns that property to the caller
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.isWordGuessed = function() {
	//See if the number of letters found is equal to the length of currentWord
	if (this.lettersFound == this.currentWord.length) {
		//If the number of letters matches then the game must be over
		this.gameOver = true;
	}
	//Return the gameOver property value
	return(this.gameOver);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getMaxIncorrectGuesses():Number
	This method returns the maximum number of guesses allowed in the game; it is a 'convenience'
	method
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.getMaxIncorrectGuesses = function() {
	return(com.flametreepublishing.cfk.HungryMan.MAX_INCORRECT_GUESSES);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: reportGameOver():Void
	This method shows the game over message on the screen
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.reportGameOver = function() {
	//Declare a variable in which to store the message that will be displayed to the player
	var gameOverMsg;
	//Confirm that the game is over
	if (this.gameOver) {
		//The game is over
		//Compare the incorrectGuesses counter to the MAX_INCORRECT_GUESSES to determine if the
		//game was won or lost
		if (this.incorrectGuesses >= com.flametreepublishing.cfk.HungryMan.MAX_INCORRECT_GUESSES) {
			//If incorrectGuesses is greater-than-or-equal to MAX_INCORRECT_GUESSES then the game
			//was lost
			//Generate an appropriate message, being sure to reveal to the player what the word
			//was that they failed to guess
			gameOverMsg = "Oh no! You didn't guess that Hungry Man was thinking of the word '" + this.currentWord.toUpperCase() + "' and so he gobbled-up your " + this.gameGraphics.food.name + ". <br/>Better luck next time.";
		} else {
			//The game was won. Generate an appropriate message
			gameOverMsg = "Well done! You saved your " + this.gameGraphics.food.name + " from Hungry Man's greedy guts, but he's hungrier than ever now so why not try again?";
		}
	}
	//Get a reference to the graphicsDisplayWrapper element, in which we'll be displaying the game over message
	var graphicsDisplayWrapper = document.getElementById("graphicsDisplayWrapper");
	//Create a <div> in which to put the message's HTML elements
	var messageWrapperEl = document.createElement("div");
	//Set an id for the newly created <div> element
	messageWrapperEl.id = "gameOverMessage";
	//Create an <h2> element for the message title
	var gameOverBannerEl = document.createElement("h2");
	//Set the message title in the <h2>
	gameOverBannerEl.innerHTML = "Game Over";
	//Add the message wrapper <div> to the game over banner <div>
	messageWrapperEl.appendChild(gameOverBannerEl);
	//Create a <p> element to contain the message itself
	var messageEl = document.createElement("p");
	//Set the message as the innerHTML of the new <p> element
	messageEl.innerHTML = gameOverMsg;
	//Add the <p> element to the message wrapper <div> element
	messageWrapperEl.appendChild(messageEl);
	//Add the message wrapper <div> element to the graphics display wrapper <div> element (which will
	//make the message visible on-screen)
	graphicsDisplayWrapper.appendChild(messageWrapperEl);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: isGameOver():Boolean
	This method provides a quick lookup for the current gameOver property value
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.isGameOver = function() {
	return(this.gameOver);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: clearEatenFood():Void
	When a game ends the GameGraphic object for the piece of food featured in that game is stored
	temporarily in gameGraphics.lastFoodEaten. This is to allow the game to be sure it selects
	a different food item for the next fame.
	
	This method, then, clears the lastFoodEaten GameGraphics object from the game
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.clearEatenFood = function() {
	//Check to see if the gameGraphics.lastFoodEaten property is defined
	if (this.gameGraphics.lastFoodEaten) {
		//Call the GameGraphics object's removeFromDocument() method to remove its related HTML
		//elements from the page
		this.gameGraphics.lastFoodEaten.removeFromDocument();
		//Reset the property to null
		this.gameGraphics.lastFoodEaten = null;
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: initialiseGameGraphics():Void
	This method creates a set of GameGraphics objects for the game and adds them to the page.
	This method should only be called from the constructor, and not re-called once the HungryMan
	game engine has been instantiated.
	
	The GameGraphics instances are stored against named properties of the gameGraphics object
	(the choice of 'gameGraphics' as a name for a generic object that will store GameGraphic class
	instances is somewhat confusing, but sometimes these things happen when we're coding!!).
	
	Each GameGraphics object is stored against a property name that describes its purpose within
	the game; these named properties make it quick-and-easy to get a reference to a GameGraphics
	object.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.initialiseGameGraphics = function() {
	//Initialise the gameGraphics object used for storing the GameGraphics class instances
	this.gameGraphics = new Object();
	//Create a GameGraphics instance represent the face background image
	this.gameGraphics.faceBG = new com.flametreepublishing.cfk.GameGraphics("faceBG");
	//Add the face background image to the document
	this.gameGraphics.faceBG.addToDocument();
	//Create a GameGraphics instance to represent the hand background image
	this.gameGraphics.handBG = new com.flametreepublishing.cfk.GameGraphics("handBG");
	//Add the hand background image to the document
	this.gameGraphics.handBG.addToDocument();
	//Create a GameGraphics instance to represent Hungry Man's tongue
	this.gameGraphics.tongue = new com.flametreepublishing.cfk.GameGraphics("tongue");
	//Add the tongue image to the document
	this.gameGraphics.tongue.addToDocument();
	//Declare the food and lastFoodEaten properties, but set them to null for now (they will have
	//GameGraphics objects assigend to them when the game starts)
	this.gameGraphics.food = null;
	this.gameGraphics.lastFoodEaten = null;
	//Create a GameGraphics instance to represent the hand foreground image
	this.gameGraphics.handFG = new com.flametreepublishing.cfk.GameGraphics("handFG");
	//Add the hand foreground image to the document
	this.gameGraphics.handFG.addToDocument();
	//Create a GameGraphics instance to represent the face foreground image
	this.gameGraphics.faceFG = new com.flametreepublishing.cfk.GameGraphics("faceFG");
	//Add the face foreground image to the document
	this.gameGraphics.faceFG.addToDocument();
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getRandomFoodName():String
	This method returns a randomly selected food name from the foodNames array. Notice how the
	method's single statement is made up of a number of different expressions, which means it
	could be split-out into multiple statements - it's laregly a matter of coding style and
	preference.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.HungryMan.prototype.getRandomFoodName = function() {	
	return(this.foodNames[(Math.floor(Math.random() * this.foodNames.length))]);
}
/*===============================================================================================*/

