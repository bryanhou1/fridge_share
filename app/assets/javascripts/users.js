class User {
	constructor(attr) {
		this.id = attr.id;
		this.name = attr.name;
		this.email = attr.email;
	}
}

function getUsers() {
	return $.get("/users.json", users => {
		const usersCollect = {users: users.map(attr => new User(attr))}
		store.dispatch({type: "GET_USERS", payload: usersCollect})
	})
}