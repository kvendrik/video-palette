"use strict";

let videoPalette = require('../');

videoPalette.getPaletteForVid(__dirname+'/bbc-new-blooper.mp4', function(palette){
	let HTMLstr = '<style>div { width: 80px; height: 80px; float: left; }</style>';

	palette.forEach(function(rgbColor){
		HTMLstr += '<div style="background-color: rgba('+rgbColor[0]+', '+rgbColor[1]+', '+rgbColor[2]+', 1);"></div>';
	});

	//a html string to view the color palette with
	console.log(HTMLstr);
});