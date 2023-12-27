function mirrorDrawTool() 
{
	this.name = "Mirror Draw";
	this.icon = "assets/mirrorDraw.jpg";

	//which axis is being mirrored (x or y) x is default
	this.axis = "x";
	//line of symmetry is halfway across the screen
	this.lineOfSymmetry = width / 2;

	//this changes in the jquery click handler. So storing it as
	//a variable self now means we can still access it in the handler
	var self = this;
    
    //arrays to store mouse location history and their calculated opposites
    var mouseHist = [];
    var oppMouseHist = [];


	this.draw = function() 
    {
		//display the last save state of pixels
		updatePixels();

		//do the drawing if the mouse is pressed
		if (mouseIsPressed) 
        {
			//store the current mouse position and its opposite to the respective array
            mouseHist.push([mouseX, mouseY]);
            oppMouseHist.push([this.calculateOpposite(mouseX, "x"), this.calculateOpposite(mouseY, "y")]);
            
            if (mouseHist.length == 4 && oppMouseHist.length == 4) 
            {
                //if both arrays have length 4, we can draw the curve and its mirrored counterpart
                push();
                noFill();
                curve(mouseHist[0][0], mouseHist[0][1], 
                      mouseHist[1][0], mouseHist[1][1], 
                      mouseHist[2][0], mouseHist[2][1], 
                      mouseHist[3][0], mouseHist[3][1]);
                
                curve(oppMouseHist[0][0], oppMouseHist[0][1], 
                      oppMouseHist[1][0], oppMouseHist[1][1], 
                      oppMouseHist[2][0], oppMouseHist[2][1], 
                      oppMouseHist[3][0], oppMouseHist[3][1]);
                
                //shift the arrays to remove the oldest coordinates
                mouseHist.shift();
                oppMouseHist.shift();
                pop();
            }
		}
        else 
        {
            mouseHist = [];
            oppMouseHist = [];
		}
		
        //after the drawing is done save the pixel state. We don't want the
		//line of symmetry to be part of our drawing
		loadPixels();

		//push the drawing state so that we can set the stroke weight and colour
		push();
		strokeWeight(3);
		stroke("red");
		//draw the line of symmetry
		if (this.axis == "x") {
			line(width / 2, 0, width / 2, height);
		} else {
			line(0, height / 2, width, height / 2);
		}
		//return to the original stroke
		pop();
	};

	/*calculate an opposite coordinate the other side of the
	 *symmetry line.
	 *@param n number: location for either x or y coordinate
	 *@param a [x,y]: the axis of the coordinate (y or y)
	 *@return number: the opposite coordinate
	 */
	this.calculateOpposite = function(n, a) 
    {
		//if the axis isn't the one being mirrored return the same
		//value
		if (a != this.axis) 
        {
			return n;
		}

		//if n is less than the line of symmetry return a coorindate
		//that is far greater than the line of symmetry by the distance from
		//n to that line.
		if (n < this.lineOfSymmetry) 
        {
			return this.lineOfSymmetry + (this.lineOfSymmetry - n);
		}

		//otherwise a coordinate that is smaller than the line of symmetry
		//by the distance between it and n.
		else 
        {
			return this.lineOfSymmetry - (n - this.lineOfSymmetry);
		}
	};


	//when the tool is deselected update the pixels to just show the drawing and
	//hide the line of symmetry. Also clear options
	this.unselectTool = function() 
    {
		updatePixels();
		//clear options
		select(".options").html("");
	};

	//adds a button and click handler to the options area. When clicked
	//toggle the line of symmetry between horizonatl to vertical
	this.populateOptions = function() 
    {
		select(".options").html(
			"<button id='directionButton'>Make Horizontal</button>");
		// 	//click handler
		select("#directionButton").mouseClicked(function() 
        {
			var button = select("#" + this.elt.id);
			if (self.axis == "x") 
            {
				self.axis = "y";
				self.lineOfSymmetry = height / 2;
				button.html('Make Vertical');
			} 
            else 
            {
				self.axis = "x";
				self.lineOfSymmetry = width / 2;
				button.html('Make Horizontal');
			}
		});
	};
}