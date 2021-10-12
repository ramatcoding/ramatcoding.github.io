/*=================================================================================================
-- CodeSymbol Class
	The game uses various graphical symbols, and uses them in various locations and contexts. This
	class represents those symbols wherever they are used.
	
	Internally, the 10 symbols are represented by simple strings: "s0" for the first symbol to "s9"
	for the last. This makes it easy to work with the symbols whilst separating them from the
	complexity of actually rendering the symbol graphic on-screen.
	
	The symbol graphics themselves are in SVG format. We can use SVG images in a number of different
	ways in a web page. Most often, they are used in conjunction with an <img> element - when
	used in this way the SVG data is 'rasterised' (I.E. the vector information is converted to
	bitmap data before being rendered on-screen). However, if rasterised in this way we would not
	be able to control the color of the symbol via scripting - rather, we'd need to have a
	separate file for each color version of each symbol. Also, the glowing visual effect that's
	being applied liberally throughout the game (see CodeBreakerPrebuilt.css) may not work in the
	desired way	when applied to the symbol graphics.
	
	An alternative is to directly embed the SVG data into the page's HTML, and rely on the browser's
	ability to directly render SVG code, which is how CodeBreaker does things. SVG is a 'markup'
	language, which means that, like HTML, it uses tags, elements and attributes, only with SVG
	markup, these tags etc. describe graphics rather than web pages.
	
	In CodeBreaker, CodeSymbol instances are created by a 'factory' class (see
	CodeSymbolFactory.js). This class contains the actual SVG markup for each of the graphical
	symbols, and this is passed in to CodeSymbol instances when they are created. When we need
	to draw that instance on-screen, the CodeSymbol object will generate the appropriate HTML and
	SVG markup that's required to draw the symbol and its surrounding border.
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
	Classes always have a 'constructor' method. This is the method that's called when a new
	instance of the class is created with the 'new' keyword.
	
	This constructor creates a new instance of the CodeSymbol class. The call to the constructor
	will be generated by a CodeSymbolFactory instance, which will pass an object to the constructor
	that contains all of the data required by the CodeSymbol instance.
	
	The 'this' keyword, that you see used througout this script, is a reference to the instance
	of the class that's handling the method or stores the property value - I.E. the object itself.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeSymbol = function(symbolData) {
	//Each symbol is represented by a string ("s0" to "s9"). symbolId stores that string for a
	//CodeSymbol instance
	this.symbolId = symbolData.symbolId;
	//Each symbol is displayed within a rounded rectangle border and needs to be centralised
	//within this border. As each symbol has slightly different dimensions, the x and y position
	//of the symbol graphic relative to the border will differ for each symbol. The offset property
	//stores this x and y data that it uses when creating the HTML and SVG output for a CodeSymbol
	//instance
	this.offset = new Object();
	this.offset.x = symbolData.offset.x;
	this.offset.y = symbolData.offset.y;
	//By default, when rendered directly by the browser via embedded SVG markup, SVG graphics will
	//be sized to fill their containing element. We don't want this, and so we store the desired
	//size information inside the CodeSymbol object which it can then use when generating the
	//HTML and SVG output for the instance
	this.size = new Object();
	this.size.w = symbolData.size.w;
	this.size.h = symbolData.size.h;
	//The SVG markup for the symbol is stored within the symbol for convenient access. The data
	//is simply a string, which we store in the svg property of a CodeSymbol object
	this.svg = symbolData.svg;
	//Code symbols can be one of four colors: blue, red, amber or green. The color property
	//of CodeSymbol objects stores the name of this color (the color itself is coded into the
	//SVG markup by the CodeSymbolFactory when it creates a CodeSymbol object)
	this.color = symbolData.color;
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getHtmlElement():HTMLElement
	This method generates the HTML and SVG output that's needed to draw a CodeSymbol object
	on-screenCreates. Note that this generates the HTML elements, but does not add them to the
	screen (that would be a task for the function/method that's manipulating the CodeSymbol object)
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.CodeSymbol.prototype.getHtmlElement = function() {
	//Create a <div> element to act as the outer wrapper for all of the symbol's elements
	var wrapperElement = document.createElement("div");
	//Set the wrapper's CSS class name
	wrapperElement.className = "codeSymbol";
	//Create a <div> element to act as the border of the symbol graphic
	var borderElement = document.createElement("div");
	//Set CSS class names for the border graphic
	borderElement.className = "buttonBorder " + this.color;
	//Create a wrapper to contain the SVG graphic itself; we need to do this in order to control
	//the size of the SVG graphic - I.E. by sizing this wrapper element we can size the SVG
	//graphic within it.
	var symbolWrapper = document.createElement("div");
	//Set the CSS class name for the symbol wrapper
	symbolWrapper.className = "symbolGraphicWrapper";
	//We need to be able to move the position of the wrapper so that the graphic is centralised
	//within its border; setting the wrapper's position style property to "relative" will
	//allow for this
	symbolWrapper.style.position = "relative";
	//Set the position (offset) and size of the wrapper element using CSS style properties
	symbolWrapper.style.left = String(this.offset.x) + "px";
	symbolWrapper.style.top = String(this.offset.y) + "px";
	symbolWrapper.style.width = String(this.size.w) + "px";
	symbolWrapper.style.height = String(this.size.h) + "px";
	//Assign the SVG markup (which is a string) as the content of the wrapper
	symbolWrapper.innerHTML = this.svg;
	//Add the symbol wrapper within the border
	borderElement.appendChild(symbolWrapper);
	//Add the border (and symbol wrapper) to the outer wrapper <div>
	wrapperElement.appendChild(borderElement);
	//Return a reference to the outer wrapper element - note that this does not add the element
	//to the document
	return(wrapperElement);
}
/*===============================================================================================*/