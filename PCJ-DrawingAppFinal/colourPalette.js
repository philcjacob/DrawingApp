//Displays and handles the colour palette.
// TODO: Add swatch capture support (add swatch if canvas has color -or- add swatch for each color picker value change)

function ColourPalette() 
{
    //select the colorPicker element
    var colorPicker = select('#colorPicker');
    colorPicker.style('margin-top', '5px');
    
    // create the file input and place it with the other palette controls
    var fInput = createFileInput(swatchesFromImage);
    fInput.parent("#colorPBox");
    
    var alphaRange = select('#alphaRange');
    var initialRun = true;
	var self = this;
    
    this.swatches = [];
    this.selectedSwatch;

    
	var colourClick = function() 
    {
		//get the new colour from the colorPicker input element and 
        //the opacity from the alphaRange input element
        var c = color(colorPicker.value());
        var alphaVal = alphaRange.value();
        
        //manually set the alpha of the color object (to make P5 happy)
        c._array[3] = alphaVal / 255;
        
        self.currentColor = c;
		
        //set the selected colour and fill and stroke
		fill(self.currentColor);
		stroke(self.currentColor);        
	}
    
    
    // this function was adapted from the code snippet found here: 
    //              https://stackoverflow.com/questions/58987477/generating-a-color-palette-from-image-using-p5-javascript
    //
    // I found there was really no benefit to pulling the top colors after sorting, as the most used colors are near identical to
    // each other for most images. To increase variety of generated swatches, I pull random colors from the array of the input image's colors instead. 
    function swatchesFromImage(file) 
    {
        var swatchList = [];
        if (file.type === 'image')
        {
            // do the processing with the callback to make sure the image is
            // completely loaded before we do anything to it
            loadImage(file.data, img => {
                // resize the image because cameras are insane in the future
                // and we don't want to torture our browser
                img.resize(100,0);
                img.loadPixels();
                
                for (i = 0; i < img.pixels.length; i += 4)
                {
                    var r = img.pixels[i];
                    var g = img.pixels[i+1];
                    var b = img.pixels[i+2];
                    
                    var hx = "#" + hex(r, 2) + hex(g, 2) + hex(b, 2);
                    
                    var temp = swatchList.find((color) => {
                        return color.hx == hx;
                    });
                                        
                    if (!temp)
                    {
                        swatchList.push(hx);
                    }
                }
                
                // add up to 35 swatches from the input image, as that is how many will fit comfortably
                for (i = 0; i < 35; i++)
                {
                    var r = floor(random(swatchList.length));
                    
                    if (!self.swatches.includes(swatchList[r]))
                    {
                        self.swatches.push(swatchList[r]);
                    }
                }
                self.loadSwatches();
            });
        }
        else 
        {
            img = null;
        }
    }
    
    
    var swatchClick = function() 
    {
        var c = this.id().split("Swatch")[0];
        
        self.selectedSwatch = c;
        colorPicker.value(self.selectedSwatch);
        var alphaVal = alphaRange.value();
        
        // apply the current opacity slider value to the clicked color
        var newColor = color(self.selectedSwatch);
        newColor._array[3] = alphaVal / 255;
        
        fill(newColor);
        stroke(newColor);
    }
    
    
	//handle the color and alpha change events
    //run once at load to map initial color/alpha values to their inputs
	this.loadColours = function() 
    {
        if (initialRun) 
        {
            colourClick();
            initialRun = false;
        }
        colorPicker.changed(colourClick);
        alphaRange.changed(colourClick);
	};
    
    
    //adds divs for each swatch color to the swatchBox and the add/clear controls to the colourPalette box
    this.loadSwatches = function() 
    {
        var addButton = select("#addSwatchButton");
        addButton.mouseClicked(addSwatch);
        
        var clearButton = select("#clearSwatchesButton");
        clearButton.mouseClicked(function() 
        {
            self.swatches = []; 
            self.loadSwatches();
        });
        
        // Clear the swatchBox to prevent attempts to add duplicate swatches
        select(".swatchBox").html("");
        
        // prevents swatches from displaying into infinity
        while (this.swatches.length > 35)
            this.swatches.shift();
        
        for (i = 0; i < this.swatches.length; i++) 
        {
            var swatchID = this.swatches[i] + "Swatch";
            var swatchDiv = createDiv();
            swatchDiv.class('colourSwatches');
            swatchDiv.id(swatchID);
            
            select(".swatchBox").child(swatchDiv);
            select("#" + swatchID).style("background-color", this.swatches[i]);
            swatchDiv.mouseClicked(swatchClick);
        }
    }
    
    
    // handle adding new swatch to swatchBox
    var addSwatch = function() 
    {
        var cpVal = colorPicker.value();
        
        if (!self.swatches.includes(cpVal)) 
        {
            self.swatches.push(cpVal);
            self.loadSwatches();
        }
    }
    
    
	//call the loadColours function now it is declared
	this.loadColours();
    this.loadSwatches();



}