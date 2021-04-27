/*=================================================================================================
-- StarfleetDefence Class
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
	This constructor creates a new instance of the StarfleetDefence game engine

	Classes always have a 'constructor' method. This is the method that's called when a new
	instance of the class is created with the 'new' keyword.
	
	The 'this' keyword, that you see used througout this script, is a reference to the instance
	of the class that's handling the method or stores the property value - I.E. the object itself.	
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence = function() {
	//maxFleetSize limits the number of Spacecraft objects that can be added to the game
	this.maxFleetSize = 5;
	//fleet is an array that stores the Spacecraft objects for the game
	this.fleet = new Array();
	//the shotList array stores the TargetingCoordinate objects generated by each shot
	this.shotList = new Array();
	//craftDestroyed keeps a track of the number of spacecraft that have been destroyed
	this.craftDestroyed = 0;
	//currentMessage stores the message that is currently displayed in the message panel
	this.currentMessage = "Enemy spacecraft detected in your quadrant! Find and destroy them using as few shots as possible.</br>Good luck commander!";
	//currentScore keeps track of the current score
	this.currentScore = 0;
	//bestScore stores the bestScore value.
	//The value is obtained by calling the getBestScore() method
	this.bestScore = this.getBestScore();
	//gameOver is a Boolean that can be tested by other scripts to see if the game is over or not
	this.gameOver = false;
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getBestScore():Number
	This method reads the document's cookies to look for a bestScore value
	If the value is not found then a new bestScore cookie is created with a value of 0
	The value stored in the cookie is returned to the calling function.
	
	Cookies are data files relating to a web page that are stored by the web browser. They
	provide a way to remember small amounts of data when a page has been closed and subsequently
	re-opened. Wikipedia will give you a thorough explanation on cookies, and w3schools.com will
	show you how to use them.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.getBestScore = function() {
	//Declare a variable to store the value we'll return at the end of the method
	var bestScoreFromCookie; 
	//document.cookie reads all of the cookies that are currently stored for the page.
	//The pages cookies are returned as a string containing property-value pairs
	var allCookies = document.cookie;
	//The indexOf method of the String class will tell us the position of "bestScore="
	//inside the allCookies string - we'll store this as as a variable called pos
	var pos = allCookies.indexOf("bestScore=");
	//Respond to the value of pos...:
	if (pos == -1) {
		//If the pos is -1 then "bestScore=" was not in the cookie string.
		//We therefore need to initialise the cookie. We'll initialise the value to 100 because
		//this is the maximum number of shots that can be taken in the game.
		document.cookie = "bestScore=100; max-age=" + (60*60*24*365);
		//We've had to initialise the cookie, so we know the bestScore value is 100, so we'll
		//assign this to the return variable
		bestScoreFromCookie = 100;
	} else {
		//If pos is not -1 then "bestScore=" was found in the cookie string, so we can extract
		//the value from the cookie string. The value of bestScore will follow the string
		//"bestScore=", and will end with a semicolon, so to get the cookie value we need to
		//extract the text that sits between "bestScore=" and ";". The starting position will be
		//the cookie string character following "bestScore=", which is 10 characters long.
		var start = pos + 10;
		//The end position will be the location of the first semicolon following the start position.
		//The indexOf method helps with this too.
		var end = allCookies.indexOf(";", start);
		//If no semicolon is found then end will be -1; this shouldn't happen, but if it does we
		//need to handle it to avoid an error - the way we'll do that is by assuming the value's
		//end position is the end of the allCookies string itself.
		if (end == -1) {
			end = allCookies.length;
		}
		//The substring method of the string class lets us select a portion of a string based on a
		//start and end position. It returns a string, but the value we return from getBestScore()
		//method needs to be a number - we can use the Number() funciton to convert the substring
		//to a number.
		bestScoreFromCookie = Number(allCookies.substring(start, end));
	}
	//bestScoreFromCookie will now have a value, either the default of 100, or a value read from
	//the cookie, so we'll finish the method by returning that value
	return(bestScoreFromCookie);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: updateBestScore():Boolean
	This method compares the currentScore value to the bestScore value and updates the bestScore
	variable and cookie if currentScore is lower (remeber, in this game a 'better' score is a
	lower score). The method only works when gameOver is true.
	
	The method returns true if the bestScore was beaten, otherwise it returns false.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.updateBestScore = function() {
	//Create a variable for storing the return value. Initialising this to false saves us
	//having to include an else clause in the if statement below
	var theResult = false;
	//The method should only work if the game is over, so test that property of this
	//StarfleetDefence object
	if (this.gameOver) {
		//Compare the currentScore to the bestScore
		if (this.currentScore < this.bestScore) {
			//If currentScore is better (I.E. lower than) best score, update the bestScore variable
			this.bestScore = this.currentScore;
			//...also update the cookie...
			document.cookie = "bestScore=" + String(this.bestScore) + "; max-age=" + (60*60*24*365);
			//...and then set the return variable to true
			theResult = true;
		}
	}
	//Return the result of the method
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: resetBestScore()
	This method resets the bestScore value and cookie to 100
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.resetBestScore = function() {
	//We know the page only uses one cookie, so we can simply overwrite the whole cookie string
	//with the new cookie string. Lookup cookies on w3schools.com to understand the structure
	//of the cookie data.
	document.cookie = "bestScore=100; max-age=" + (60*60*24*365);
	//Reset the bestScore property of the StarfleetDefence object
	this.bestScore = 100;
	//Update the info shown in the game's command console
	this.refreshCommandConsole();
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: buildTargetingGrid()
	This method creates the targetingGrid HTML table. The method uses DOM programming techniques
	to create the HTML elements off-screen before adding them to the display.
	
	If a targeting grid already exists on the page then it is removed before a new grid
	is created.
	
	This method uses something called a 'for' loop, which wasn't covered in the book. This
	repeatedly loops through a block of code, and here we use two nested loops, one to create
	each table row, and one to create the cells within each table row. Learn more about for loops
	at w3schools.com.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.buildTargetingGrid = function() {
	//The grid's HTML table element will be given an id of "targetingGrid". If this element
	//currently exists in the document then it needs to be cleared so a new grid can be created.
	//We can test this by trying to get the element
	var targetingGridElement = document.getElementById("targetingGrid");
	//If the grid doesn't exist then targetingGridElement will be null; if it does then it will
	//be an HTMLElement object. Therefore, if targetingGridElement isn't null then we need to
	//remove the old targeting grid
	if (targetingGridElement != null) {
		//An HTMLElement object's parentNode value is a reference to the element's parent.
		//We can call the removeChild() method of that parent to remove the old grid
		//table from the game
		targetingGridElement.parentNode.removeChild(targetingGridElement);
	}
	//We now know there is no grid in the game so we can create a new one.
	//The document.createElement() method creates a new element but does not add it to the page.
	targetingGridElement = document.createElement("table");
	//The setAttribute() method lets us add new attributes to an HTML element. We'll use it to
	//set the id of the newly created table element
	targetingGridElement.setAttribute("id", "targetingGrid");
	//The table needs 10 rows, so we'll create a loop that will repeat 10 times. Each row of the
	//table represents the Y coordinate of the grid, so we'll count the loop using a variable
	//called y, which will have a value between 0 and 9
	for(var y = 0; y < 10; y++) {
		//Create a table row element
		var tableRowElement = document.createElement("tr");
		//Each row contains 10 cells. So we need a second nested loop that will repeat 10 times.
		//Each cell of the table represents the X coordinate of the grid, so we'll count the loop
		//using a variable called x, which will have a value between 0 and 9
		for(var x = 0; x < 10; x++) {
			//Create a new table cell element
			var tableCellElement = document.createElement("td");
			//Set the element's class attribute value. The style rules assigned to these classes
			//control the appearance of the grid cell
			tableCellElement.className = "targetingGridCell notshot";
			//Create new attributes on the cell that record its X and Y grid coordinates. This
			//will help when we the player clicks the cell to take a shot at it. Attribute
			//values need to be strings, so we use the String() function to convert the values
			//of x and y to strings
			tableCellElement.setAttribute("coordinate_x", String(x));
			tableCellElement.setAttribute("coordinate_y", String(y));
			//We need to listen for the player clicking on the cell, and call the takeShot()
			//function in response
			tableCellElement.addEventListener("click", takeShot, false);
			//Add the new cell to the current table row
			tableRowElement.appendChild(tableCellElement);
		}
		//Add the current row to the table
		targetingGridElement.appendChild(tableRowElement);
	}
	//Add the table to the page as a child of the <div id="targetingGridWrapper"> element
	document.getElementById("targetingGridWrapper").appendChild(targetingGridElement);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: refreshCommandConsole():Void
	This method updates the text that's shown in the various panels of the command console area
	of the game screen.
	
	The method uses getElementById() to get the elements of the control panel, and then sets the
	innerHTML property of those elements using values taken from the current game.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.refreshCommandConsole = function() {
	//The StarfleetDefence object's currentMessage property stores the current message to be
	//displayed. Assign it as the contents of the corresponding <p> element.
	document.getElementById("messagePanel").innerHTML = this.currentMessage;
	//currentScore and bestScore are numbers, but we need them as strings to assign to their
	//corresponding <p> elements - the String() function deals with this for us
	document.getElementById("currentScorePanel").innerHTML = String(this.currentScore);
	document.getElementById("bestScorePanel").innerHTML = String(this.bestScore);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: hitTest(aCoordinate:TargetingCoordinate):String
	This method tests a TargetingCoordinate object to see whether it will hit or miss a spacecraft.
	The TargetingCoordinate is captured as a parameter called aCoordinate.
	
	The method has a number of different possible return values:
		> "miss" if no spacecraft is hit
		> "oob" if the coordinate is out-of-bounds (this is used as a 'fallback' in the event that
		        the TargetingCoordinate object isn't provided or contains incorrect data.
		> "repeat shot" if the coordinate has already been shot at
		> the name of the spacecraft that has been hit.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.hitTest = function(aCoordinate) {
	//The default result will be "miss", so set this in a variable to return at the end of
	//the method
	var theResult = "miss";
	//Test various conditions...
	if (aCoordinate.x < 0 || aCoordinate.x > 9 || aCoordinate.y < 0 || aCoordinate.y > 9) {
		//If any of aCoordinate's values are somehow fall outside of the allowed range, set the
		//result to "oob"
		theResult = "oob";
	} else if (this.coordinateAlreadyShotAt(aCoordinate)) {
		//Call the coordinateAlreadyShotAt() method to see if aCoordinate has already been shot
		//at - if so then the return value is set to "repeat shot"
		theResult = "repeat shot";
	} else {
		//If the previous two conditions were false then the shot may be a hit. We can test this
		//by cycling through all of the Spacecraft objects - stored in the fleet variable - calling
		//their intersects method; this will return true if the aCoordinate intersects the
		//spacecraft's coordinates, otherwise it will return false
		for(var i = 0; i < this.fleet.length; i++) {
			if (this.fleet[i].intersects(aCoordinate)) {
				//If aCoordinate does intersect the spacecraft, then the hitTest() result
				//is the name of the spacecraft, accessible as the craftName property of the
				//Spacecraft object
				theResult = this.fleet[i].craftName;
				//We know aCoordinate is a hit, so we don't need to test it against the other
				//spacecraft. Therefore we can stop looping through the fleet array. The
				//break keyword does this.
				break;
			}
		}
	}
	//Return the result of the method
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: coordinateAlreadyShotAt(aCoordinate:TargetingCoordinate):Boolean
	This method checks to see if the TargetingCoordinate object, captured by the aCoordinate has
	paramenter, has already been shot at; returns true if so, otherwise it returns false
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.coordinateAlreadyShotAt = function(aCoordinate) {
	//Declare a variable for storing the return value; initialise it to false
	var theResult = false;
	//We need to loop through the shotlist, which contains TargetingCoordinate objects, and test
	//those coordinates against the aCoordinate parameter
	for(var i = 0; i < this.shotList.length; i++) {
		//We can't just check if aCoordinate equals the TargetingCoordinates in the shotlist
		//because this would only check to see if they were the same object - which they aren't.
		//Instead, we call the matches() method of one of the TargetingCoordinate objects (see
		//that Class for notes on how it works)
		if (this.shotList[i].matches(aCoordinate)) {
			//If the coordinates match then the result is true
			theResult = true;
			//If we know the result is true there's no need to continue with the loop, so we
			//break out of it
			break;
		}
	}
	//Return the method's result
	return(theResult);
}

/*=================================================================================================
-- METHOD: resetGame():Void
	This method restores the game to its default state, with no enemy fleet, no score, and so-on.
	The method should be called before creating starting a new game.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.resetGame = function() {
	//Each Spacecraft object manages its own entry in the Enemy Fleet panel, so to remove that
	//data we can loop through the fleet array, and call the removeFleetPanelElements() method
	//on each item in that array. See the Spacecraft class for notes on how
	//removeFleetPanelElements() works.
	for(var i = 0; i < this.fleet.length; i++) {
		this.fleet[i].removeFleetPanelElements();
	}
	//Reset the fleet array
	this.fleet = new Array();
	//Reset the shotlist array
	this.shotList = new Array();
	//Reset the craftDestroyed counter
	this.craftDestroyed = 0;
	//Reset the currentMessage string
	this.currentMessage = "Enemy spacecraft detected in your quadrant! Find and destroy them using as few shots as possible.</br>Good luck commander!";
	//Reset the currentScore
	this.currentScore = 0;
	//Reset the gameOver state
	this.gameOver = false;
	//It's likely that, when reseting the game, a previous game will have existed, and so it's
	//also likely that the game over message, shown to the player, will be on-screen, so we'll
	//call the method that removes it.
	this.removeGameOverBanner();
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: addSpacecraft(aSize:Number, aName:String):Boolean
	This method creates a new Spacecraft object in the game, and also adds the new spacecraft
	to the on-screen Enemy Fleet panel.
	
	The method expects two arguments in the call to it: aSize is the number of cells the
	spacecraft will occupy; aName is the name to give to the spacecraft.
	
	Once the new Spacecraft object has been created, this method then controls the process
	that positions the spacecraft on the grid.
	
	The method returns true if the spacecraft was added successfully, otherwise returns false
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.addSpacecraft = function(aSize, aName) {
	//We don't want to add a Spacecraft object to the game if the maximum number of spacecraft
	//already exist - we'll test this with an if statement
	if (this.fleet.length >= this.maxFleetSize) {
		//If the maximum fleet size has been reached then exit the method by returning a value
		//of false
		return(false)
	}
	//We need to give the spacecraft an 'acronym', which will be the initials that show in the
	//targeting grid when the spacecraft is hit. As a first step in this we'll turn the name into
	//an array, with each word of the name being placed in its own array element. The split()
	//method of the String class does this for us.
	var nameArray = aName.split(" ");
	//Intialise a variable to hold the calculated acronym value
	var acronym = ""
	//Loop through the nameArray and concatenate the first letter of each array element to the
	//acronym variable
	for(var i = 0; i < nameArray.length; i++) {
		acronym = acronym + nameArray[i].charAt(0);
	}
	//Create the new Spacecraft object, whose constructor expects to be passed three arguments
	var spacecraft = new com.flametreepublishing.cfk.Spacecraft(aSize, aName, acronym);
	//We need to calculate which grid cells the Spacecraft object will cover. It can't cross
	//over any other spacecraft, and can't spill off the edge of the grid.
	//The first step is to create a TargetingCoordinate object with random x and y coordinates
	var startCoord = new com.flametreepublishing.cfk.TargetingCoordinate(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10));
	//while is another form of loop (look it up on w3schools.com). This loop will try to
	//position the spacecraft starting from the random startCoord; if it can't then a new
	//random startCoord is generated; the loop repeats until the spacecraft has been
	//successfully positioned.
	while (spacecraft.positionSpacecraft(this, startCoord) != true) {
		startCoord = new com.flametreepublishing.cfk.TargetingCoordinate(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10));
	}
	//We can add the new Spacecraft object to the fleet array by calling the array's
	//push() method; this adds an item to the end of an array.
	this.fleet.push(spacecraft);
	//Return true to indicate that the spacecraft was created and positioned successfully
	return(true);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: setMessage(aMessage:String):Void
	This method sets the currentMessage property and updates the on-screen message panel so that
	it shows the new message. The method expects to be passed the message string, which it
	captures in the aMessage parameter.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.setMessage = function(aMessage) {
	//Set the currentMessage property to match the aMessage parameter
	this.currentMessage = aMessage;
	//Call the method that refreshes the command console's <p> elements
	this.refreshCommandConsole();
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: logShot(aCoordinate:TargetingCoordinate):Void
	This method adds a TargetingCoordinate object to the shotList array. The game uses this array
	to determine whether-or-not a grid cell has already been shot at. The method expects to be
	passed a TargetingCoordinate object which it captures in the aCoordinate parameter
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.logShot = function(aCoordinate) {
	//The push method of an array object adds data to the end of an array, so we use it here
	//to add the TargetingCoordinate object to the shotList array
	this.shotList.push(aCoordinate);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: updateCurrentScore():Void
	Given that every shot is stored in the shotList array, we can determine the current score by
	measuring the length of (I.E. the number of elements within) the array. This method, then,
	does exactly this.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.updateCurrentScore = function() {
	//Look up the number of entries in the shotList array by getting its length property, and
	//store this as the currentScore property of the StarfleetDefence object
	this.currentScore = this.shotList.length;
	//Call the method that refreshes the command console's <p> elements
	this.refreshCommandConsole();
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getSpacecraftByName(aName:String):Spacecraft
	This method looks for the Spacecraft object whose name matches the aName parameter, and
	returns that Spacecraft object.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.getSpacecraftByName = function(aName) {
	//Loop through the fleet array
	for(var i = 0; i < this.fleet.length; i++) {
		//Test the name property of each array element against the aName method parameter
		if (this.fleet[i].craftName == aName) {
			//If the two names match then we have found the desired Spacecraft object, and so
			//can return it to the calling expression. We don't need to break from the loop
			//because return ceases processing of a method/function (and thus any loops it
			//contains) anyway.
			return(this.fleet[i]);
		}
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: spacecraftDestroyed():Boolean
	This method logs the destruction of a spacecraft. It increases the craftDestroyed number by 1
	and updates the gameOver status. If the game is over as a result of calling this script then
	it will draws the gameOver banner on the screen.
	
	The method returns the new gameOver status that results from calling the method.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.spacecraftDestroyed = function() {
	//Use the increment operator to increase the craftDestroyed counter
	this.craftDestroyed++;
	//Test the craftDestroyed counter against the length of the fleet array
	if (this.craftDestroyed == this.fleet.length) {
		//If craftDestroyed is the same value as the fleet length, then there are no more
		//spacecraft to destroy and so the game is over.
		//Set the gameOver property to true
		this.gameOver = true;
		//Call the method that shows the gameOver banner
		this.showGameOverBanner();
	}
	//return the current value of the game's gameOver property
	return(this.gameOver);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: playSound(soundName:String):Void
	This method tells one of the <audio> HTML elements to play its sound. The sound to play is
	indicated by the string passed to the method and captured as the soundName paramenter. This
	name should be the same as the id attribute of the <audio> element that we wish to trigger.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.playSound = function(soundName) {
	//Get the HTML <audio> element that has an id that matches the soundName parameter
	var audioElement = document.getElementById(soundName);
	//Check that an element has been returned; the audioElement value will be null if not
	if (audioElement != null) {
		//We've found an HTML <audio> element so can issue it commands.
		//If the element is currently playing then we need to stop and reset it. The element's
		//ended property will be false if its currently playing, so we can test this (notice the
		//logical NOT operator, !, that flips the Boolean value of its operand - read the
		//if statement as "if not audioElement.ended")
		if(!audioElement.ended){
			//The audio element is playing, so pause it...
			audioElement.pause();
			//...then call it's load() method to cause it to reset the play position to the
			//beginning of the sound file
			audioElement.load();
		}
		//Tell the <audio> element to play its sound
		audioElement.play();
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: showGameOverBanner():Void
	This method displays a game over message inside the tageting grid. The message is a <p>
	element that's created by the method. The method will only work if the gameOver property
	is true.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.showGameOverBanner = function() {
	//Check the value of the gameOver property
	if (this.gameOver) {
		//Create the <p> element and store it in a variable
		var gameOverBanner = document.createElement("p");
		//Give the new gameOverBanner element an id value
		gameOverBanner.setAttribute("id", "gameOverBanner");
		//Set the contents of the gameOverBanner element
		gameOverBanner.innerHTML = "Game Over";
		//We'll add the gameOverBanner to the document as a child of the targetingGridWrapper
		//element - we'll use getElementById() to get hold of that element, and then call that
		//element's appendChild() method to add the gameOverBanner to the document. Notice how
		//we've chained together both getElementById() and appendChild() - they could be written
		//them as two separate statements, the first assigning the wrapper element to a variable,
		//and the second adding the gameOverBanner to the wrapper element.
		document.getElementById("targetingGridWrapper").appendChild(gameOverBanner);
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: removeGameOverBanner():Void
	This method removes the gameOver banner if it's present. The method Only works if the
	gameOver property is false.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.removeGameOverBanner = function() {
	//Check the value of the gameOver property - notice the ! operator, which flips the Boolean
	//value of its operand
	if (!this.gameOver) {
		//Get a reference to the gameOverBanner element
		var gameOverBanner = document.getElementById("gameOverBanner");
		//Check that the element was found
		if (gameOverBanner != null) {
			//Use the removeChild() method to remove the gameOverBanner from its parent element
			document.getElementById("targetingGridWrapper").removeChild(gameOverBanner);
		}
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: remainingCraftCount():Number
	This method returns the number of un-destroyed enemy spacecraft.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.remainingCraftCount = function() {
	return(this.fleet.length - this.craftDestroyed);
}
/*===============================================================================================*/


