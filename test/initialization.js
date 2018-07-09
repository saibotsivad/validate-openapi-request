const test = require('tape')
const validate = require('../index.js')

const scenarios = [{
	description: 'definition is not provided',
	input: {
		request: {}
	},
	error: {
		code: 'INITIALIZATION_EXCEPTION'
	}
},{
	description: 'request is not provided',
	input: {
		definition: {}
	},
	error: {
		code: 'INITIALIZATION_EXCEPTION'
	}
},{
	description: 'request is provided without path',
	input: {
		definition: {},
		request: {
			method: 'get'
		}
	},
	error: {
		code: 'INITIALIZATION_EXCEPTION'
	}
},{
	description: 'request is provided without method',
	input: {
		definition: {},
		request: {
			path: '/thing'
		}
	},
	error: {
		code: 'INITIALIZATION_EXCEPTION'
	}
},{
	description: 'definition is missing path',
	input: {
		definition: {
			paths: {
				'/notThing': {}
			}
		},
		request: {
			path: '/thing',
			method: 'get'
		}
	},
	error: {
		code: 'INITIALIZATION_EXCEPTION'
	}
},{
	description: 'definition has path but is missing method',
	input: {
		definition: {
			paths: {
				'/thing': {}
			}
		},
		request: {
			path: '/thing',
			method: 'get'
		}
	},
	error: {
		code: 'INITIALIZATION_EXCEPTION'
	}
}]

test('initialization', t => {
	scenarios.forEach(({ description, input, error: expectedError }) => {
		t.test(description, t => {
			try {
				validate(input)
			} catch (actualError) {
				t.equals(actualError.code, expectedError.code, `the error code matches`)
				t.end()
			}
		})
	})
	t.end()
})
