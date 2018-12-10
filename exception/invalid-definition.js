module.exports = class InvalidDefinitionException extends Error {
	constructor(message) {
		super(message)
		this.name = 'InvalidDefinitionException'
		this.title = 'The provided OpenAPI definition is invalid.'
	}
}
