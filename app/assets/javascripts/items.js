$(() => {
	if (window.location.pathname.match(/^\/items/)){
		getItems().done(() => showItems());
		addNewItemBtnListener();
	}
});

function getItems() {

}

function showItems() {

}

addNewItemBtnListener() {

}

class Item {
	constructor (attr) {
		this.id = attr.id;
		this.name = attr.name;
		this.expiration_date = attr.expiration_date;
		this.user = attr.user;
	}
}