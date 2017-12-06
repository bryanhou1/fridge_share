class User {
	constructor(attr) {
		this.id = attr.id;
		this.name = attr.name;
		this.email = attr.email;
	}
}

function getUsers() {
	return $.get("/users.json", users => {
		store.state.users = users.map(attr => new User(attr))
	})
}