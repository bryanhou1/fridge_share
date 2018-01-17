$(() => {
	if (window.location.pathname.match(/^\/items/)){
			$.when(getFridges(),getItems(),getUsers())
				.done(() => {
					showItems();
					addNewItemBtnListener();
				});
	}
});

function getItems() {	
	return $.get("/items.json", items => {
		const itemsCollect = {items: items.map(attributes => new Item(attributes))}
		store.dispatch({type: "GET_ITEMS", payload: itemsCollect})
	})
}

function showItems() {
	const element = $("ul#items_li");
	const itemElements = store.getState().items.reduce((pre, next) =>  pre + next.toHtmlLi(), "");

	element.empty();
	element.append(itemElements);

	showItemListener();
	editItemListener();
	destroyItemListener();
}

function addNewItemBtnListener() {
	$("a#new_item_btn").on("click", e => {
		e.preventDefault();
		$("div#item_details_container").html(Item.newItemForm());
		addNewItemSubmitListener();
	})
}

function addNewItemSubmitListener() {
	$("form#new_item_form").on("submit", function(e) {
		e.preventDefault();
		const itemData = $(this).serialize();
		$.post("/items", itemData, ()=> {}, "json")
			.done(function(data) {
				$("#messages_container").html("New Item Created!");
				updateItems().done(() => {
					showItems();
					$("div#item_details_container").empty();
				});
			})
			.fail(data => {
				let message = `New item creation failed.<br><br> Errors: <br><ul>`

				$.each(data.responseJSON, (key, item) => {
            message += `<li>${key} - ${item}</li>`;
        });
       	message += "</ul>" 
				
				$("div#messages_container").html(message)
			})
	})
}
function showItemListener() {
	$(".show_item_btn").on("click", e => {
		e.preventDefault();
		$("#messages_container").empty();
		const targetId = parseInt(e.currentTarget.dataset.itemId, 10);
		const item = store.getState().items.find(item => item.id === targetId);
		showItem(item);
	})
}

function editItemListener() {
	$(".edit_item_btn").on("click", e => {
		e.preventDefault();
		$("#messages_container").empty();
		const targetId = parseInt(e.currentTarget.dataset.itemId, 10);
		const item = store.getState().items.find(item => item.id === targetId);
		displayEditItemForm(item);
		addEditItemSubmitListener();
	})
}

function addEditItemSubmitListener() {
	$("#edit_item_form").on("submit", e => {
		e.preventDefault();
		const itemId = e.currentTarget.dataset.itemId;
		const itemData = $("#edit_item_form").serialize();
		$.ajax({
			type: "PATCH",
			url: `items/${itemId}`,
			data: itemData,
			contentType: "application/x-www-form-urlencoded",
			dataType: "json",
		})
			.done(() => {
				$("div#messages_container").html(`updated Item ${itemId} successfully.`)
				$("div#item_details_container").empty();
				updateItems().done(showItems)
			})
			.fail((data) => {
				let message = `Update Item ${itemId} failed.<br><br> Errors: <br><ul>`

				$.each(data.responseJSON, (key, item) => {
            message += `<li>${key} - ${item}</li>`;
        });
        message += "</ul>"
				
				$("div#messages_container").html(message)
			})
	})
}

function updateItems() {
	//optimization needed;
	return $.when(updateFridges(),getItems());
}

function destroyItemListener() {
	$(".destroy_item_btn").on("click", e => {
		e.preventDefault();
		const itemId = parseInt(e.currentTarget.dataset.itemId, 10);
		if (confirm("Are you sure?")){
			$.ajax({
			type: "DELETE",
			url: `items/${itemId}`,
			contentType: "application/x-www-form-urlencoded",
			dataType: "json",
		})
			.done(() => {
				$("div#messages_container").html(`Item ${itemId} deleted.`)
				$("div#item_details_container").empty();
				store.dispatch({ type: 'REMOVE_ITEM', itemId: itemId })
				showItems()
			})
		}
		
	})
}

function showItem(item) {
	$("div#item_details_container").html(item.toDetailedView())
}

function displayEditItemForm(item) {
	$("div#item_details_container").html(item.editItemForm());
}

