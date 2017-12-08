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
			case "ADD_FRIDGES":
				return {...state, action.payload};
			case "ADD_ITEMS":
				return {...state, action.payload};
			case "ADD_USERS":
				return {...state, action.payload};
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

