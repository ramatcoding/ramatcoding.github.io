/*=================================================================================================
	For notes and explanations on this class and its methods, see the version of the class
	contained in the "Exercise15\complete\" folder
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
com.flametreepublishing.cfk.StarfleetDefence = function() {
	this.maxFleetSize = 5;
	this.fleet = new Array();
	this.shotList = new Array();
	this.craftDestroyed = 0;
	this.currentMessage = "Enemy spacecraft detected in your quadrant! Find and destroy them using as few shots as possible.</br>Good luck commander!";
	this.currentScore = 0;
	this.bestScore = this.getBestScore();
	this.gameOver = false;
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getBestScore():Number
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.getBestScore = function() {
	var bestScoreFromCookie;
	var allCookies = document.cookie;
	var pos = allCookies.indexOf("bestScore=");
	if (pos == -1) {
		document.cookie = "bestScore=100; max-age=" + (60*60*24*365);
		bestScoreFromCookie = 100;
	} else {
		var start = pos + 10;
		var end = allCookies.indexOf(";", start);
		if (end == -1) {
			end = allCookies.length;
		}
		bestScoreFromCookie = Number(allCookies.substring(start, end));
	}
	return(bestScoreFromCookie);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: updateBestScore():Boolean
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.updateBestScore = function() {
	var theResult = false;
	if (this.gameOver) {
		if (this.currentScore < this.bestScore) {
			this.bestScore = this.currentScore;
			document.cookie = "bestScore=" + String(this.bestScore) + "; max-age=" + (60*60*24*365);
			theResult = true;
		}
	}
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: resetBestScore():
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.resetBestScore = function() {
	document.cookie = "bestScore=100; max-age=" + (60*60*24*365);
	this.bestScore = 100;
	this.refreshCommandConsole();
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: buildTargetingGrid()
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.buildTargetingGrid = function() {
	var targetingGridElement = document.getElementById("targetingGrid");
	if (targetingGridElement != null) {
		targetingGridElement.parentNode.removeChild(targetingGridElement);
	}
	targetingGridElement = document.createElement("table");
	targetingGridElement.setAttribute("id", "targetingGrid");
	for(var y = 0; y < 10; y++) {
		var tableRowElement = document.createElement("tr");
		for(var x = 0; x < 10; x++) {
			var tableCellElement = document.createElement("td");
			tableCellElement.className = "targetingGridCell notshot";
			tableCellElement.setAttribute("coordinate_x", String(x));
			tableCellElement.setAttribute("coordinate_y", String(y));
			tableCellElement.addEventListener("click", takeShot, false);
			tableRowElement.appendChild(tableCellElement);
		}
		targetingGridElement.appendChild(tableRowElement);
	}
	document.getElementById("targetingGridWrapper").appendChild(targetingGridElement);
}
/*===============================================================================================*/


/*=================================================================================================
-- METHOD: refreshCommandConsole():Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.refreshCommandConsole = function() {
	document.getElementById("messagePanel").innerHTML = this.currentMessage;
	document.getElementById("currentScorePanel").innerHTML = String(this.currentScore);
	document.getElementById("bestScorePanel").innerHTML = String(this.bestScore);
}

/*===============================================================================================*/

