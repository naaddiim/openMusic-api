/* eslint-disable require-jsdoc */
const autoBind = require('auto-bind')
const { successResponse } = require('../../utils/responses')

class CollaborationsHandler {
    constructor(collaborationsService, playlistsService, validator) {
        this._collaborationsService = collaborationsService
        this._playlistsService = playlistsService
        this._validator = validator

        autoBind(this)
    }

    async postCollaborationHandler(request, h) {
        this._validator.validateCollaborationPayload(request.payload)
        const { id: credentialId } = request.auth.credentials
        const { playlistId, userId } = request.payload
        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId)
        const collaborationId = await this._collaborationsService.addCollaboration({ playlistId, userId })

        return successResponse(h, {
            responseData: { collaborationId },
            responseCode: 201,
        })
    }

    async deleteCollaborationHandler(request, h) {
        this._validator.validateCollaborationPayload(request.payload)
        const { id: credentialId } = request.auth.credentials
        const { playlistId, userId } = request.payload

        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId)
        await this._collaborationsService.deleteCollaboration(playlistId, userId)

        return successResponse(h, {
            responseMessage: 'Kolaborasi berhasil dihapus',
        })
    }
}

module.exports = CollaborationsHandler
