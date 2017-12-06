$(() => {
	if (window.location.pathname.match(/^\/items/)){
			$.when(getFridges(),getItems())
				.done(() => showItems());
	}
});

function getItems() {
	return $.get("/items.json", items => {
		store.state.items = items.map(attributes => new Item(attributes))
	})
}

function showItems() {
	const element = $("ul#items_li");
	const itemElements = store.getState().items.reduce((pre, next) =>  pre + next.toHtmlLi(), "");

	element.empty();
	element.append(itemElements)

	showItemListener();
	editItemListener();
	destroyItemListener();
}

// function addNewItemBtnListener() {

// }

function showItemListener() {
	$(".show_item_btn").on("click", e => {
		e.preventDefault();
		const targetId = parseInt(e.currentTarget.dataset.itemId, 10);
		const item = store.getState().items.find(item => item.id === targetId);
		showItem(item);
	})
}

function editItemListener() {
	$(".edit_item_btn").on("click", e => {
		e.preventDefault();
		const targetId = parseInt(e.currentTarget.dataset.itemId, 10);
		const item = store.getState().items.find(item => item.id === targetId);
		displayEditItemForm(item);
		//add listener
	})
}

function destroyItemListener() {
	$(".destroy_item_btn").on("click", e => {
		e.preventDefault();
		const targetId = parseInt(e.currentTarget.dataset.itemId, 10);
		const item = store.getState().items.find(item => item.id === targetId);
		//
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
		// this.expired 
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
		const expired = true; //write later
		return `
			<li>
				<h4> ${this.name} </h4> 

				Expiration Date: ${this.expiration_date} <br>
				Belongs to: <a href="/users/${this.user.id}">${this.user.name}</a> <br>
				${this.optionBtns()}
			</li>`;
	}

	optionBtns() {
		return `
			<a class="show_item_btn" data-item-id="${this.id}">Show</a> | 
			<a class="edit_item_btn" data-item-id="${this.id}">Edit</a> | 
			<a class="destroy_item_btn" data-item-id="${this.id}">Destroy</a>
		`
	}

	editItemForm() {
		return `
			<h2>Edit item ${this.id}</h2>
			<form id="edit_item_form" data-item-id=${this.id}>
			  <label for="item[name]">Name:</label>
			  <input type="text" name="item[name]" id="item[name]" value=${this.name}>
			  <br>
				<label for="item[expiration_date]">Expiration date</label>
    		<input id="item[expiration_date]" type="text" value=${this.expiration_date} name="item[expiration_date]">
				<br>
		    <label for="item[user_id]">Belongs to: </label>
				${this.userSelectButton()}

				<label for="item[fridge_id]">Fridge: </label>
				${this.fridgeSelectButton()}
			 	
				<label for="item_fridge_attributes_Create new fridge to place item:">Create new fridge to place item:</label><br>
				<input type="text" name="item[fridge_attributes][name]" id="item_fridge_attributes_name"><br>

			  <input type="submit" value="update">
			</form>
		`
	}

	userSelectButton() {
		// const html = '<select name="item[user_id]" id="item_user_id"><option value="">Add new</option>' + 
		// store.getState().users.forEach(user => {
		// 	return `<option value=${user.id}>${user.id} - ${user.name}></option>`
		// }) +
		// '</select>'

		// 	<option value="1">1 - for</option>
		// 	<option selected="selected" value="2">2 - apt 3013</option>
		// 	<option value="3">3 - 1234</option>
		// 	<option value="4">4 - 123456</option>
		// 	<option value="5">5 - 12345</option>
		// </select>
    // return html;
	}

	fridgeSelectButton() {
		const html = '<select name="item[fridge_id]" id="item[fridge_id]"><option value="">Add new</option>'+
		''+ store.getState().fridges.map(fridge => {
			return `<option value=${fridge.id}>${fridge.id} - ${fridge.name}</option>`
		})+
		'</select>'
		return html;
	}
}

