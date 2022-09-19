/* eslint-disable require-jsdoc */
const autoBind = require('auto-bind')
const { successResponse } = require('../../utils/responses')

class UsersHandler {
    constructor(usersService, validator) {
        this._usersService = usersService
        this._validator = validator
        autoBind(this)
    }
    async postUserHandler(request, h) {
        this._validator.validateUserPayload(request.payload)
        const { username, password, fullname } = request.payload
        const userId = await this._usersService.addUser({ username, password, fullname })

        return successResponse(h, {
            responseData: { userId },
            responseCode: 201,
        })
    }
}

module.exports = UsersHandler
