class InitializationException extends Error {
    constructor(message) {
        super(message)
        this.code = 'INITIALIZATION_EXCEPTION'
        this.title = 'Module was initialized incorrectly, please check the documentation.'
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

module.exports = ({ definition, request, options = {} }) => {
	assertInitialization({ definition, request, options })

	throw new InitializationException('TODO')
}
