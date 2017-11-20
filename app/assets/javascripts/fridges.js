let fridges;

$(() => {
	getFridges().done(() => {
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
		addNewFridgeCommentListener();
	})
}

function displayFridge(fridge){
	const fridgeHTML = fridge.toDetailedView();
	$("div#display_fridge").html(fridgeHTML);
}

function addNewFridgeCommentListener(){
	//not sure why arrow function messes up $(this)
	$("form#new_fridge_comment").on("submit", function(e) {
	  e.preventDefault();
	  let currentFridgeId = parseInt($('input[name="fridge_comment[fridge_id]"]').val());
		let commentData = $(this).serialize();
		$.post("/fridge_comments", commentData).done(function( data ) {
			updateFridges().done(() => {

				displayFridge(fridges.find((fridge) => fridge.id === currentFridgeId));
				addNewFridgeCommentListener();
			});
			
			$("div#new_comment_result").html(`New Comment Added: <br>
				${data.comment} - ${data.created_at} <br>
			`)
		})
	});
}

function updateFridges() {
	//can improve efficiency later
	return getFridges();
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

		return `
		<h2> Fridge details </h2>
		<div>
			Fridge ID: ${this.id} <br />
			Name: ${this.name} <br />
			Items: 
			${itemsHTML}
			<br />
			Comments:
			${commentsHTML}
			<br />

			<form id="new_fridge_comment">
				<input type="hidden" value="${this.id}" name="fridge_comment[fridge_id]" />
				<label for="fridge_comment[comment]">New Comment:</label>
				<textarea id="fridge_comment[comment]" name="fridge_comment[comment]">test</textarea>
				<br/>
				<input type="submit" data_fridge_id="${this.id}" />
			</form>
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