module.exports = class InitializationException extends Error {
    constructor(message) {
        super(message)
        this.code = 'INITIALIZATION_EXCEPTION'
        this.title = 'Module was initialized incorrectly, please check the documentation.'
    }
}
