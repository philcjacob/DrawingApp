function FreehandTool()
{
	//set an icon and a name for the object
	this.icon = "assets/freehand.jpg";
	this.name = "Freehand";

	//to smoothly draw at all speeds we'll draw a curve from the previous 
	//mouse locations to the current mouse location. The following array stores
	//the locations from the last three frames plus the current.
	//we haven't started drawing yet, so it begins empty.
    
    var mouseHist = [];

	this.draw = function()
    {
		//if the mouse is pressed
		if(mouseIsPressed)
        {
            //store current mouse position at the end of the array
            mouseHist.push([mouseX, mouseY]);
            
            if (mouseHist.length == 4)
            {
                //if length is 4, we have enough XY pairs stored to build a curve
                push();
                noFill();
                curve(mouseHist[0][0], mouseHist[0][1], mouseHist[1][0], mouseHist[1][1], 
                      mouseHist[2][0], mouseHist[2][1], mouseHist[3][0], mouseHist[3][1]);
                pop();
                //shift the array to remove the oldest location and prep for next push()
                mouseHist.shift();
            }			
		}
		//if the user has released the mouse we empty the array to ready it for next press
		else
        {
            mouseHist = [];
		}
	};
}