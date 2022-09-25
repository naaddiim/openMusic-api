/* eslint-disable require-jsdoc */
const autoBind = require('auto-bind')
const { successResponse } = require('../../utils/responses')

class ExportsHandler {
    constructor(service, validator, playlistsService) {
        this._service = service
        this._validator = validator
        this._playlistsService = playlistsService
        autoBind(this)
    }

    async postExportPlaylistsHandler(request, h) {
        this._validator.validateExportPlaylistsPayload(request.payload)
        const { playlistsId } = request.params
        const { id: credentialId } = request.auth.credentials
        await this._playlistsService.verifyPlaylistOwner(playlistsId, credentialId)
        const message = {
            playlistsId,
            targetEmail: request.payload.targetEmail,
        }
        await this._service.sendMessage('export:playlists', JSON.stringify(message))

        return successResponse(h, {
            responseMessage: 'Permintaan Anda sedang kami proses',
            responseCode: 201,
        })
    }
}

module.exports = ExportsHandler
