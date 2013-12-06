/*
*	CO-LETTER-ALL
*	a javascript game
*	Developed by Milorad Filipovic [mrdosija@gmail.com]
*/
$(document).ready(function() {
	var player = $("#player");
	var body = $("body");
	var collected = $("#collected");
	var uncollected = $("#uncollected");
	var levelDiv = $("#levelDiv");
	var winHeight = $(window).height();
	var letters = $(".letter");
	
	var level = 1;
	var collectedCount = 1;
	//word that needs to be collected each level
	var word ;
	//speed of falling letters (time needed for letter to fall)
	var speed = 1500;
	
	//gap to next letter in the word
	var nextGap =getNextGap();
	var letterCount = 0;
	
	//timer for letter generation
	var createInterval;
	
	var alphabet = new Array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z");
	
	// 'start game' click
	$("#menu #startButton").click(function() {
		$(".letter").remove();
		$("#menu").fadeOut('slow', function() {
			$("#game").slideDown('fast', function(){startGame()});
		});
		return false;
	});
	
	function startGame() {
		$("*").css({"cursor":"none"});
		//new letter is created every 300 miliseconds
		createInterval = setInterval(dropLetter, 300);
		
		//move player div by moving mouse
		$(document).mousemove(function(event ) {
			var width = player.width();
			var height = player.height();
			player.offset({left: event.pageX - width/2, top: event.pageY - height/2});
		});
		initLevel(level);
		return false;
	}
	
	//generate random letter on random x location and make it fall
	function dropLetter() {
		var newDiv = createLetter();
		body.append(newDiv);
		
		//animate letter fall with collision detection on each step
		//and remove letter when it falls out of the screen
		newDiv.animate({top : winHeight+'px'}, 
			{
				duration: speed,
				step: function() {
					checkCollision(newDiv);
				}
			}, function() {
				newDiv.remove();
				newDiv = null;
				delete newDiv;
			}
		);
		return false;
	}

	//checks if letter has hit the player
	function checkCollision(letter) {
		var x1 = letter.offset().left;
     	var y1 = letter.offset().top;
      	var h1 = letter.outerHeight(true);
      	var w1 = letter.outerWidth(true);
      	var b1 = y1 + h1;
      	var r1 = x1 + w1;
      	var x2 = player.offset().left;
      	var y2 = player.offset().top;
      	var h2 = player.outerHeight(true);
      	var w2 = player.outerWidth(true);
      	var b2 = y2 + h2;
      	var r2 = x2 + w2;
		
		var collision = b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2;
      	if (!collision) {
			letterHit(letter);
		}
	}
	
	//when player hits letter, checks if it is right letter
	function letterHit(letterDiv) {
			var letter = letterDiv.text();
			var nextLetter = word.charAt(collectedCount);
			
			//if correct letter is hit
			if(letter == nextLetter) {
				//if all letters are collected
				if(collectedCount == word.length-1) {
					if(level < 12) {
						level++;
					}
					collectedCount = 1;
					initLevel();
				}else {
					collectedCount++;
				}
			}else {
				if(collectedCount > 1) {
					collectedCount--;
				}else {
					if(level > 1) {
						level--;
						initLevel();
					}else {
						//GAME OVER
						gameOver();
					}
				}
			}
			updateTexts();
			
			//remove the element
			letterDiv.remove();
			letterDiv = null;
			delete letterDiv;
			return false;
	}
	
	function gameOver() {
		$(document).unbind('mousemove');
		clearInterval(createInterval);
		$("#menu #title").text("GAME OVER!");
		$("#game").slideUp('fast', function(){
			$("#menu").fadeIn();
		});
		$("*").css({"cursor":"auto"});
		$("#startButton").css({"cursor":"pointer"});
	}
	
	//creates a div element with random letter on random x location
	//but favorizing next letter in the winning word, so the player don't have to wait long for it
	function createLetter() {
		//page is divided into 30px slots in which each new letter is created
		//each letter is generated in random slot
		var slotCount = Math.floor($(this).width()/30)-1;
		var randomSlot = Math.floor((Math.random() * slotCount)+1);
		var letter = getRandomLetter();
		if(letterCount == nextGap) {
			letter = word.charAt(collectedCount);
			letterCount = 0;
			nextGap = getNextGap();
		}else {
			letterCount++;
		}
	
		var newDiv = $(document.createElement('div')).text(letter);
		newDiv.addClass("letter");
		newDiv.css({"left":randomSlot*30, "top": -10});
		return newDiv;
	}
	
	//gets random letter of alphabet
	function getRandomLetter() {
		var limit = alphabet.length;
		return alphabet[Math.floor((Math.random()*limit)+0)];
	}
	
	//initialize values for next level
	function initLevel() {
		switch(level) {
			case 1:
 				 var limit = words_level_1_array.length;
				 var randomIndex = Math.floor((Math.random()*limit)+0);
				 word = words_level_1_array[randomIndex];
  				break;
			case 2:
  				var limit = words_level_2_array.length;
				var randomIndex = Math.floor((Math.random()*limit)+0);
				word = words_level_2_array[randomIndex];
  				break;
			case 3:
  				var limit = words_level_3_array.length;
				var randomIndex = Math.floor((Math.random()*limit)+0);
				word = words_level_3_array[randomIndex];
  				break;
			case 4:
  				var limit = words_level_4_array.length;
				var randomIndex = Math.floor((Math.random()*limit)+0);
				word = words_level_4_array[randomIndex];
  				break;
			case 5:
  				var limit = words_level_5_array.length;
				var randomIndex = Math.floor((Math.random()*limit)+0);
				word = words_level_6_array[randomIndex];
  				break;
			case 6:
  				var limit = words_level_6_array.length;
				var randomIndex = Math.floor((Math.random()*limit)+0);
				word = words_level_6_array[randomIndex];
  				break;
			case 7:
  				var limit = words_level_7_array.length;
				var randomIndex = Math.floor((Math.random()*limit)+0);
				word = words_level_7_array[randomIndex];
  				break;
			case 8:
  				var limit = words_level_8_array.length;
				var randomIndex = Math.floor((Math.random()*limit)+0);
				word = words_level_8_array[randomIndex];
  				break;
			case 9:
  				var limit = words_level_9_array.length;
				var randomIndex = Math.floor((Math.random()*limit)+0);
				word = words_level_9_array[randomIndex];
  				break;
			case 10:
  				var limit = words_level_10_array.length;
				var randomIndex = Math.floor((Math.random()*limit)+0);
				word = words_level_10_array[randomIndex];
  				break;
			case 11:
  				var limit = words_level_11_array.length;
				var randomIndex = Math.floor((Math.random()*limit)+0);
				word = words_level_11_array[randomIndex];
  				break;
			case 12:
  				var limit = words_level_12_array.length;
				var randomIndex = Math.floor((Math.random()*limit)+0);
				word = words_level_12_array[randomIndex];
  				break;
		}
		updateTexts();
		return false;
	}
	
	function updateTexts() {
		var coll = word.substring(0, collectedCount);
		var uncoll = word.substring(collectedCount, word.length);
		collected.text(coll);
		uncollected.text(uncoll);
		levelDiv.text("level-" + level);
		player.html(word.substring(0,collectedCount));
		return false;
	}
	
	//generates random number 3-8
	function getNextGap() {
		return Math.floor((Math.random()*8)+3);
	}
	
});