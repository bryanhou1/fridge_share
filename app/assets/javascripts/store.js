function configureStore () {
	let state = {
		fridges: [],
		items: [],
		users: [],
	}

	function getState() {
		return state;
	}

	function dispatch(actionCreator) {
		var action = actionCreator()
		reducer(action)
	},
	
	function reducer(ob) {

	},

	return { 
		getState,
		dispatch,
	}
}

const store = configureStore();

