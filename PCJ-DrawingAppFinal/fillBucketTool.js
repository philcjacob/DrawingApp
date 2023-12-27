function fillBucketTool() 
{
	//set an icon and a name for the object
	this.icon = "assets/bucket.jpg";
	this.name = "Paint Bucket";
    
    var self = this;
    
    /*
        The below code was adapted from a Stack Overflow answer, located here:
                https://stackoverflow.com/questions/63803791/flood-fill-tool-p5-js
    */
    
    var d = pixelDensity();
    var colorPicker = select('#colorPicker');
    
    // gets the color of the pixel at coordinate (x, y) by reading the pixels array and returning 
    // values in an array of shape [r, g, b, a]
    this.getPixelData = function(x, y) 
    {
        var colour = [];
        for (var i = 0; i < d; ++i) 
        {
            for (var j = 0; j < d; ++j) 
            {
                let idx = 4 * ((y * d + j) * width * d + (x * d + i));
                colour[0] = pixels[idx];
                colour[1] = pixels[idx+1];
                colour[2] = pixels[idx+2];
                colour[3] = pixels[idx+3];
            }
        }
        return colour;
    }
    
    
    // sets the color of the input pixel by manipulating the pixels array directly
    this.setPixelData = function(x, y, colour) 
    {
        for (var i = 0; i < d; ++i) 
        {
            for (var j = 0; j < d; ++j) 
            {
                let idx = 4 * ((y * d + j) * width * d + (x * d + i));
                pixels[idx]   = colour[0];
                pixels[idx+1] = colour[1];
                pixels[idx+2] = colour[2];
                pixels[idx+3] = colour[3];
            }
        }
    }
    
    
    // quick string formatting function for index keys
    this.getKey = function(pos) 
    {
        return "" + pos.x + "_" + pos.y;
    }
    
    
    // function to compare two colors and return a boolean value representing the result
    this.matchColour = function(pos, oldColour) 
    {
        var current = this.getPixelData(pos.x, pos.y);
        
        return (current[0] === oldColour[0] && current[1] === oldColour[1]
                && current[2] === oldColour[2] && current[3] === oldColour[3]);
    }

    
    // check to see if the pixel already exists in the list of pixels that need to be drawn
    this.checkPixel = function(pos, positionSet) 
    {
        return ! positionSet.hasOwnProperty(this.getKey(pos));
    }
           
    
    // only adds to stack after confirming the same pixel hasn't already been added
    this.addPixelToDraw = function(pos, pixelList, stack) 
    {
        if (this.checkPixel(pos, pixelList)) 
        {
            stack.push(pos);
            pixelList[this.getKey(pos)] = 1;
        }
    }    
    
    
    // function implementing the 4-way flood fill algorithm
    this.fourWayFill = function(x, y) 
    {
        var stack = [];
        var pixelList = {};
        
        var first = {'x': x, 'y': y};
        stack.push(first);
        pixelList[ this.getKey(first) ] = 1;
        
        // load pixels to populate the pixels array
        loadPixels();
        var newColour = color(colorPicker.value());
        var firstColour = this.getPixelData(x, y);
        
        // loop as long as there are pixels to draw to
        while (stack.length > 0) 
        {
            // remove the pixel we're drawing to
            var pos1 = stack.pop();
            
            // apply new color to that pixel
            this.setPixelData(pos1.x, pos1.y, [red(newColour), green(newColour), blue(newColour), alpha(newColour)]);
            
            // store objects representing each cardinal direction adjacent pixels
            var up = {'x':pos1.x,  'y':pos1.y-1};
            var dn = {'x':pos1.x,  'y':pos1.y+1};
            var le = {'x':pos1.x-1,'y':pos1.y};
            var ri = {'x':pos1.x+1,'y':pos1.y};
            
            // preemptively check the adjacent pixels' (top, right, up, down) colors and add to stack if they match the first color
            // so that we know it needs to be drawn
            if (0 <= up.y && up.y < height && this.matchColour(up, firstColour)) this.addPixelToDraw(up, pixelList, stack);
            if (0 <= dn.y && dn.y < height && this.matchColour(dn, firstColour)) this.addPixelToDraw(dn, pixelList, stack);
            if (0 <= le.x && le.x < width  && this.matchColour(le, firstColour)) this.addPixelToDraw(le, pixelList, stack);
            if (0 <= ri.x && ri.x < width  && this.matchColour(ri, firstColour)) this.addPixelToDraw(ri, pixelList, stack);
        }
        // apply changes to the canvas
        updatePixels();
    }
    
    
    this.draw = function() 
    {
        if (mouseIsPressed && mouseX > 0) 
        {
            // if mouse is clicked, fill the shape with the current color
            // also prevents drawing when clicking another tool after first selecting this one
            self.fourWayFill(mouseX, mouseY);
        }
    };
}