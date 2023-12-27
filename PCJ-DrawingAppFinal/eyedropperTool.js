function Eyedropper() 
{
    this.icon = "assets/eyedropper.jpg";
	this.name = "Eyedropper";
    
    var pulledColor;
    var colorPicker = select("#colorPicker");
    var alphaRange = select('#alphaRange');
    var canvasContainer = select('#content');
    
    // function to convert rgb color values to hex, so that we can
    // set the value of the color picker
    this.rgbToHex = function(r, g, b) 
    { 
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color";
        
        var hx = "#" + hex(r, 2) + hex(g, 2) + hex(b, 2);
        return hx;
    }
    
    
    this.draw = function() 
    {
        if (mouseIsPressed && mouseX > 0 && mouseY < canvasContainer.size().height - 10) 
        {
            // get the color of the pixel at the mouse location
            pulledColor = get(mouseX, mouseY);
            var alphaVal = alphaRange.value();
            
            // change the value of color picker DOM element to the pulled color
            colorPicker.value(this.rgbToHex(red(pulledColor), green(pulledColor), blue(pulledColor)));
           
            var newColor = color(red(pulledColor), green(pulledColor), blue(pulledColor), alphaVal);
            
            // set stroke/fill to the pulled color
            fill(newColor);
            stroke(newColor);
        }
    }
}