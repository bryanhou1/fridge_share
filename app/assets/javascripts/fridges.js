$(init);

function init() {
	$.get("fridges.json", function(data) {
		let fridges = data.map((fridge_attr) => { return new Fridge(fridge_attr)})

		console.log(fridges);
		})

	console.log("get fridges in json format")
}

class Fridge {
	constructor (fridge_attr) {
		this.id = fridge_attr.id
		this.name = fridge_attr.name
		//add comments later on
	}

	toHtmlLi() {
		return `<li id="fridge-${this.id}">
			Fridge ID: ${this.id} <br />
			Name: ${this.name} <br />
			Comments: **TO BE ADDED** <br />
		</li>`
	}
}