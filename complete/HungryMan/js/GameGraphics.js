/*=================================================================================================
-- GameGraphics Class
	The Hungry Man game uses various graphics elements to build up the image of a hand holding
	food near to a big open mouth.
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
	This constructor creates a new GameGraphics object. The constructor expects to receive a
	single argument, captured as the graphicName parameter. It uses graphicName to determine which
	image to load, and where to place it on the screen.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.GameGraphics = function(graphicName) {
	//name stores the name of the GameGraphics object - initialise it to null
	this.name = null;
	//imageEl is the <img> HTML element that displays the graphic on screen - initialise it to null
	this.imageEl = null;
	//startPos is the location at which the <img> element should be placed at the beginning of
	//the game
	this.startPos = null;
	//endPos is the location the <img> element will reach when the player has made the maximum
	//allowed number of guesses
	this.endPos = null;
	//z is a number that controls the stacking order of the graphics. Lower numbers are positioned
	//behind higher numbered GameGaphics objects
	this.z = null;
	//The distance between startPos and endPos is divided into equally sized steps. The number of
	//steps will equal the value of the game engine's MAX_INCORRECT_GUESSES constant. Initialise
	//the property to null
	this.stepSize = null;
	//isInDocument indicates whether-or-not the GameGraphics object is displayed in the HTML page
	//Initialise the property to false
	this.isInDocument = false;
	//Call the loadGraphic() method to load the requested graphic into the GameGraphics instance
	this.loadGraphic(graphicName);
}
/*===============================================================================================*/

/*=================================================================================================
-- STATIC METHOD: getGraphicsData():Array	
	This method contains hard-coded information about each of the graphics elements in the game,
	including the various food graphics. That information includes the name, an id to assign to
	a graphic's <img> element, the URL of the image (relative to the HTML document), an
	initial starting position for the image and a z stacking-order value.
	
	The method returns an array containing objects that define the data for each all of the
	different graphic elements in the game.
	
	A static method differs from a normal method in that it can be called directly on the class
	itself and doesn't need to be called via an instance of the class.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.GameGraphics.getGraphicsData = function() {
	//Declare the grapics data as an array literal, containing a number of object literals
	var graphicsData = [
		{name:"apple", htmlid:"food_apple", imageUrl:"img/apple.png", startPos:{x:93, y:75}, z:4 },
		{name:"burger", htmlid:"food_burger", imageUrl:"img/burger.png", startPos:{x:39, y:71}, z:4 },
		{name:"chicken", hrmlid:"food_chicken", imageUrl:"img/chicken.png", startPos:{x:53, y:119}, z:4 },
		{name:"french fries", htmlid:"food_frenchfries", imageUrl:"img/frenchfries.png", startPos:{x:82, y:53}, z:4 },
		{name:"hotdog", htmlid:"food_hotdog", imageUrl:"img/hotdog.png", startPos:{x:0, y:156}, z:4 },
		{name:"meat joint", htmlid:"food_meat", imageUrl:"img/meat.png", startPos:{x:12, y:66}, z:4 },
		{name:"orange", htmlid:"food_orange", imageUrl:"img/orange.png", startPos:{x:81, y:94}, z:4 },
		{name:"orange juice", htmlid:"food_orangejuice", imageUrl:"img/orangejuice.png", startPos:{x:108, y:46}, z:4 },
		{name:"pear", htmlid:"food_pear", imageUrl:"img/pear.png", startPos:{x:103, y:51}, z:4 },
		{name:"pizza", htmlid:"food_pizza", imageUrl:"img/pizza.png", startPos:{x:0, y:105}, z:4 },
		{name:"sandwich", htmlid:"food_sandwich", imageUrl:"img/sandwich.png", startPos:{x:8, y:78}, z:4 },
		{name:"strawberries", htmlid:"food_strawberries", imageUrl:"img/strawberries.png", startPos:{x:86, y:31}, z:4 },
		{name:"sub sandwich", htmlid:"food_subsandwich", imageUrl:"img/subsandwich.png", startPos:{x:-33, y:102}, z:4 },
		{name:"faceFG", htmlid:"faceFG", imageUrl:"img/faceFG.png", startPos:{x:512, y:0}, z:6 },
		{name:"faceBG", htmlid:"faceBG", imageUrl:"img/faceBG.png", startPos:{x:562, y:1}, z:1 },
		{name:"handFG", htmlid:"handFG", imageUrl:"img/handFG.png", startPos:{x:4, y:163.5}, z:5},
		{name:"handBG", htmlid:"handBG", imageUrl:"img/handBG.png", startPos:{x:157.9, y:166.3}, z:2 },
		{name:"tongue", htmlid:"tongue", imageUrl:"img/tongue.png", startPos:{x:600, y:210}, z:3}
	];
	//Return the graphics data
	return(graphicsData);	
}
/*===============================================================================================*/

