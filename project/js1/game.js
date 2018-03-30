function Hero(name, x, y) {
	let result = {};

	let explorer = CreateNewEntity(name, x, y);
	keyboardcontroller(explorer);

	result.moveVertical = function () {
		explorer.y += explorer.step * explorer.verticalDirection;
	}

	result.moveHorizontal = function () {
		explorer.x += explorer.step * explorer.horizontalDirection;
	}

	result.findBox = function () {
		let heroTouchBox = isCollidedWithObject(explorer, treasure);
		if (heroTouchBox) {
			return treasure;
		}
		return null;
	}

	return result;
}

function Enemy(name, x, y, direction, speed){
	let result = {};
	let reverse = -1;

	let sprite = CreateNewEntity(name, x, y);
	sprite.step = speed;

	result.moveVertical = function () {
		sprite.y += sprite.step * direction;

		let enemyHitsWall = isCollidedWith(sprite, borders);

		if (enemyHitsWall === "top" || enemyHitsWall === "bottom") {
			direction = direction * reverse;
		}
	};

	result.moveHorizontal = function (){

	};

	return result;
}

function moveEnemy() {
	enemies.forEach(function (enemy){
		enemy.moveVertical()
	});
}

function moveExplorer() {
	explorer.moveHorizontal();
	explorer.moveVertical();
}

function play(delta) {
	moveEnemy();

	moveExplorer();
}