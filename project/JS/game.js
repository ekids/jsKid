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
	explorer.x += explorer.step * explorer.horizontalDirection;
	explorer.y += explorer.step * explorer.verticalDirection;
}

function play(delta) {
	moveEnemy();

	moveExplorer();
}