/*=================================================================================================
-- STATIC METHOD: getDataForGraphic(graphicName):Object
	This static method returns the graphic data for the graphic indicated by the graphicName
	parameter.
	
	A static method differs from a normal method in that it can be called directly on the class
	itself and doesn't need to be called via an instance of the class.	
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.GameGraphics.getDataForGraphic = function(graphicName) {
	//Declare a variable in which to store the method's result
	var theResult;
	//Get the data for all graphics by calling getGraphicsData()
	var allGraphicsData = com.flametreepublishing.cfk.GameGraphics.getGraphicsData();
	//Create a loop that will step through the allGraphicsData array
	for (var i = 0; i < allGraphicsData.length; i++) {
		//Test each element of the array to see if its name matches the graphicName parameter
		if (allGraphicsData[i].name == graphicName) {
			//If the name matches then we've found the data object we're looking for. Assign this
			//object to the method's result variable
			theResult = allGraphicsData[i];
			//Now that we have a result we can break from the loop
			break;
		}
	}
	//Return the graphics data that was found (the result will be undefined if data was not found
	//for some reason, such as a mistyped graphicName argument in the call to the method)
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: resetGraphic():Void
	This method tells the graphic to return to its starting positiong
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.GameGraphics.prototype.resetGraphic = function() {
	//The GameGraphic object's imageEl property is a reference to the HTML <img> element that
	//displays the graphic's image. The style property of imageEl lets us access the styling
	//for the HTML element.
	//Set the <img> element's left offset value
	this.imageEl.style.left = this.startPos.x + "px";
	//Set the <img> element's top offset value
	this.imageEl.style.top = this.startPos.y + "px";
	//The CSS z-index property determines the stacking order of elements; it can be accessed
	//via the zIndex property of imageEl's style property.
	//Assign the GameGraphics object's z property value to imageEl's zIndex style property.
	this.imageEl.style.zIndex = this.z;
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: addToDocument():Void
	This method adds the GameGraphic instance's imageEl to the HTML document
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.GameGraphics.prototype.addToDocument = function() {
	//Check that the GameGraphic object is not already on-screen by testing the isInDocument
	//property
	if (!this.isInDocument) {
		//If the GameGraphics object isn't in the game then we can add it. The graphics are added
		//to the document's graphicsDisplayWrapper element - get a reference to that element using
		//getElementById()
		var graphicsDisplayWrapper = document.getElementById("graphicsDisplayWrapper");
		//Add the imageEl HTML element to the graphicsDisplayWrapper HTML element
		graphicsDisplayWrapper.appendChild(this.imageEl);
		//Update isInDocument accordingly
		this.isInDocument = true;
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: removeFromDocument():Void
	This method removes the GameGraphic instance's imageEl HTML element from the HTML document
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.GameGraphics.prototype.removeFromDocument = function() {
	//Confirm that the imageEl HTML element is currently in the document
	if (this.isInDocument) {
		//Get a reference to the graphicsDisplayWrapper element in which the imageEl is located
		var graphicsDisplayWrapper = document.getElementById("graphicsDisplayWrapper");
		//Use the HTML element's removeChild method to remove the imageEl from the document
		graphicsDisplayWrapper.removeChild(this.imageEl);
		//Update isInDocument accordingly
		this.isInDocument = false;
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: moveToStep(stepNum:Number):Void
	This method moves the graphic to the position it should be at after a given number of incorrect
	guesses. The number of incorrect guesses is passed to the method and captured as the stepNum
	parameter. Note that the distance moved in each step has been calculated based on the
	MAX_INCORRECT_GUESSES constant, so if you change that constant then the game will automatically
	adapt to that change.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.GameGraphics.prototype.moveToStep = function(stepNum) {
	//Check that at least one stepSize dimension is not equal to 0 (if both are 0 then there's no
	//change of position, and so no point in continuing))
	if (this.stepSize.x != 0 || this.stepSize.y != 0) {
		//One or both of the stepSize dimensions is greater than 0
		//Set the left offset style property of the object's imageEl HTML element
		this.imageEl.style.left = String(this.startPos.x + (this.stepSize.x * stepNum)) + "px";
		//Set the top offset style property of the object's imageEl HTML element
		this.imageEl.style.top = String(this.startPos.y + (this.stepSize.y * stepNum)) + "px";
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: loadGraphic(graphicName):Void
	This method loads the data for the graphic whose name matches the graphicName parameter. It
	also creates the imageEl <img> HTML element, but does not add it to the HTML document.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.GameGraphics.prototype.loadGraphic = function(graphicName) {
	//Call the getDataForGraphic() static method to get the raw data to parse to the
	//GameGraphics object
	var graphicData = com.flametreepublishing.cfk.GameGraphics.getDataForGraphic(graphicName);
	//If no data it received from the call to getDataForGraphic() then exit the method
	if (graphicData == null) {
		return;
	}
	//Assign the GameGraphics object's name property from the name returned in the
	//graphicData object
	this.name = graphicData.name;
	//Set the startPos property of the GameGraphics object, reading the data from the startPos
	//property of the graphicData object
	this.startPos = {x: graphicData.startPos.x, y: graphicData.startPos.y};
	//Check to see if the GameGraphics object represents on of the face graphical elements
	if (graphicData.name == "faceFG" || graphicData.name == "faceBG") {
		//If this graphic is part of the face then it doesn't move, so we can set its endPos
		//values to match the startPos values
		this.endPos = {x: graphicData.startPos.x, y: graphicData.startPos.y};
	} else if (graphicData.name == "tongue") {
		//If the graphic represents Hungry Man's tongue then calculate its end position based on
		//the game engine's TONGUE_MAX_DEFLECTION constant value
		this.endPos = {x: graphicData.startPos.x + com.flametreepublishing.cfk.HungryMan.TONGUE_MAX_DEFLECTION.x,
					   y: graphicData.startPos.y + com.flametreepublishing.cfk.HungryMan.TONGUE_MAX_DEFLECTION.y};
	} else {
		//If the GameGraphics instance is neither part of the face or the tongue, then this
		//graphic must be part of the hand or the food - either way the amount of moevement will be the
		//same
		this.endPos = {x: graphicData.startPos.x + com.flametreepublishing.cfk.HungryMan.HAND_MAX_DEFLECTION.x,
					   y: graphicData.startPos.y + com.flametreepublishing.cfk.HungryMan.HAND_MAX_DEFLECTION.y};
	}
	//Calculate a step size based on the object's startPos and endPos, and the MAX_INCORRECT_FUESSESS constant
	this.stepSize = {x: (this.endPos.x - this.startPos.x) / com.flametreepublishing.cfk.HungryMan.MAX_INCORRECT_GUESSES,
					 y: (this.endPos.y - this.startPos.y) / com.flametreepublishing.cfk.HungryMan.MAX_INCORRECT_GUESSES};
	//Assign a value to the z property
	this.z = graphicData.z;
	//Create an HTML <img> element
	this.imageEl = document.createElement("img");
	//Set the src property of the image element (identical to setting the source attribute of
	//the HTML element)
	this.imageEl.src = graphicData.imageUrl;
	//Give the image element an id value
	this.imageEl.id = graphicData.htmlid;
	//Assign the gameGraphic CSS stlye to the
	this.imageEl.className = "gameGraphic";
	//Set the position of the imageEl <img> element by setting the left and top properties of
	//imageEl's style property
	this.imageEl.style.left = this.startPos.x + "px";
	this.imageEl.style.top = this.startPos.y + "px";
	//Set the z-index for the image
	this.imageEl.style.zIndex = this.z;
	//Update the isInDocument property
	this.isInDocument = false;
}
/*===============================================================================================*/

