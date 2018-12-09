//this game will have only 1 state
export default {

	//executed after everything is loaded
	create: function () {

		// Let's set a number of constants, so they can be changed later
		this.NUM_ROWS = 13;
		this.NUM_COLS = 13;
		this.NUM_CIRCLES = 13;
		this.BLOCK_SIZE = 20;
		this.SCALE_CIRCLE = this.BLOCK_SIZE / 85 * 0.6;
		this.GRID_WIDTH = 1;
		this.GRID_START_X = 40;
		this.GRID_START_Y = 40;
		this.GRID_END_X = this.NUM_COLS * this.BLOCK_SIZE;
		this.GRID_END_Y = this.NUM_ROWS * this.BLOCK_SIZE;

		// create a Rectangle frame around grid (invisible)
		this.frame = new Phaser.Rectangle(this.GRID_START_X, this.GRID_START_Y, this.GRID_END_X, this.GRID_END_Y);

		// Array for rectangles in grid
		this.rect = [];

		// matrix for grid, initialise with zeroes
		this.gridMatrix = [];
		for (var i = 0; i < this.NUM_COLS; i++) { // create an array per column
			this.gridMatrix.push([]);
			for (var j = 0; j < this.NUM_ROWS; j++) {
				this.gridMatrix[i].push(0); // fill each column with zeroes
			}
		}
		// initialise circle counter
		this.circlesLeft = this.NUM_CIRCLES;

		var style = { font: '15px Arial', fill: '#000' };
		this.game.add.text(350, 40, 'Drag all the circles from the centre\nand place them anywhere on the grid. ', style);
		this.game.add.text(350, 100, 'Circles left: ', style);

		style = { font: '25px Arial', fill: '#0d50bc' };
		this.circleScore = this.game.add.text(450, 95, '', style);

		this.refreshStats(0);

		// draw the grid
		this.drawGrid();

		// draw the circles
		this.drawCircles();

		// debugging
		this.result = '';
	},

	update: function () {
		//      this.refreshStats(0);
	},

	// draw grid
	drawGrid: function () {

		this.grid = this.game.add.graphics(this.GRID_START_X, this.GRID_START_Y);
		this.grid.lineStyle(this.GRID_WIDTH, '#000', 1);
		//       this.grid.boundsPadding = 0; // from default of 10

		/* draw the grid with graphics, Rows * Cols number of rectangles
		also create invisible rectangles of the same size on top of each (for snap to grid)
		*/
		for (var i = 0; i < this.NUM_COLS; i++) {
			for (var j = 0; j < this.NUM_ROWS; j++) {
				this.grid.drawRect((i * this.BLOCK_SIZE), (j * this.BLOCK_SIZE), this.BLOCK_SIZE, this.BLOCK_SIZE);
				this.rect.push(new Phaser.Rectangle(this.GRID_START_X + (i * this.BLOCK_SIZE), this.GRID_START_Y +
					(j * this.BLOCK_SIZE), this.BLOCK_SIZE, this.BLOCK_SIZE));
			}
		}
		this.grid.generateTexture(); // change graphics into texture to increase performance

	},

	drawCircles: function () {
		// draw circles in the centre of the grid, first move graphics pointer to the centre

		this.circles = this.game.add.group(); // group for all circles
		this.circles.enableBody = true;
		for (var i = 0; i < this.NUM_CIRCLES; i++) {
			this.circle = this.circles.create(this.frame.centerX, this.frame.centerY, 'circle');
			this.circle.inputEnabled = true;
			//circle.pixelPerfectClick = true;
			this.circle.input.enableDrag(true, true, true, '255', this.frame);
			this.circle.anchor.setTo(0.5);
			this.circle.scale.setTo(this.SCALE_CIRCLE);
			this.circle.body.collideWorldBounds = true;
			this.circle.moved = false;
			this.circle.events.onDragStart.add(this.onDragStart, this);
			this.circle.events.onDragStop.add(this.onDragStop, this);
		}
	},

	onDragStart: function (sprite) {
		console.log(this.circle.input.pointerDragged());
		sprite.frame = 2; // make circle grey whilst being dragged

		//        if (this.justAClick(sprite)) {return;} // if the user just clicked (no drag), do nothing

		// check if this is the initial move or subsequent move for circle
		if (sprite.moved) {
			// already moved. Capture current coordinates in a temp variable, tempCoord.
			this.tempXY = { x: sprite.x, y: sprite.y };
			this.tempCoord = this.getCoord(sprite);
			// debug
			//            console.log('already moved, on an occupied box ' + this.tempCoord.x + this.tempCoord.y + 'gridMatrix is ' + this.gridMatrix[this.tempCoord.y][this.tempCoord.x]);
			// reset the status in the grid to zero
			this.gridMatrix[this.tempCoord.y][this.tempCoord.x] = 0; // x is column, y is row
			// console.log('gridMatrix set to zero ' + this.gridMatrix[this.tempCoord.y][this.tempCoord.x]);

			return; // exit
		}
		else if (!sprite.moved) {
			// moved == false, Therefore it is the initial movement
			//           console.log('initial move');
			//           sprite.moved = true; // first move done
			// change sprite colour in spritesheet
		} else {
			throw new Error(console.log('something went wrong, ' + sprite.frame));
		}

		// debug
		this.result = 'dragging ' + sprite.key;
	},

	onDragStop: function (sprite) {
		console.log(this.circle.input.pointerDragged());
		console.log('dragStop event...')
		/*
		// First, we check for overlap with the whole grid frame and reset circle if out of bounds
		if (!Phaser.Rectangle.intersects(sprite.getBounds(), this.frame)) {
				this.resetCircle(sprite);
				console.log('out of bounds, resetting circle');
				return; // exit
		}
		*/
		// Second, we find the coordinates of the current location (within the frame)
		var coord = this.getCoord(sprite);
		// debug
		console.log(coord);
		this.seeGrid();

		// Third, we check if this is the location is occupied
		this.occupied = this.gridMatrix[coord.y][coord.x] === 1;

		if (!this.occupied && !sprite.moved) {
			// Not occupied AND initial movement, therefore occupy location
			this.gridMatrix[coord.y][coord.x] = 1; // occupy location
			sprite.moved = true; // mark circle as moved
			this.refreshStats(-1); // reduce counter as this is initial movement of circle
			this.snapToGrid(sprite); // snap to grid
			sprite.frame = 1; // change to blue colour, resting state
			console.log('Not OCC - 1st Move');
		}
		else if (!this.occupied && sprite.moved) {
			// Not occupied AND subsequent move (new location OR just up and down movement, i.e. same location)
			// Clear previous location first (IMPORTANT, if up and down movement)
			this.gridMatrix[this.tempCoord.y][this.tempCoord.x] = 0; //reset old location
			this.gridMatrix[coord.y][coord.x] = 1; // occupy location (either same or new)
			this.snapToGrid(sprite);
			sprite.frame = 1; // change to blue colour, resting state
			console.log('Not OCC - later Move');
		}
		else if (this.occupied && !sprite.moved) {
			// Occupied AND this is the initial movement of this circle
			// reset circle
			this.resetCircle(sprite);
			console.log(' OCC - 1st Move');
		}
		else if (this.occupied && sprite.moved) {
			// Occupied AND circle is being moved from previous location
			// move circle back to previous location and occupy it on the grid
			sprite.x = this.tempXY.x;
			sprite.y = this.tempXY.y;
			this.snapToGrid(sprite);
			this.gridMatrix[this.tempCoord.y][this.tempCoord.x] = 1; // occupy location (either same or new)
			sprite.frame = 1; // change to blue colour, resting state
			console.log(' OCC - later Move');
		}
		this.seeGrid(); // let's check the grid now

		/* check if there is already a circle on those coordinates
		if (this.gridMatrix[coord.y][coord.x] === 1 ) { //x is column, y is row
				this.resetCircle(sprite);
				this.seeGrid();
				return;
		} else if (sprite.moved) { // check if this is the initial move, if not, don't change counter
				// mark location of the circle in the grid matrix
				this.gridMatrix[coord.y][coord.x] = 1;
				this.seeGrid();
		} else {
				// initial move to an empty place - mark location of the circle in the grid matrix
				sprite.moved = true; // first move done
				this.gridMatrix[coord.y][coord.x] = 1;
				this.seeGrid();
				this.refreshStats(1);
*/

		this.result = 'dropped ' + sprite.key + sprite.position;
		this.result = sprite.key + " dropped at x:" + sprite.x + " y: " + sprite.y;
	},

	getCoord: function (sprite) {
		// find the coordinates of the sprite, as we now know the coordinates are within the frame
		var getCoord = { x: 0, y: 0 };
		getCoord.x = Math.floor((sprite.position.x - this.GRID_START_X) / this.BLOCK_SIZE);
		getCoord.y = Math.floor((sprite.position.y - this.GRID_START_Y) / this.BLOCK_SIZE);
		console.log(getCoord.x + ', ' + getCoord.y);
		return getCoord;

		/*
						// find the coordinates of the sprite, as we now know the coordinates are within the frame
						var coord = {x: 0, y: 0};
						console.log(sprite.x + ', ' + sprite.y);
						coord.x = (sprite.position.x - (sprite.position.x % this.BLOCK_SIZE)) / this.BLOCK_SIZE - 1; // minus 1, as 0-7
						coord.y = (sprite.position.y - (sprite.position.y % this.BLOCK_SIZE)) / this.BLOCK_SIZE - 1;
						return coord;
		*/
	},

	resetCircle: function (sprite) {
		// move sprite back to the middle change to original sprite frame
		sprite.position.x = this.frame.centerX;
		sprite.position.y = this.frame.centerY;
		sprite.frame = 0;
	},

	refreshStats: function (counter) {
		// reduce counter, if not already 0
		if (this.circlesLeft > 0) {
			this.circlesLeft += counter;
		}
		this.circleScore.text = this.circlesLeft;
	},

	seeGrid: function () {
		var gridString = '';

		for (var i = 0; i < this.NUM_ROWS; i++) {
			gridString += '\n';
			for (var j = 0; j < this.NUM_COLS; j++) {
				gridString += ' ' + this.gridMatrix[i][j];
			}
		}
		const headers = {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json',
		}
		// if (!this.circlesLeft) {
		// 	const data = JSON.stringify(this.gridMatrix);
		// 	console.log('sending results');
		// 	axios.post('http://127.0.0.1:3000/result', data, { headers: headers })
		// 		.then((res, err) => {
		// 			if (err) return console.error(err);
		// 			console.log(res);
		// 		})
		// }
	},
	snapToGrid: function (sprite) {
		for (var i = 0; i < this.rect.length; i++) {
			if (this.rect[i].contains(sprite.x, sprite.y)) {
				sprite.centerX = this.rect[i].centerX;
				sprite.centerY = this.rect[i].centerY;
				break;
			}
		}
	},
	justAClick: function (sprite) {
		var distanceFromLastUp = Phaser.Math.distance(this.game.input.activePointer.positionDown.x,
			this.game.input.activePointer.positionDown.y, this.game.input.activePointer.x, this.game.input.activePointer.y);
		return distanceFromLastUp != 0;
	},
	/*
	// Debugging...
	render: function () {
			// input some debug info on the screen
			game.debug.inputInfo(400, 200, '#000');
			game.debug.text(this.result, 10, 20, '#000');
			game.debug.timer(this.result, 400, 300, '#000');
			game.debug.rectangle(this.frame, '#ffff00', false);

	}
*/
};
