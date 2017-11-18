let fridges;

$(() => {
	getFridges().done(()=> {
			showFridges();
	});

});


function hideBtn(btn) {
	btn.remove();
}

function getFridges() {
	return $.get("/fridges.json", function(data) {
		fridges = data.map((fridge_attr) => { return new Fridge(fridge_attr)})
	})
}

function showFridges() {
	fridges.forEach((fridge) => {
		$("ul#fridges_li").append(fridge.toHtmlLi())
	})
	showFridgeListener();
}

function showFridgeListener() {
	$(".show_fridge_btn").on("click", (e)=> {
		let targetId = parseInt(e.currentTarget.dataset.fridgeId);
		let fridge = fridges.find((fridge) => fridge.id === targetId);
		displayFridge(fridge);
	})
}

class Fridge {
	constructor (fridge_attr) {
		this.id = fridge_attr.id
		this.name = fridge_attr.name
		this.items = fridge_attr.items
		//add comments later on
	}

	toHtmlLi() {
		return `<li id="fridge-${this.id}">
			Fridge ID: ${this.id} <br />
			Name: ${this.name} <br />
			Comments: **TO BE ADDED** <br /><br />

			New Comment: <br/> <textarea/>
			<br/>
			<button onClick=""> Submit </button> 

			<br /><br />
			<a href="fridges/${this.id}">Show</a>
			<button class="show_fridge_btn" data-fridge-id="${this.id}">Show on Page</button>
			<a href="fridges/${this.id}/edit">Edit</a>
			<br /><br />
		</li>`
	}
}