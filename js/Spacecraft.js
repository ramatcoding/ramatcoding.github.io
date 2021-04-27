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
com.flametreepublishing.cfk.Spacecraft = function(aSize, aName, aAcronym) {
	this.craftSize = aSize;
	this.craftName = aName;
	this.craftAcronym = aAcronym;
	this.craftCoords = new Array();
	this.craftHits = new Array();
	this.isDestroyed = false;
	this.fleetPanelRowElement = null;
	this.craftNameElement = null;
	this.craftSizeElement = null;
	this.craftHitsElement = null;
	this.createFleetPanelElements();
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: createFleetPanelElements():void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.Spacecraft.prototype.createFleetPanelElements = function() {	
	this.craftNameElement = document.createElement("td");
	this.craftNameElement.className = "shipInfo";
	this.craftNameElement.innerHTML = this.craftName + " (" + this.craftAcronym + ")";
	this.craftSizeElement = document.createElement("td");
	this.craftSizeElement.className = "shipInfo";
	this.craftSizeElement.innerHTML = String(this.craftSize);
	this.craftHitsElement = document.createElement("td");
	this.craftHitsElement.className = "shipInfo";
	this.craftHitsElement.innerHTML = String(this.craftHits.length);
	this.fleetPanelRowElement = document.createElement("tr");
	this.fleetPanelRowElement.setAttribute("id", "spacecraft_" + this.craftAcronym);	
	this.fleetPanelRowElement.appendChild(this.craftNameElement);
	this.fleetPanelRowElement.appendChild(this.craftSizeElement);
	this.fleetPanelRowElement.appendChild(this.craftHitsElement);
	document.getElementById("enemyFleetPanelTableBody").appendChild(this.fleetPanelRowElement);	
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: removeFleetPanelElements():void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.Spacecraft.prototype.removeFleetPanelElements = function() {
	if (this.fleetPanelRowElement != null) {
		if (this.craftNameElement != null) {
			this.fleetPanelRowElement.removeChild(this.craftNameElement);
			this.craftNameElement = null;
		}
		if (this.craftSizeElement != null) {
			this.fleetPanelRowElement.removeChild(this.craftSizeElement);
			this.craftSizeElement = null;
		}
		if (this.craftHitsElement != null) {
			this.fleetPanelRowElement.removeChild(this.craftHitsElement);
			this.craftHitsElement = null;
		}
	
		this.fleetPanelRowElement.parentNode.removeChild(this.fleetPanelRowElement);
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: intersects(aCoordinate:TargingCoordinate):Boolean
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.Spacecraft.prototype.intersects = function(aCoordinate) {
	var theResult = false;
	for(var i = 0; i < this.craftCoords.length; i++) {
		if (this.craftCoords[i].matches(aCoordinate)) {
			theResult = true;
			break;
		}
	}
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getAcronym():String
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.Spacecraft.prototype.getAcronym = function() {
	return(this.craftAcronym);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: positionSpacecraft(aContext:StarfleetDefence, aCoordinate:TargingCoordinate):Boolean
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.Spacecraft.prototype.positionSpacecraft = function(aContext, aCoordinate) {
	if (aContext.hitTest(aCoordinate) != "miss") {
		return(false);
	}
	var layoutOptions = this.getLayoutOptions(aContext, aCoordinate);
	if (layoutOptions.length == 0) {
		return(false);
	}
	var randomDirectionIndex = Math.floor(Math.random() * layoutOptions.length);
	var layoutDirection = layoutOptions[randomDirectionIndex];
	this.craftCoords = new Array();
	this.craftCoords.push(aCoordinate);
	for(var i = 1; i < this.craftSize; i++) {
		var newCoordinate = new com.flametreepublishing.cfk.TargetingCoordinate();
		if (layoutDirection == "north") {
			newCoordinate.setCoordinates(aCoordinate.x, aCoordinate.y -i);
		} else if (layoutDirection == "east") {
			newCoordinate.setCoordinates(aCoordinate.x + i, aCoordinate.y);
		} else if (layoutDirection == "south") {
			newCoordinate.setCoordinates(aCoordinate.x, aCoordinate.y +i);
		} else if (layoutDirection == "west") {
			newCoordinate.setCoordinates(aCoordinate.x -i, aCoordinate.y);
		}
		this.craftCoords.push(newCoordinate);
	}
	return(true);	
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getLayoutOptions(aContext:StarfleetDefence, aCoordinate:TargingCoordinate):Array
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.Spacecraft.prototype.getLayoutOptions = function(aContext, aCoordinate) {
	var theResult = new Array();
	if (this.canLayoutInDirection(aContext, aCoordinate, "north")) {
		theResult.push("north");
	}
	if (this.canLayoutInDirection(aContext, aCoordinate, "east")) {
		theResult.push("east");
	}
	if (this.canLayoutInDirection(aContext, aCoordinate, "south")) {
		theResult.push("south");
	}
	if (this.canLayoutInDirection(aContext, aCoordinate, "west")) {
		theResult.push("west");
	}
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: canLayoutInDirection(aContext:StarfleetDefence,
								aCoordinate:TargingCoordinate
								aDirection:String):Boolean
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.Spacecraft.prototype.canLayoutInDirection = function(aContext, aCoordinate, aDirection) {
	var theResult = true;
	var testCoord = new com.flametreepublishing.cfk.TargetingCoordinate();
	for (var i = 1; i < this.craftSize; i++) {
		if (aDirection == "north") {
			testCoord.setCoordinates(aCoordinate.x, aCoordinate.y -i);
		} else if (aDirection == "east") {
			testCoord.setCoordinates(aCoordinate.x + i, aCoordinate.y);
		} else if (aDirection == "south") {
			testCoord.setCoordinates(aCoordinate.x, aCoordinate.y + i);
		} else if (aDirection == "west") {
			testCoord.setCoordinates(aCoordinate.x -i, aCoordinate.y);
		}
		if (aContext.hitTest(testCoord) != "miss") {
			theResult = false;
			break;
		}
	}
	return(theResult);	
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: takeHit(aCoordinate:TargingCoordinate):Boolean
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.Spacecraft.prototype.takeHit = function(aCoordinate) {
	this.craftHits.push(aCoordinate);
	this.craftHitsElement.innerHTML = String(this.craftHits.length);
	if (this.craftHits.length == this.craftSize) {
		this.isDestroyed = true;
		this.craftNameElement.className = "shipInfo destroyed";
		this.craftSizeElement.className = "shipInfo destroyed";
		this.craftHitsElement.className = "shipInfo destroyed";
	}
	return(this.isDestroyed);
}
/*===============================================================================================*/