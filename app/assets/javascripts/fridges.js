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
		this.comments = fridge_attr.fridge_comments;
	}

	toDetailedView() {
		//maybe should move it into a Items Javascript object model
		let itemsHTML;
		if (this.items.length === 0) {
			itemsHTML = "<em>No Items yet.</em><br>"
		} else {
			itemsHTML = '<ul>';
			this.items.forEach((item) => {
				itemsHTML += `<li>ID: ${item.id} <br>
													Name: ${item.name} <br>
													Expiration date: ${item.expiration_date}
											</li>`
			})
		itemsHTML += "</ul>"
		}

		
		let commentsHTML;
		if (this.comments.length === 0) {
			commentsHTML = "<em>No Comments yet.</em><br>"
		} else {
			commentsHTML = '<ul>';

			this.comments.forEach((comment) => {
				commentsHTML += `<li>${comment.comment} - ${comment.created_at}<br></li>`
			})
			commentsHTML += "</ul>"
		}


		return `<div>
			Fridge ID: ${this.id} <br />
			Name: ${this.name} <br />
			Items: 
			${itemsHTML}
			<br />
			Comments:
			${commentsHTML}
			<br />

			New Comment: <br/> <textarea/>
			<br/>
			<button onClick=""> Submit </button>
			<br />
			<br />
		</div>`
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