$(() => {
	if (window.location.pathname.match(/^\/fridges/)){
		getFridges().done(showFridges);
		addNewFridgeBtnListener();
	}
	
});

function hideBtn(btn) {
	btn.remove();
}

function getFridges() {
	return $.get("/fridges.json", fridges => {
		const fridgesObj = {fridges: fridges.map(attributes => new Fridge(attributes))}
		store.dispatch({type: "GET_ITEMS", payload: fridgesObj})
	})
}


function showFridges() {
	const element = $("ul#fridges_li");
	const fridgeElements = store.getState().fridges.reduce((pre, next) =>  pre + next.toHtmlLi(), "");
	element.empty();
	element.append(fridgeElements)

	showFridgeListener();
	editFridgeListener();
}

function showFridgeListener() {
	$(".show_fridge_btn").on("click", e => {
		const targetId = parseInt(e.currentTarget.dataset.fridgeId, 10);
		const fridge = store.getState().fridges.find(fridge => fridge.id === targetId);
		displayFridge(fridge);
		addNewFridgeCommentListener();
	})
}

function editFridgeListener() {
	$(".edit_fridge_btn").on("click", e => {
		const targetId = parseInt(e.currentTarget.dataset.fridgeId, 10);
		const fridge = store.getState().fridges.find(fridge => fridge.id === targetId);
		displayEditFridgeForm(fridge);
		addEditFridgeSubmitListener();
	})
}

function displayFridge(fridge){
	const fridgeHTML = fridge.toDetailedView();
	$("div#display_fridge").html(fridgeHTML);
	$("#fridge_comment\\[comment\\]").focus();
}

function addNewFridgeBtnListener() {
	$("#new_fridge_btn").on("click", e => {
		e.preventDefault();
		displayNewFridgeForm();
		addNewFridgeSubmitListener();
	})
}

function displayEditFridgeForm(fridge) {
	const edit_fridge_form = `
	<h2>Edit Fridge ${fridge.id}</h2>
	<form id="edit_fridge_form" data-fridge-id="${fridge.id}" >
	  <label for="fridge[name]">Name:</label>
	  <input type="text" name="fridge[name]" id="fridge[name]" value="${fridge.name}" class="form-control"><br>
	  <input class="btn btn-primary" type="submit" value="update">
	</form>`;
	$("#display_fridge_form").html(edit_fridge_form);
	$('input#fridge\\[name\\]').focus();
	;
}

function displayNewFridgeForm() {
	const new_fridge_form = `
	<h2>New Fridge</h2>
	<form id="new_fridge_form">
	  <label for="fridge[name]">Name:</label>
	  <input type="text" name="fridge[name]" id="fridge[name]" class="form-control"><br>
	  <input class="btn btn-primary" type="submit" value="submit">
	</form>`;

	$("#display_fridge_form").html(new_fridge_form);
	$("#fridge\\[name\\]").focus();
}


function addNewFridgeSubmitListener() {
	$("#new_fridge_form").on("submit", function(e) {
		e.preventDefault();
		const fridgeData = $(this).serialize();
		$.post("/fridges", fridgeData, () => {}, "json")
			.done(() => {updateFridges().done(showFridges)})
			.fail(data => {
				let message = `New fridge creation failed.<br><br> Errors: <br><ul>`

				$.each(data.responseJSON, (key, item) => {
           message += `<li>${key} - ${item}</li>`;
        });
        message += "</ul>"
				
				$("#messages_container").html(message).addClass("alert alert-danger alert-dismissible show");
				// $("div#messages_")
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
		}).done((data) => {
			updateFridges().done(showFridges);
			$("#display_fridge_form").empty();
			$("#display_fridge").html("");
			$("#messages_container").html(`Fridge successfully updated.`);
		}).fail((data) => {
			let message = `New fridge creation failed.<br><br> Errors: <br><hr><ul>`

			$.each(data.responseJSON, (key, item) => {
         message += `<li>${key} - ${item}</li>`;
      });
      message += "</ul>"
			
			$("#messages_container").html(message)
		})
	})
}

function addNewFridgeCommentListener(){
	$("form#new_fridge_comment").on("submit", function(e) {
	  e.preventDefault();
	  let currentFridgeId = parseInt($('input[name="fridge_comment[fridge_id]"]').val());
		let commentData = $(this).serialize();
		$.post("/fridge_comments", commentData).done(data => {
			updateFridges().done(() => {
				displayFridge(store.fridges.find(fridge => fridge.id === currentFridgeId));
				addNewFridgeCommentListener();
			});
			
			$("#messages_container").html(`New Comment Added: <br>
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
	constructor (attr) {
		this.id = attr.id;
		this.name = attr.name;
		this.items = attr.items.map(item_attr => new Item(item_attr));
		this.comments = attr.fridge_comments.map(comment_attr => new Comment(comment_attr));
	}

	toDetailedView() {
		//maybe should move it into a Items Javascript object model
		let itemsHTML;
		if (this.items.length === 0) {
			itemsHTML = "<em>No Items yet.</em><br>"
		} else {
			itemsHTML = '<ul class="list-group list-group-flush">';
			this.items.forEach((item) => {
				itemsHTML += `<li class="list-group-item">ID: ${item.id} <br>
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
			commentsHTML = '<ul class="list-group list-group-flush">';
			this.comments.forEach(comment => {
				const userName = (comment.user) ? comment.user.name : "<em>guest user</em>";

				commentsHTML += `<li class="list-group-item">
					"${comment.comment}" - ${comment.created_at.slice(0,10)}<br>
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
			<div class="container">
				<div class="row">
					<div class="col-6">
						Items: 
						${itemsHTML}
					</div>
					<div class="col-6">
						Comments:
						${commentsHTML}
					</div>
				</div>
			</div>

			<form id="new_fridge_comment">
				<div class="form-group">
					<input type="hidden" value="${this.id}" name="fridge_comment[fridge_id]" />
					<label for="fridge_comment[comment]">New Comment:</label>
					<input type="text" class="form-control" id="fridge_comment[comment]" name="fridge_comment[comment]"><br/>
				</div>
				<input type="submit" class="btn btn-primary" data-fridge-id="${this.id}" />
			</form>
			<br />
			<br />
		</div>`
	}

	toHtmlLi() {
		return `<li id="fridge-${this.id}" class="m-2 p-1" style="border: 1px black solid">
			${this.id}. ${this.name} <br />
			
			<div class="btn-group btn-group-sm">
				<a class="btn btn-secondary show_fridge_btn" data-fridge-id="${this.id}">Show</a>
				<a class="btn btn-secondary edit_fridge_btn" data-fridge-id="${this.id}" >Edit</a>
			</div>
		</li>`
	}

}