class Item {
	constructor (attr) {
		this.id = attr.id;
		this.name = attr.name;
		this.expiration_date = attr.expiration_date;
		this.user = attr.user;
		this.fridge = attr.fridge;
		this.expired = this.expired(attr.expiration_date);
	}

	expired(exp_date) {
		if(new Date("20"+ exp_date.slice(4,6), exp_date.slice(0,2)-1, exp_date.slice(2,4)) < new Date()) {
			return true;
		} else {
			return false;
		}
	}
	static newItemForm() {
		return `
		<h2>New Item</h2>
		<form id="new_item_form">
		  <label for="item[name]">Name:</label>
		  <input type="text" name="item[name]" id="item[name]">
		  <br>
			<label for="item[expiration_date]">Expiration date:</label>
  		<input id="item[expiration_date]" type="text" name="item[expiration_date]">
			<br>
	    <label for="item[user_id]">Belongs to: </label>
			${this.userSelectButton()}

			<label for="item[fridge_id]">Fridge: </label>
			${this.fridgeSelectButton()}
		 	
			<label for="item_fridge_attributes_Create new fridge to place item:">Create new fridge to place item:</label><br>
			<input type="text" name="item[fridge_attributes][name]" id="item_fridge_attributes_name"><br>
		  <input type="submit" value="Create New">
		</form>`
	}

	toDetailedView() {
		return `
			<h1> Item details </h1>
			<h4> ${this.name} </h4> 
			Expiration Date: ${this.expiration_date} <br>
			Belongs to: <a href="/users/${this.user.id}">${this.user.name}</a> <br>
			Fridge: ${this.fridge.id}. <a href="/fridges/${this.fridge.id}">${this.fridge.name}</a>
		`
	}

	toHtmlLi(){
		// write logic to display "show edit or destroy"
		return `
			<li>
				<h4> ${this.name} </h4> 

				Expiration Date: ${this.expiration_date} <br> ${this.expired ? "Expired!<br>" : ""}
				Belongs to: <a href="/users/${this.user.id}">${this.user.name}</a> <br>
				${this.optionBtns()}
			</li>`;
	}

	optionBtns() {
		const currentUserId = $("body").data().currentUserId
		let html = `<a class="show_item_btn" data-item-id="${this.id}">Show</a>`

		if (currentUserId === this.user.id) {
			html += ` | <a class="edit_item_btn" data-item-id="${this.id}">Edit</a>`
		} 
		if (this.expired || currentUserId === this.user.id) {
			html += ` | <a class="destroy_item_btn" data-item-id="${this.id}">Destroy</a>`
		}

		return html;
	}

	editItemForm() {
		return `
			<h2>Edit item ${this.id}</h2>
			<form id="edit_item_form" data-item-id=${this.id}>
			  <label for="item[name]">Name:</label>
			  <input type="text" name="item[name]" id="item[name]" value=${this.name}>
			  <br>
				<label for="item[expiration_date]">Expiration date:</label>
    		<input id="item[expiration_date]" type="text" value=${this.expiration_date} name="item[expiration_date]">
				<br>
		    <label for="item[user_id]">Belongs to: </label>
				${Item.userSelectButton(this.user.id)}

				<label for="item[fridge_id]">Fridge: </label>
				${Item.fridgeSelectButton(this.fridge.id)}
			 	
				<label for="item_fridge_attributes_Create new fridge to place item:">Create new fridge to place item:</label><br>
				<input type="text" name="item[fridge_attributes][name]" id="item_fridge_attributes_name"><br>

			  <input type="submit" value="update">
			</form>
		`
	}

	static userSelectButton(userId = -1) {
		const html = '<select name="item[user_id]" id="item[user_id]">' + 
			store.getState().users.map(user => `
				<option ${user.id == userId ? "selected":""} value=${user.id}>
					${user.id} - ${user.name}
				</option>`) +'</select>'

    return html;
	}

	static fridgeSelectButton(fridgeId = -1) {
		const html = '<select name="item[fridge_id]" id="item[fridge_id]"><option value="">Add new</option>'+
			store.getState().fridges.map(fridge => {
				return `<option ${fridge.id == fridgeId ? "selected":""} value=${fridge.id}>${fridge.id} - ${fridge.name}</option>`
			})+'</select>';

		return html;
	}
}

