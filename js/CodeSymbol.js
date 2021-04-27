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
com.flametreepublishing.cfk.CodeSymbol = function(symbolData) {
	this.symbolId = symbolData.symbolId;
	this.offset = new Object();
	this.offset.x = symbolData.offset.x;
	this.offset.y = symbolData.offset.y;
	this.size = new Object();
	this.size.w = symbolData.size.w;
	this.size.h = symbolData.size.h;
	this.svg = symbolData.svg;
	this.color = symbolData.color;
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getHtmlElement():HTMLElement
	Creates a new HTML element based on this symbol. Does not add the element to the document
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeSymbol.prototype.getHtmlElement = function() {
	var wrapperElement = document.createElement("div");
	wrapperElement.className = "codeSymbol";
	var borderElement = document.createElement("div");
	borderElement.className = "buttonBorder " + this.color;
	var symbolWrapper = document.createElement("div");
	symbolWrapper.className = "symbolGraphicWrapper";
	symbolWrapper.style.position = "relative";
	symbolWrapper.style.left = String(this.offset.x) + "px";
	symbolWrapper.style.top = String(this.offset.y) + "px";
	symbolWrapper.style.width = String(this.size.w) + "px";
	symbolWrapper.style.height = String(this.size.h) + "px";
	symbolWrapper.innerHTML = this.svg;
	borderElement.appendChild(symbolWrapper);
	wrapperElement.appendChild(borderElement);
	return(wrapperElement);
}
/*===============================================================================================*/