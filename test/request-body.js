const test = require('tape')
const validate = require('../index.js')

const scenarios = [{
	description: 'body data is invalid',
	input: {
		definition: {
			paths: {
				'/thing': {
					put: {
						requestBody: {}
					}
				}
			}
		},
		request: {
			path: '/thing',
			method: 'put'
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
