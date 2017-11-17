$(attachListeners);

function attachListeners() {
	$("#show_fridges_btn").on("click", () => {
		loadFridges()
		hideFridgesBtn()
	})
}

function hideFridgesBtn() {

}

function loadFridges() {
	$.get("fridges.json", function(data) {
		let fridges = data.map((fridge_attr) => { return new Fridge(fridge_attr)})
		fridges.forEach((fridge) => {
			$("ul#fridges_li").append(fridge.toHtmlLi())
		})
	})
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
			Comments: **TO BE ADDED** <br /><br />

			New Comment: <br/> <textarea/>
			<br/>
			<button onClick=""> Submit </button> 

			<br /><br />
			<a href="fridges/${this.id}">Show</a>
			<a href="fridges/${this.id}/edit">Edit</a>
			<br /><br />
		</li>`
	}
}