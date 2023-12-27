function BlendTool() 
{
	//set an icon and a name for the object
	this.icon = "assets/finger.jpg";
	this.name = "Blend";
    
    var speed = 8;
    var firstPixel = [];
    var secondPixel = [];
    var pix1;
    var pix2;
    
    this.draw = function() 
    {
        if (mouseIsPressed && mouseX > 0) 
        {
            loadPixels();
            for (i = 0; i < speed; i++) 
            {
                // generate two random coordinate pairs
                firstPixel = [random(mouseX - 5, mouseX + 5),  random(mouseY - 5, mouseY + 5)];
                secondPixel = [random(mouseX - 5, mouseX + 5),  random(mouseY - 5, mouseY + 5)];
                
                // get the color of each
                pix1 = get(firstPixel[0],firstPixel[1]);
                pix2 = get(secondPixel[0], secondPixel[1]);
                
                // lerp the rgb values to get the in-between color
                var opacity = select("#alphaRange").value();
                var newColor = color(lerp(red(pix1), red(pix2), 0.5), lerp(green(pix1), green(pix2), 0.5), 
                                     lerp(blue(pix1), blue(pix2), 0.5), opacity);
                
                // draw ellipses, the number of which is determined by the speed var, with the new color at roughly the current mouse position
                push();
                fill(newColor);
                noStroke();
                
                // we nest the loops to get more to draw for each pass. It is painfully slow without the second loop.
                for (i = 0; i < speed; i ++)
                    ellipse(random(mouseX - 2, mouseX + 2),  random(mouseY - 2, mouseY + 2), 30);
                pop();
            }
        }
    }
}