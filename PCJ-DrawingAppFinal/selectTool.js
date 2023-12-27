function SelectTool() 
{    
	this.name = "Select";
	this.icon = "assets/select.jpg";

    var self = this;
    
    var startX = -1;
    var startY = -1;
    var drawing = false;
    var selectionActive = false;
       
    var currentSelection;
    var selectionMaskFrame;
    var currentSelectionImg;
    
    // returns current selection
    this.getCurrentSelection = function() 
    {
        return currentSelection;
    }
    
    
    
    // function to set value of active selection
    this.setCurrentSelection = function(x, y, w, h) 
    {
        currentSelection = {"startX": x, "startY": y, "width": w, "height": h};
        
        // store a copy of the entire canvas. this will be our non-selected "frame"
        var canvasCopy = get();
        
        // gets the selection area pixels
        currentSelectionImg = get(currentSelection.startX, currentSelection.startY, 
                                  currentSelection.width, currentSelection.height);
    
        // invert colors of the non-selected area to tell it apart from the selection area
        canvasCopy.filter(INVERT);
        
        selectionMaskFrame = canvasCopy;
    }
    
    
    
    // clears the current active selection from the canvas
    this.clearCurrentSelection = function() 
    {    
        // return the inverted colors of the non-selected image to normal
        selectionMaskFrame.filter(INVERT);
        
        // get the current state of the pixels in the selection area, to account for any drawn changes
        currentSelectionImg = get(currentSelection.startX, currentSelection.startY, 
                                  currentSelection.width, currentSelection.height);

        // draw the normal colored non-selected area back to the canvas
        image(selectionMaskFrame, 0, 0);
        
        // prevents an error when drawing a zero-width image to the canvas
        if (currentSelection.width > 0 && currentSelection.height > 0)
            // draw the updated selection area back to the canvas
            image(currentSelectionImg, currentSelection.startX, currentSelection.startY);
        
        // reset selection variables
        currentSelection = null;
        selectionMaskFrame = null;
        selectionActive = false;
    }

    
    this.draw = function() 
    {
		//only draw when mouse is clicked
        if (!selectionActive) 
        {
            if (mouseIsPressed && mouseX > 0 && mouseY > 0) 
            {
                //if it's the start of drawing a new selection
                if (startX == -1) 
                {
                    startX = mouseX;
                    startY = mouseY;
                    drawing = true;
                    //save the current pixel Array
                    loadPixels();
                }
                else 
                {
                    //update the screen with the saved pixels to hide any previous
                    //line between mouse pressed and released
                    updatePixels();

                    // set the stroke to red for the selection boundary
                    push();
                    noFill();
                    stroke("red");

                    //draw the selection
                    rect(startX, startY, mouseX - startX, mouseY - startY);

                    pop();
                }
            }
            else if (drawing) 
            {
                // mouse has been released after selection has been drawn
                // if the start and current mouse x/y positions are a non-zero distance away.
                if (abs(mouseX - startX) > 0 && abs(mouseY - startY) > 0 && mouseX > 0 && mouseY > 0) 
                {
                    // updatePixels removes the red selection box before storing the current selection
                    updatePixels();
                    
                    //this block accounts for all of the four possible ways a box could be drawn
                    //and applies the selection so that get() and img() work correctly regardless of
                    //how the user drags the selection box
                    if (mouseX > startX && mouseY > startY)
                        self.setCurrentSelection(startX, startY, mouseX - startX, mouseY - startY);
                    else if (mouseX > startX && mouseY < startY)
                        self.setCurrentSelection(startX, mouseY, mouseX - startX, startY - mouseY);
                    else if (mouseX < startX && mouseY > startY)
                        self.setCurrentSelection(mouseX, startY, startX - mouseX, mouseY - startY);
                    else if (mouseX < startX && mouseY < startY)
                        self.setCurrentSelection(mouseX, mouseY, startX - mouseX, startY - mouseY);
                    
                    // draw the non-selected canvas area as an image. Do this first so that it appears behind
                    // the active draw area with colors inverted after setCurrentSelection() called
                    image(selectionMaskFrame, 0, 0);
                    
                    // draw the selected area of the canvas back on top of the filtered image
                    image(currentSelectionImg, currentSelection.startX, currentSelection.startY);
                    
                    // reset our bools and starting x/y variables
                    drawing = false;
                    selectionActive = true;
                    startX = -1;
                    startY = -1;
                }
                else 
                {
                    updatePixels();
                    drawing = false;
                    startX = -1;
                    startY = -1;
                }
            }
        }
    };
}