/*=================================================================================================
-- METHOD: hitTest(aCoordinate:TargetingCoordinate):String
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.hitTest = function(aCoordinate) {
	var theResult = "miss";
	if (aCoordinate.x < 0 || aCoordinate.x > 9 || aCoordinate.y < 0 || aCoordinate.y > 9) {
		theResult = "oob";
	} else if (this.coordinateAlreadyShotAt(aCoordinate)) {
		theResult = "repeat shot";
	} else {
		for(var i = 0; i < this.fleet.length; i++) {
			if (this.fleet[i].intersects(aCoordinate)) {
				theResult = this.fleet[i].craftName;
				break;
			}
		}
	}
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: coordinateAlreadyShotAt(aCoordinate:TargetingCoordinate):Boolean
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.coordinateAlreadyShotAt = function(aCoordinate) {
	var theResult = false;
	for(var i = 0; i < this.shotList.length; i++) {
		if (this.shotList[i].matches(aCoordinate)) {
			theResult = true;
			break;
		}
	}
	return(theResult);
}

/*=================================================================================================
-- METHOD: resetGame():Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.resetGame = function() {
	for(var i = 0; i < this.fleet.length; i++) {
		this.fleet[i].removeFleetPanelElements();
	}
	this.fleet = new Array();
	this.shotList = new Array();
	this.craftDestroyed = 0;
	this.currentMessage = "Enemy spacecraft detected in your quadrant! Find and destroy them using as few shots as possible.</br>Good luck commander!";
	this.currentScore = 0;
	this.gameOver = false;
	this.removeGameOverBanner();
}

/*===============================================================================================*/

/*=================================================================================================
-- METHOD: addSpacecraft(aSize:Number, aName:String):Boolean
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.addSpacecraft = function(aSize, aName) {
	if (this.fleet.length >= this.maxFleetSize) {
		return(false)
	}
	var nameArray = aName.split(" ");
	var acronym = ""
	for(var i = 0; i < nameArray.length; i++) {
		acronym = acronym + nameArray[i].charAt(0);
	}
	var spacecraft = new com.flametreepublishing.cfk.Spacecraft(aSize, aName, acronym);
	var startCoord = new com.flametreepublishing.cfk.TargetingCoordinate(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10));
	while (spacecraft.positionSpacecraft(this, startCoord) != true) {
		startCoord = new com.flametreepublishing.cfk.TargetingCoordinate(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10));
	}
	this.fleet.push(spacecraft);
	return(true);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: setMessage(aMessage:String):Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.setMessage = function(aMessage) {
	this.currentMessage = aMessage;
	this.refreshCommandConsole();
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: logShot(aCoordinate:TargetingCoordinate):Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.logShot = function(aCoordinate) {
	this.shotList.push(aCoordinate);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: updateCurrentScore():Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.updateCurrentScore = function() {
	this.currentScore = this.shotList.length;
	this.refreshCommandConsole();
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getSpacecraftByName(aName:String):Spacecraft
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.getSpacecraftByName = function(aName) {
	for(var i = 0; i < this.fleet.length; i++) {
		if (this.fleet[i].craftName == aName) {
			return(this.fleet[i]);
		}
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: spacecraftDestroyed():Boolean
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.spacecraftDestroyed = function() {
	this.craftDestroyed++;
	if (this.craftDestroyed == this.fleet.length) {
		this.gameOver = true;
		this.showGameOverBanner();
	}
	return(this.gameOver);
}

/*=================================================================================================
-- METHOD: playSound(soundName:String):Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.playSound = function(soundName) {
	var audioElement = document.getElementById(soundName);
	if (audioElement != null) {
		if(!audioElement.ended){
			audioElement.pause();
			audioElement.load();
		}
		audioElement.play();
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: showGameOverBanner():Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.showGameOverBanner = function() {
	if (this.gameOver) {
		var gameOverBanner = document.createElement("p");
		gameOverBanner.setAttribute("id", "gameOverBanner");
		gameOverBanner.innerHTML = "Game Over";
		document.getElementById("targetingGridWrapper").appendChild(gameOverBanner);
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: removeGameOverBanner():Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.removeGameOverBanner = function() {
	if (!this.gameOver) {
		var gameOverBanner = document.getElementById("gameOverBanner");
		if (gameOverBanner != null) {
			document.getElementById("targetingGridWrapper").removeChild(gameOverBanner);
		}
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: remainingCraftCount():Number
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.StarfleetDefence.prototype.remainingCraftCount = function() {
	return(this.fleet.length - this.craftDestroyed);
}
/*===============================================================================================*/