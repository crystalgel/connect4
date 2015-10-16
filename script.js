//*wrap everything in document ready function so you wait for the DOM to load
$(document).ready(function() {

	var win_count = 0;

	$(function create_chips() {

		for (var x = 0; x < 84; x++) { // make chips. 42x=84
			create_circle(x);
			}
	});

	function create_circle(x) {
		var circle = document.getElementsByTagName('canvas')[x].getContext('2d');
		var image = null;
		if (x > 41 && x < 63) {
			image= 'carina.png';
		} else if (x > 62 && x < 84) {
			image = 'xbruttino.png';
		} else {
			circle.beginPath();
			circle.arc(40, 40, 40, 0, 2 * Math.PI, false);
			circle.fillStyle = 'white';
			circle.fill();
		}

		if (image) {
			//circle.arc(40, 40, 39.5, 0, 2 * Math.PI, false);
			var img = new Image();
			img.onload = function() {
				circle.drawImage(this, -20, -45);

			}
			//carina.src = color === "red" ? "carina.png" : "xbruttino.png";
			img.src= image
		}
	}

	$(function mark_playable_squares() { // add 'can_place' class for bottom row.
		for (i = 36; i < 43; i++) {
			$('#' + i).addClass('can_place');
		}
	});

//this function returns an array to landing_square_result.
	function find_landing_square(column_dropped_on) {
//For loop. If dropped in square 1, the loop id going to start at 36 and its
//going to loop backwards, subtracting 7 each time. It's looping backwards.
//We iterate backwards and minus 7 each time.
		for (i = column_dropped_on + 35; i >= column_dropped_on; i -= 7) {
			var iterated_square = $('#' + i); //this is document.getElementByID in jQuery. We are getting a hold of that div it was dropped on.
			var iterated_square_num = iterated_square.attr('id'); //this is an object. It's returning the div. We are getting the number (the divs ID).

//If the iterated square has the class of 'can_place'(this will be true), we return the array back which includes the distance from top to 6 (how far it has to go down), and the iterated square number.
			if (iterated_square.hasClass('can_place')) {
				if (iterated_square_num > 35) {
					return ['503px', iterated_square_num];
				} else if (iterated_square_num > 28) {
					return ['419px', iterated_square_num];
				} else if (iterated_square_num > 21) {
					return ['335px', iterated_square_num];
				} else if (iterated_square_num > 14) {
					return ['251px', iterated_square_num];
				} else if (iterated_square_num > 7) {
					return ['167px', iterated_square_num];
				} else {
					return ['83px', iterated_square_num];
				}
			}
		}
	}
/////////////////CHECK FOR WINNERS/////////////////////////

	function check_for_win(color, square) {

		function four_in_a_row_check() {
			if ($('#' + i).hasClass(color)) {
				win_count += 1;
				if (win_count == 4) { return true; }
			} else {
				win_count = 0;
			}
		}

		function check_horiz_win(color, square) {
			win_count = 0;
			for (i = square; i < square + 7; i += 1) {
				if (four_in_a_row_check()) {
					return true;
				}
			}
		}

		// check for VERTICAL win
		var original_square = square;
		while (square > 7) {
			square -= 7;
		}
		for (i = square; i < 43; i += 7) {
			if (four_in_a_row_check()) {
				return true;
			}
		}
		var square = original_square;

		// check for HORIZONTAL win
		var left_squares = [1, 8, 15, 22, 29, 36];
		var in_array = jQuery.inArray(square, left_squares);

		if (in_array > -1) {
			if (check_horiz_win(color, square)) {
				return true;
			}
		} else {
			while (result = jQuery.inArray(square, left_squares) == -1) {
				square -= 1;
				if (result = jQuery.inArray(square, left_squares) !== -1) {
					if (check_horiz_win(color, square)) {
						return true;
					}
				}
			}
		}

		// check for DIAGNAL win
		win_count = 0;
		var square = original_square;
		var top_left_bottom_right = [];

		//check from top left to bottom right first
		while ((square > 8 && square < 43)) { // get squares left of current one
			var square = square - 8;
			var iterated_square = $('#' + (square));
			var id = parseInt(iterated_square.attr('id'));
			if  (iterated_square.hasClass(color)) {
				top_left_bottom_right.push(id);
			}
		}
		var square = original_square;
		top_left_bottom_right.push(parseInt($('#' + (square)).attr('id'))); // add current square to array

		while ((square > 0 && square < 35) && $('#' + square).hasClass(color)) { // get squares right of current one
			var square = square + 8;
			var iterated_square = $('#' + (square));
			var id = parseInt(iterated_square.attr('id'));
			if  (iterated_square.hasClass(color)) {
				top_left_bottom_right.push(id);
			}
		}

		top_left_bottom_right.sort(function(a,b) { return a-b } ); // sort numerically ascending

		for (j = 0; j < top_left_bottom_right.length; j++) {
			i = top_left_bottom_right[j];
			if (four_in_a_row_check()) {
				return true;
			}
		}

		// now check from bottom left to top right
		win_count = 0;
		var square = original_square;
		var bottom_left_top_right = [];

		while ((square > 7 && square < 43)) { // get squares right of current one
			var square = square - 6;
			var iterated_square = $('#' + (square));
			var id = parseInt(iterated_square.attr('id'));
			if  (iterated_square.hasClass(color)) {
				bottom_left_top_right.push(id);
			}
		}
		var square = original_square;
		bottom_left_top_right.push(parseInt($('#' + (square)).attr('id'))); // add current square to array

		while ((square > 0 && square < 35) && $('#' + square).hasClass(color)) { // get squares left of current one
			var square = square + 6;
			var iterated_square = $('#' + (square));
			var id = parseInt(iterated_square.attr('id'));
			if  (iterated_square.hasClass(color)) {
				bottom_left_top_right.push(id);
			}
		}

		bottom_left_top_right.sort(function(a,b) { return a-b } ); // sort numerically ascending

		for (j = 0; j < bottom_left_top_right.length; j++) {
			i = bottom_left_top_right[j];
			if (four_in_a_row_check()) {
				return true;
			}
		}
		return false; // no horizontal, vertical or diagonal win found
	}

////////////WINNER///////////////////////////////////////////////////////

	function winner(color) {

		if (color == 'carina') {
			var letters = ['CARINA WINS!'];
			console.log('carina wins');
		} else {
			var letters = ['B','R','U','T','T','I','N','N','O',' ','W','I','N','S','!'];
			console.log('bruttino wins')
		}
		var tiles = [9, 10, 11, 12, 13, 23, 24, 25, 26, 27];

		setTimeout(function() {

			$('canvas').css('visibility','hidden');
			$('.drop_spot').css('background-color','white');

			for (i = 0; i < 10; i++) {
				$('#' + tiles[i]).html('<h1>' + letters[i] + '</h1>');
			}
		}, 500);

		setTimeout(function() { window.location = document.URL; }, 5000);
	}

	$('.draggable').draggable({
		//draggable is the characters. jQuery ui selecting all elements with class
		//of dragable and giving the METHOD draggable.
		//passing in an object literal. documented on jquery ui website.
		//PROPERTIES
		cancel: '.played',
		snap: ".droppable",
		snapMode: "inner",
		snapTolerance: 40,
		containment: 'document',
		cursor: 'pointer',
		stack: 'canvas',
		axis: 'x',
		revert: 'invalid'
	});

	$('.droppable').droppable({
		//The first row of squares at the top. Passing in an object literal.
		//event is the droppable square and ui is the draggable character.
        drop: function(event, ui) {

        	$('canvas.last_played').removeClass('last_played');

			if ($(ui.draggable)) {

				var current_color = $(ui.draggable).hasClass('carina') ? 'carina' : 'xbruttino';
				var next_color = $(ui.draggable).hasClass('carina') ? 'xbruttino' : 'carina';

				$('.' + current_color).draggable({ disabled: true });
				$('.' + next_color).draggable({ disabled: false });

				//'.this' - reffers to the droppable square. We get the ID of that
				// 1_chip_target. That will change to 1.
				var drop_square_number = parseInt($(this).attr('id'));
				//Get the landing_square_results. Distance is set to the first elemet of that array. The square_to_land_on is set to the second element of that array.
				var landing_square_results = find_landing_square(drop_square_number);

				var distance = landing_square_results[0];
				var square_to_land_on = parseInt(landing_square_results[1]);

//animations.
				$(ui.draggable).animate(
					{ top:distance });
					//300,
					//'linear',
					//function() {
					//}
				//);

//Removing class of 'can_place' and adding "cannot_place". Adding "can_place to square above it"
				$('#' + square_to_land_on).removeClass('can_place').addClass('cannot_place ' + current_color);
				$('#' + (square_to_land_on - 7)).addClass('can_place');

//if the square_to_land_on has an ID less than 8 (which is the top row), we are disabling the droppable function.  remove the droppable. This keeps the player from being able to drag the chip around after they dropped it. It keeps the chip in place.
				if ($('#' + square_to_land_on).attr('id') < 8) {
					$(this).droppable({ disabled: true }); //cannot be moved anymore.
				}

				var result = check_for_win(current_color, square_to_land_on);

				if (result == true) {
					winner(current_color);
				}


				$(ui.draggable).addClass('last_played played');

       		}


				}
			});

	$('#reset').click(function() {
		window.location = document.URL;
	});
});
