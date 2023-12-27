function SprayCanTool(){
	
	this.name = "Spray Can";
	this.icon = "assets/sprayCan.jpg";

	var points = 40;
	var spread = 10;

	this.draw = function()
    {
		var r = random(5,10);
        
		if(mouseIsPressed)
        {
			for(var i = 0; i < points; i++)
            {
				point(random(mouseX-spread, mouseX + spread), random(mouseY-spread, mouseY+spread));
			}
		}
	};
}