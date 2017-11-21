let fridges;

$(() => {
	getFridges().done(() => {
			showFridges();
	});

	addNewFridgeBtnListener();
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
	$("ul#fridges_li").empty();
	fridges.forEach((fridge) => {
		$("ul#fridges_li").append(fridge.toHtmlLi())
	})
	showFridgeListener();
	editFridgeListener();
}

function showFridgeListener() {
	$(".show_fridge_btn").on("click", (e)=> {
		let targetId = parseInt(e.currentTarget.dataset.fridgeId);
		let fridge = fridges.find((fridge) => fridge.id === targetId);
		displayFridge(fridge);
		addNewFridgeCommentListener();
	})
}

function editFridgeListener() {
	$(".edit_fridge_btn").on("click", (e)=> {
		let targetId = parseInt(e.currentTarget.dataset.fridgeId);
		let fridge = fridges.find((fridge) => fridge.id === targetId);
		displayEditFridgeForm(fridge);
		addEditFridgeSubmitListener();
	})
}

function displayFridge(fridge){
	const fridgeHTML = fridge.toDetailedView();
	$("div#display_fridge").html(fridgeHTML);
}

function addNewFridgeBtnListener() {
	$("#new_fridge_btn").on("click", function(e) {
		e.preventDefault();
		displayNewFridgeForm();
		addNewFridgeSubmitListener();
	})
}

function displayEditFridgeForm(fridge) {
	const edit_fridge_form = `
	<h2>Edit Fridge ${fridge.id}</h2>
	<form id="edit_fridge_form" data-fridge-id="${fridge.id}">
	  <label for="fridge[name]">Name:</label>
	  <input type="text" name="fridge[name]" id="fridge[name]" value="${fridge.name}">
	  <br>
	  <input type="submit" value="update">
	</form>`;

	$("#display_fridge_form").html(edit_fridge_form);
}

function displayNewFridgeForm() {
	const new_fridge_form = `
	<h2>New Fridge</h2>
	<form id="new_fridge_form">
	  <label for="fridge[name]">Name:</label>
	  <input type="text" name="fridge[name]" id="fridge[name]"><br>
	  <input type="submit" value="submit">
	</form>`;

	$("#display_fridge_form").html(new_fridge_form);
}


function addNewFridgeSubmitListener() {
	$("#new_fridge_form").on("submit", function(e) {
		e.preventDefault();
		const fridgeData = $(this).serialize();
		$.post("/fridges", fridgeData).done(function(data) {
			updateFridges().done(() => {
				showFridges();
			});
		})
	})
}

function addEditFridgeSubmitListener(){
	$("#edit_fridge_form").on("submit", function(e) {
		e.preventDefault();
		const fridgeId = this.dataset.fridgeId;
		const fridgeData = $(this).serialize();
		$.ajax({
			type: "PATCH",
			url: `fridges/${fridgeId}`,
			data: fridgeData,
			contentType: "application/x-www-form-urlencoded",
			dataType: "json",
		}).done(function(data){
			updateFridges().done(() => {
				showFridges();
			});

			//put in functions later
			$("#display_fridge").html("");
			$("#new_comment_result").html("");
		})
	})
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
				const userName = (comment.user) ? comment.user.name : "<em>guest user</em>";


				commentsHTML += `<li>
					${comment.comment} - ${comment.created_at}<br>
					By: ${userName}
				</li>`
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
				<input type="submit" data-fridge-id="${this.id}" />
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
			<a href="fridges/${this.id}/edit">Edit</a> | 
			<a class="edit_fridge_btn" data-fridge-id="${this.id}">Edit on Page</a>
			<br /><br />
		</li>`
	}
}