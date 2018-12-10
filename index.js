const InitializationException = require('./exception/initialization')
const InvalidDefinitionException = require('./exception/invalid-definition')

const dotProp = require('dot-prop')

const validateBody = ({ request, requestBody, definition }) => {}

const validateParameterQuery = ({ request, parameter, definition }) => {}
const validateParameterHeader = ({ request, parameter, definition }) => {}
const validateParameterPath = ({ request, parameter, definition }) => {}
const validateParameterCookie = ({ request, parameter, definition }) => {}

const validateParameter = ({ request, parameter, definition }) => {
	if (parameter.in === 'cookie') {
		return validateParameterCookie({ request, parameter, definition })
	} else if (parameter.in === 'header') {
		return validateParameterHeader({ request, parameter, definition })
	} else if (parameter.in === 'path') {
		return validateParameterPath({ request, parameter, definition })
	} else if (parameter.in === 'query') {
		return validateParameterQuery({ request, parameter, definition })
	} else {
		return new InvalidDefinitionException('Each parameter must define `in` as one of the following: cookie, header, path, query')
	}
}

const assertInitialization = ({ definition, request, options }) => {
	if (!definition) throw new InitializationException('The parameter `definition` is missing.')
	if (!request) throw new InitializationException('The parameter `request` is missing.')
	if (!request.method) throw new InitializationException('The parameter `request.method` is missing.')
	if (!request.path) throw new InitializationException('The parameter `request.path` is missing.')
	if (!definition.paths || !definition.paths[request.path]) throw new InitializationException('Could not locate the OpenAPI path object for the provided request path.')
	if (!definition.paths[request.path][request.method]) throw new InitializationException('Could not locate the OpenAPI path method for the provided request path and method.')
}

module.exports = ({ definition, request, options }) => {
	assertInitialization({ definition, request, options })

	const { body, headers, method, path, query } = request
	const overallParameters = dotProp.get(definition, `paths.parameters`, [])
	const pathParameters = dotProp.get(definition, `paths.${path}.parameters`, [])
	const { requestBody, responses, parameters: methodParameters } = dotProp.get(definition, `paths.${path}.${method.toLowerCase()}`, {})

	const parameters = [
		...(overallParameters || []),
		...(pathParameters || []),
		...(methodParameters || [])
	].filter(Boolean)

	const errors = parameters
		.map(parameter => validateParameter({ request, parameter, definition }))
		.filter(Boolean)

	if (requestBody) {
		errors.push(...validateBody({ request, requestBody, definition }))
	}

	return errors
}
