function BrushTool() 
{
	//set an icon and a name for the object
	this.icon = "assets/brush.jpg";
	this.name = "Brush";
    
    var bShape = "square";
    var bSizeOffset;
    var pRate;
    var lerpStep;
    var previousShape;
    var opacity;
    var canvasContainer = select('#content');
    
    
	this.draw = function() 
    {
        // if size and polling rate are null, read the current value of the DOM elements
        // and apply the proper values
        if (!bSizeOffset)
        {
            bSizeOffset = select("#sizeRange").value() / 2;
        }
        
        if (!pRate) 
        {
            pRate = select("#pollingRange").value();
            lerpStep = 1 / (pRate + 1);
        }
             
        push();
        noStroke();
		//if the mouse is pressed        
		if(mouseIsPressed && mouseX > 0 && mouseY < canvasContainer.size().height - 10) 
        {
            if (!previousShape) 
            {
                if (bShape == "square") 
                {
                    rect(mouseX - bSizeOffset, mouseY - bSizeOffset, 
                        bSizeOffset * 2, bSizeOffset * 2);
                }
                else if (bShape == "round") 
                {
                    ellipse(mouseX, mouseY, bSizeOffset * 2);
                }
            }
            else 
            {   
                for (i = 0; i < pRate; i++) 
                {
                    // calculate a number of in-between coordinates based onthe value of pRate,
                    // then draw the appropriate shapes at those coordinates
                    var lerpX = lerp(previousShape[0], mouseX, lerpStep * i);
                    var lerpY = lerp(previousShape[1], mouseY, lerpStep * i);
                    
                    if (bShape == "square") 
                    {
                        rect(lerpX - bSizeOffset, lerpY - bSizeOffset, 
                            bSizeOffset * 2, bSizeOffset * 2);
                    }
                    else if (bShape == "round") 
                    {
                        ellipse(lerpX, lerpY, bSizeOffset * 2);
                    }                    
                }                
            }
            previousShape = [mouseX, mouseY];
        }        
		//if the user has released the mouse we empty the array to ready it for next press
		else 
        {
            previousShape = [];
		}
        pop();
	};
    
    
    this.unselectTool = function() 
    {
		//clear options
		select(".options").html("");
        // reset stroke weight to its normal value
        strokeWeight(1);
	};

    
    //adds controls and handlers to the options area for
	//Brush size, shape, and polling rate
	this.populateOptions = function() 
    {
        // Determines which shape is selected when the tool is selected. This allows it to remember the previous setting.
        if (bShape == "square")
        {
            select(".options").html(
                "<form><label for='sizeRange'>Brush Size</label><input type='range' id='sizeRange' min='1' max='50' value='10'><br>" +
                "<input type='radio' id='square' name='brushShape' value='square' checked><label for='square'>Square</label>" + 
                "<input type='radio' id='round' name='brushShape' value='round'><label for='square'>Round</label><br>" +
                "<label for='pollingRange'>Polling Rate</label><input type='range' id='pollingRange' min='1' max='9' value='9'></form>");          
        }
        else
        {
            select(".options").html(
			    "<form><label for='sizeRange'>Brush Size</label><input type='range' id='sizeRange' min='1' max='50' value='10'><br>" +
                "<input type='radio' id='square' name='brushShape' value='square'><label for='square'>Square</label>" + 
                "<input type='radio' id='round' name='brushShape' value='round' checked><label for='square'>Round</label><br>" +
                "<label for='pollingRange'>Polling Rate</label><input type='range' id='pollingRange' min='1' max='9' value='9'></form>");            
        }

        // Memory for brush size
        if (bSizeOffset)
            select("#sizeRange").value(bSizeOffset * 2);
        else
            select("#sizeRange").value(10);
        
        // Memory for polling rate
        if (pRate)
            select("#pollingRange").value(pRate);
        else
            select("#pollingRange").value(9);
        
        
		select("#sizeRange").changed(function() 
        {
			var range = select("#" + this.elt.id);
            strokeWeight(range.value());
            bSizeOffset = range.value() / 2;
		});
        
        select("#square").mouseClicked(function() 
        {
            bShape = "square";
        });
        
        select("#round").mouseClicked(function() 
        {
            bShape = "round";
        });
        
        select("#pollingRange").changed(function() 
        {
			var range = select("#" + this.elt.id);
            pRate = range.value();
            // converts pRate into a value we can plug into the lerp function
            lerpStep = 1 / (pRate + 1);
		});
	};
}