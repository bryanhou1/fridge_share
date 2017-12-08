function configureStore () {
	let state = {
		fridges: [],
		items: [],
		users: [],
	}

	function getState() {
		return state;
	}

	function dispatch(action) {
		state = reducer(state, action);
	}
	
	function reducer(state, action) {
		switch (action.type) {
			case "GET_FRIDGES":
				return Object.assign(state, action.payload);
			case "GET_ITEMS":
				return Object.assign(state, action.payload);
			case "GET_USERS":
				return Object.assign(state, action.payload);
			// case "ADD_FRIDGES":
			// 	return Object.assign(state, action.payload);
			// case "ADD_ITEMS":
			// 	return Object.assign(state, action.payload);
			// case "ADD_USERS":
			// 	return Object.assign(state, action.payload);
			default:
				return state;
		}

	}

	return { 
		getState,
		dispatch,
	}
}

const store = configureStore();

