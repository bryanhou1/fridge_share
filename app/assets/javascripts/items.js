$(() => {
	if (window.location.pathname.match(/^\/items/)){
		getItems().done(() => showItems());
		addNewItemBtnListener();
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

function addNewItemBtnListener() {

}

function showItemListener() {

}

function editItemListener() {

}

function destroyItemListener() {

}

class Item {
	constructor (attr) {
		this.id = attr.id;
		this.name = attr.name;
		this.expiration_date = attr.expiration_date;
		this.user = attr.user;
	}

	toHtmlLi(){
		return `
			<li>
				<h4> ${this.name} </h4> 
				Expiration Date: ${this.expiration_date} <br>
				Belongs_to: <a href="/users/${this.user.id}">${this.user.name}</a> <br>
				<a class="show_item_btn" data-item-id="${this.id}">Show</a> | 
				<a class="edit_item_btn" data-item-id="${this.id}">Edit</a> | 
				<a class="destroy_item_btn" data-item-id="${this.id}">Destroy</a>
			</li>`;
	}
}