var gameEngine;

window.addEventListener("load", initialiseGame, false);

function initialiseGame() {
	gameEngine = new com.flametreepublishing.cfk.StarfleetDefence();
	startNewGame();
} 

function startNewGame() {
	gameEngine.resetGame();
	gameEngine.buildTargetingGrid();
	gameEngine.addSpacecraft(5, "Star Destroyer");
	gameEngine.addSpacecraft(4, "Battle Cruiser");
	gameEngine.addSpacecraft(3, "Missile Frigate");
	gameEngine.addSpacecraft(3, "Photon Bomber");
	gameEngine.addSpacecraft(2, "Laser Fighter");
	gameEngine.refreshCommandConsole();
}

function takeShot(eventObj) {
	if (gameEngine.gameOver) {
		return;
	}
	var clickedTDElement = eventObj.target;
	var clickedX = clickedTDElement.getAttribute("coordinate_x");
	var clickedY = clickedTDElement.getAttribute("coordinate_y");
	var target = new com.flametreepublishing.cfk.TargetingCoordinate(clickedX, clickedY);
	var hitTestResult = gameEngine.hitTest(target);
	if (hitTestResult == "oob") {
		gameEngine.playSound("sfx_cantShoot");
		gameEngine.setMessage("The location you targeted is outside of your quadrant.<br>Try again.");
	} else if (hitTestResult == "repeat shot") {
		gameEngine.playSound("sfx_cantShoot");
		gameEngine.setMessage("You have already shot at that coordinate.<br>Try again.");
	} else if (hitTestResult == "miss") {
		gameEngine.logShot(target);
		gameEngine.updateCurrentScore();
		gameEngine.playSound("sfx_shootAndMiss");
		gameEngine.setMessage("Missed! No enemy spacecraft at that coordinate.<br>Try again.");
		clickedTDElement.className = "targetingGridCell missed";
	} else {
		var theSpacecraft = gameEngine.getSpacecraftByName(hitTestResult);
		gameEngine.logShot(target);
		gameEngine.updateCurrentScore();
		clickedTDElement.className = "targetingGridCell hit";		
		clickedTDElement.innerHTML = theSpacecraft.getAcronym();		
		var isDestroyed = theSpacecraft.takeHit(target);
		if (isDestroyed) {
			gameEngine.playSound("sfx_shootAndDestroy");
			gameEngine.setMessage("Great shooting! You hit and destroyed the enemy's " + theSpacecraft.craftName + ".<br>" + String(gameEngine.remainingCraftCount()) + " enemy craft remaining. Keep it up!");
			gameEngine.spacecraftDestroyed();
		} else {
			gameEngine.playSound("sfx_shootAndHit");
			gameEngine.setMessage("Good shot. You hit enemy's " + theSpacecraft.craftName + ".<br>Try to finish it off.");
		}		
	}
	if (gameEngine.gameOver) {
		var bestScoreBeaten = gameEngine.updateBestScore();
		if (bestScoreBeaten) {
			gameEngine.setMessage("Awesome! You've destroyed all of the alien spacecraft with a record number of shots.<br>Walk tall, commander.")
		} else {
			gameEngine.setMessage("Well done commander - you've destroyed all of the alien spacecraft.");
		}		
	}
	
}


