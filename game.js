var display;
var game = {
	cells:1,
	stage:0,
	money:0,
	pizzas:0,
	wage:1,
	pizzacost:8,
	tick: function() {
		switch(game.stage)
		{
			case 0:
				if(game.cells > 1) game.stage = 1;
				break;
			case 1:
				if(game.cells > 10000000) game.stage = 2;
				break;
			case 2:
				if(game.cells > 100000000) game.stage = 3;
				break;
			case 3:
				if(game.cells > 500000000) game.stage = 4;
				break;
			case 4:
				if(game.cells > 2500000000) game.stage = 5;
				break;
			case 5:
				if(game.cells > 10000000000) game.stage = 6;
				break;
			case 6:
				if(game.cells > 26000000000) game.stage = 7;
				break;
		}
		display.update();
	}
}

window.addEventListener('load', function(){
	
	console.log('page loaded');
	
	// Set up dynamic display
	display = {
		cells: new DisplayText('cellcount',()=>'Cells: '+game.cells),
		money: new DisplayText('moneycount',()=>'Money: $'+game.money),
		pizzas: new DisplayText('pizzacount',()=>'Pizzas: '+game.pizzas),
		growthStage: {
			graphic: document.getElementById('persongraphic'),
			heading: document.getElementById('personheading'),
			update: function() {
				this.graphic.style.width = (Math.log((game.cells/100000)+1)/3.415*this.graphic.naturalWidth)+1+'px';
				if(game.stage)
				{
					this.graphic.src = `assets/growth_stages/s${game.stage}.png`;
					display.cells.elementObject.hidden = false;
				}
				else
				{
					this.graphic.src = 'assets/growth_stages/s1.png';
					display.cells.elementObject.hidden = true;
				}
				
				switch(game.stage)
				{
					case 1, 2, 3, 4, 5, 6:
						this.heading.innerText = 'You are a lump of organic matter';
						break;
					case 7:
						this.heading.innerText = 'You are an infant';
						break;
					default:
						this.heading.innerText = 'You are a single cell';
				}
			}
		}
	}
	Object.defineProperty(display,'update', {value: function() {
		for(item in display)
		{
			display[item].update();
		}
	}});
	display.update();
	
	// Set interval for game to tick
	window.setInterval(game.tick,500);
	
	document.getElementById('multiplybutton').addEventListener('click', function() {
		let c = game.cells;
		if(c<2048) game.cells*=2;
		else if(c<10000) game.cells = Math.floor(c*1.2);
		else if(c<1000000) game.cells = Math.floor(c*1.1);
		else if(c<100000000) game.cells = Math.floor(c*1.05);
		else if(c<26000000000) game.cells = Math.floor(c*1.02);
		else {
			// Grown up
			this.disabled = true;
		}
		display.cells.update();
		display.growthStage.update();
	});
	document.getElementById('workbutton').addEventListener('click', function(){
		game.money+=game.wage;
		display.money.update();
	});
	document.getElementById('pizzabutton').addEventListener('click', function(){
		if(game.money>=game.pizzacost)
		{
			game.money-=game.pizzacost;
			game.pizzas++;
		}
	});
});

/**
 * Constructor for a dynamic display text. Specify elementId and textMethod
 */
function DisplayText(elementId,textMethod) {
	this.elementObject = document.getElementById(elementId);
	this.update = function() {
		this.elementObject.innerHTML = textMethod();
	}
}

function localStorageGet(name)
{
	let local = 0;
	try {local = localStorage.getItem(name)} catch (exception) {}
	return local;
}

function localStorageSet(name, value)
{
	let local = 0;
	try {local = localStorage.setItem(name, value)} catch (exception) {}
	return local;
}