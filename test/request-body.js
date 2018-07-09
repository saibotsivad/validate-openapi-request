const test = require('tape')
const validate = require('../index.js')

test('request body', t => {

	t.test('basic validation', t => {
		const definition = {
			components: {
				schemas: {
					user: {
						type: 'object',
						properties: {
							name: {
								type: 'string'
							}
						}
					}
				}
			},
			paths: {
				'/user': {
					put: {
						requestBody: {
							content: {
								'application/json': {
									schema: {
										$ref: '#/components/schemas/user'
									}
								}
							}
						}
					}
				}
			}
		}

		t.test('no errors', t => {
			const errors = validate({
				definition,
				request: {
					method: 'put',
					path: '/user',
					requestBody: {
						name: 'Bilbo'
					}
				}
			})
			t.deepEquals(errors, [], 'no errors')
		})

		t.test('data type error', t => {
			const errors = validate({
				definition,
				request: {
					method: 'put',
					path: '/user',
					requestBody: {
						name: 3
					}
				}
			})
			t.equals(errors.length, 1, 'only one error')
			t.equals(errors[0].code, 'BAD_DATA_TYPE', 'throws correct error')
		})

	})
	
})
