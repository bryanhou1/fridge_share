$(init);

function init() {
	$.get("fridges.json", function(data) {
		
		console.log("get fridges in json format")
	})
	
}

class Fridge {
	constructor (fridge_attr) {
		this.id = fridge_attr.id
		this.name = fridge_attr.name
		//add comments later on
	}
}