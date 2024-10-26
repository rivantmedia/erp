class Base {
	constructor() {
		this.constructor.pd(this.constructor.pd);
	}

	static pd(func) {
		console.log(func);
	}
}

class Derived extends Base {
	static demo = "ANOTHER_VALUE";
}

new Derived();
