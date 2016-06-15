import {Dispatcher} from 'flux';

class Wheelbarrow {

	// Needs:
	//		Handler (which is then fed into the master API handler)
	//		Actions
	//		Dispatcher (or make one if it doesn't exist? this should probably exist)
	//
	constructor(handler) {
		this.handler = handler;
		this.dispatch = new Dispatcher();
	}
}
