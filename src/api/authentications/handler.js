/* eslint-disable require-jsdoc */
const { successResponse } = require('../../utils/responses')
const autoBind = require('auto-bind')

class AuthenticationsHandler {
    constructor(authenticationsService, usersService, tokenManager, validator) {
        this._authenticationsService = authenticationsService
        this._usersService = usersService
        this._tokenManager = tokenManager
        this._validator = validator
        autoBind(this)
    }

    async postAuthenticationHandler(request, h) {
        this._validator.validatePostAuthenticationPayload(request.payload)
        const { username, password } = request.payload
        const id = await this._usersService.verifyUserCredential(username, password)
        const accessToken = this._tokenManager.generateAccessToken({ id })
        const refreshToken = this._tokenManager.generateRefreshToken({ id })
        await this._authenticationsService.addRefreshToken(refreshToken)

        return successResponse(h, {
            responseData: { accessToken, refreshToken },
            responseCode: 201,
        })
    }

    async putAuthenticationHandler(request, h) {
        this._validator.validatePutAuthenticationPayload(request.payload)
        const { refreshToken } = request.payload
        await this._authenticationsService.verifyRefreshToken(refreshToken)
        const { id } = this._tokenManager.verifyRefreshToken(refreshToken)
        const accessToken = this._tokenManager.generateAccessToken({ id })

        return successResponse(h, {
            responseData: { accessToken },
        })
    }

    async deleteAuthenticationHandler(request, h) {
        this._validator.validateDeleteAuthenticationPayload(request.payload)
        const { refreshToken } = request.payload
        await this._authenticationsService.verifyRefreshToken(refreshToken)
        await this._authenticationsService.deleteRefreshToken(refreshToken)

        return successResponse(h, {
            responseMessage: 'Access Token berhasil dihapus',
        })
    }
}

module.exports = AuthenticationsHandler
