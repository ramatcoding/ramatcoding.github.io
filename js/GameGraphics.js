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
com.flametreepublishing.cfk.GameGraphics = function(graphicName) {
	this.name = null;
	this.imageEl = null;
	this.startPos = null;
	this.endPos = null;
	this.z = null;
	this.stepSize = null;
	this.isInDocument = false;
	this.loadGraphic(graphicName);
}
/*===============================================================================================*/

/*=================================================================================================
-- STATIC METHOD: getGraphicsData():Array
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.GameGraphics.getGraphicsData = function() {
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
	return(graphicsData);	
}
/*===============================================================================================*/

/*=================================================================================================
-- STATIC METHOD: getDataForGraphic(graphicName):Object
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.GameGraphics.getDataForGraphic = function(graphicName) {
	var theResult;
	var allGraphicsData = com.flametreepublishing.cfk.GameGraphics.getGraphicsData();
	for (var i = 0; i < allGraphicsData.length; i++) {
		if (allGraphicsData[i].name == graphicName) {
			theResult = allGraphicsData[i];
			break;
		}
	}
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: resetGraphic():Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.GameGraphics.prototype.resetGraphic = function() {
	this.imageEl.style.left = this.startPos.x + "px";
	this.imageEl.style.top = this.startPos.y + "px";
	this.imageEl.style.zIndex = this.z;
}

/*===============================================================================================*/

/*=================================================================================================
-- METHOD: addToDocument():Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.GameGraphics.prototype.addToDocument = function() {
	if (!this.isInDocument) {
		var graphicsDisplayWrapper = document.getElementById("graphicsDisplayWrapper");
		graphicsDisplayWrapper.appendChild(this.imageEl);
		this.isInDocument = true;
	}
}

/*===============================================================================================*/

/*=================================================================================================
-- METHOD: removeFromDocument():Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.GameGraphics.prototype.removeFromDocument = function() {
	if (this.isInDocument) {
		var graphicsDisplayWrapper = document.getElementById("graphicsDisplayWrapper");
		graphicsDisplayWrapper.removeChild(this.imageEl);
		this.isInDocument = false;
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: moveToStep(stepNum:Number):Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.GameGraphics.prototype.moveToStep = function(stepNum) {
	if (this.stepSize.x != 0 || this.stepSize.y != 0) {
		this.imageEl.style.left = String(this.startPos.x + (this.stepSize.x * stepNum)) + "px";
		this.imageEl.style.top = String(this.startPos.y + (this.stepSize.y * stepNum)) + "px";
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: loadGraphic(graphicName):Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.GameGraphics.prototype.loadGraphic = function(graphicName) {
	var graphicData = com.flametreepublishing.cfk.GameGraphics.getDataForGraphic(graphicName);
	if (graphicData == null) {
		return;
	}
	this.name = graphicData.name;
	this.startPos = {x: graphicData.startPos.x, y: graphicData.startPos.y};
	if (graphicData.name == "faceFG" || graphicData.name == "faceBG") {
		this.endPos = {x: graphicData.startPos.x, y: graphicData.startPos.y};
	} else if (graphicData.name == "tongue") {
		this.endPos = {x: graphicData.startPos.x + com.flametreepublishing.cfk.HungryMan.TONGUE_MAX_DEFLECTION.x,
					   y: graphicData.startPos.y + com.flametreepublishing.cfk.HungryMan.TONGUE_MAX_DEFLECTION.y};
	} else {
		this.endPos = {x: graphicData.startPos.x + com.flametreepublishing.cfk.HungryMan.HAND_MAX_DEFLECTION.x,
					   y: graphicData.startPos.y + com.flametreepublishing.cfk.HungryMan.HAND_MAX_DEFLECTION.y};
	}
	this.stepSize = {x: (this.endPos.x - this.startPos.x) / com.flametreepublishing.cfk.HungryMan.MAX_INCORRECT_GUESSES,
					 y: (this.endPos.y - this.startPos.y) / com.flametreepublishing.cfk.HungryMan.MAX_INCORRECT_GUESSES};
	this.z = graphicData.z;
	this.imageEl = document.createElement("img");
	this.imageEl.src = graphicData.imageUrl;
	this.imageEl.id = graphicData.htmlid;
	this.imageEl.className = "gameGraphic";
	this.imageEl.style.left = this.startPos.x + "px";
	this.imageEl.style.top = this.startPos.y + "px";
	this.imageEl.style.zIndex = this.z;
	this.isInDocument = false;
}
/*===============================================================================================*/

