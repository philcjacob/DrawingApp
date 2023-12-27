//global variables that will store the toolbox colour palette
//amnd the helper functions
var toolbox = null;
var colourP = null;
var helpers = null;
var selectTool = null;

var selectMaskFrame;
var currentSelection;
var doOnce;

function setup() 
{
	//create a canvas to fill the content div from index.html
	canvasContainer = select('#content');
	var c = createCanvas(canvasContainer.size().width, canvasContainer.size().height - 10);
    c.id("mainCanvas");
	c.parent("content");
    c.style('margin','5px');
    
	//create helper functions and the colour palette
	helpers = new HelperFunctions();
	colourP = new ColourPalette();
    
	//create a toolbox for storing the tools
	toolbox = new Toolbox();
    
    //create new select tool here and store in a variable
    //this lets us check it directly later without needing to loop through the toolbox
    selectTool = new SelectTool();
    
	//add the tools to the toolbox.
	toolbox.addTool(new FreehandTool());
    toolbox.addTool(new BrushTool());
	toolbox.addTool(new LineToTool());
	toolbox.addTool(new SprayCanTool());
	toolbox.addTool(new mirrorDrawTool());
    toolbox.addTool(new fillBucketTool());
    toolbox.addTool(new Eyedropper());
    toolbox.addTool(selectTool);
    toolbox.addTool(new BlendTool());
	background(255);
    
    doOnce = false;
}


//I moved the draw conditional here to avoid repeating the block in the actual draw function
function doTheDraw() 
{
    //call the draw function from the selected tool.
	//hasOwnProperty is a javascript function that tests
	//if an object contains a particular method or property
	//if there isn't a draw method the app will alert the user
    if (toolbox.selectedTool.hasOwnProperty("draw")) 
    {
        toolbox.selectedTool.draw();
    } 
    else 
    {
        alert("it doesn't look like your tool has a draw method!");
    }
}


function draw() 
{
    // checks if there is a selection active on the canvas
    currentSelection = selectTool.getCurrentSelection();
    if (currentSelection) 
    {
        // checks if the selected tool is the Select Tool without needing to loop through the toolbox
        // if not, then restrict user input on the canvas within the selection bounds
        if (!toolbox.selectedTool.hasOwnProperty("getCurrentSelection")) 
        {
            if (mouseX > currentSelection.startX && mouseY > currentSelection.startY &&
                mouseX < currentSelection.startX + currentSelection.width &&
                mouseY < currentSelection.startY + currentSelection.height) 
            {
                doTheDraw();
            }
        }
        else 
        {
            // if the selected tool is the Select Tool, then clear the selection if the user
            // clicks anywhere on the canvas. doOnce keeps mouseIsPressed from repeatedly running this block
            if (mouseIsPressed && mouseX > 0 && mouseY > 0 && !doOnce) 
            {
                selectTool.clearCurrentSelection();
                doOnce = true;
                currentSelection = null;
            }
        }
    }
    else 
    {
        // there is no selection to worry about. Run draw like normal
        doOnce = false;
        doTheDraw();
    }
}


