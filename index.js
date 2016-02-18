"use strict";

process.chdir(__dirname);

let ffmpeg = require('fluent-ffmpeg'),
	ColorThief = require('color-thief'),
	fs = require('fs');

let utils = {

	saveScreensForVid: function(vidPath, callback){
		let proc = ffmpeg(vidPath),
			self = this,
			screensDir = './~screens';

		proc.screenshots({
	    	count: 20,
	    	filename: '%f-thumbnail-%s.png',
	    	folder: screensDir
	  	});

	  	proc.on('end', function(){
	  		var paths = fs.readdirSync(screensDir);
	  		paths = paths.filter(path => /\.png$/.test(path));
	  		paths = paths.map(path => screensDir+'/'+path);
	  		callback(paths);
	  	});
	},

	removeScreens: function(screenPaths){
		for(let i = 0; i < screenPaths.length; i++){
			fs.unlinkSync(screenPaths[i]);
		}
	},

	getColorPalletteFromScreens: function(screenPaths){
		var colors = [],
			finalColors = [];

		//get color palette per image
		for(let i = 0; i < screenPaths.length; i++){
			var imgColors = new ColorThief().getPalette(screenPaths[i]);
			colors = colors.concat(imgColors);
		}

		//check for duplicate colors
		colors.forEach(function(color){
			for(let i = 0; i < finalColors.length; i++){
				let finalColor = finalColors[i];
				if(color[0] === finalColor[0] && color[1] === finalColor[1] && color[2] === finalColor[2]){
					//current color already exists in finalColors
					return;
				}
			}

			//if color is not in finalColors yet, add it
			finalColors.push(color);
		});

		return finalColors;
	}
};

module.exports = {
	getPaletteForVid: function(vidPath, callback){
		utils.saveScreensForVid(vidPath, function(screenPaths){
			var palette = utils.getColorPalletteFromScreens(screenPaths);
			utils.removeScreens(screenPaths);
			callback(palette);
		});
	}
};