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
}

function showFridge() {
	$("#show_fridge").on("click", () => {
		loadFridge();
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
			<a href="fridges/${this.id}" id= data-fridge-id="${this.id}">Show</a>
			<a href="fridges/${this.id}/edit">Edit</a>
			<br /><br />
		</li>`
	}
}