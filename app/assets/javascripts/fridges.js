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

function displayFridge(fridge){
	const fridgeHTML = fridge.toDetailedView();
	$("div#display_fridge").html(fridgeHTML);
}



class Fridge {
	constructor (fridge_attr) {
		this.id = fridge_attr.id
		this.name = fridge_attr.name
		this.items = fridge_attr.items
		//add comments later on
	}

	toDetailedView() {
		//maybe should move it into a Items Javascript object model
		let itemsHTML = '<ul>';
		this.items.forEach((item) => {
			itemsHTML += `<li>ID: ${item.id} <br>
												Name: ${item.name} <br>
												Expiration date: ${item.expiration_date}
										</li>`
		})

		itemsHTML += "</ul>"

		return `<div>
			Fridge ID: ${this.id} <br />
			Name: ${this.name} <br />
			Items: 
			${itemsHTML}
			Comments: **TO BE ADDED** <br />

			New Comment: <br/> <textarea/>
			<br/>
			<button onClick=""> Submit </button> 

			<br /><br />

			<br />
		</div>`;
		//dont forget about comments later
	}

	toHtmlLi() {
		return `<li id="fridge-${this.id}">
			Fridge ID: ${this.id} <br />
			Name: ${this.name} <br />
			<a href="fridges/${this.id}">Show</a> | 
			<a class="show_fridge_btn" data-fridge-id="${this.id}">Show on Page</a> | 
			<a href="fridges/${this.id}/edit">Edit</a>
			<br /><br />
		</li>`
	}
}