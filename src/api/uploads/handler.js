/* eslint-disable require-jsdoc */
const autoBind = require('auto-bind')
const { successResponse } = require('../../utils/responses')

class UploadsHandler {
    constructor(service, validator, albumsService) {
        this._service = service
        this._validator = validator
        this._albumsService = albumsService
        autoBind(this)
    }

    async postUploadImageHandler(request, h) {
        const { cover } = request.payload
        const { id } = request.params
        this._validator.validateImageHeaders(cover.hapi.headers)
        const coverUrl = await this._service.writeFile(cover, cover.hapi)
        await this._albumsService.coverUrlGenerator(id, coverUrl)

        return successResponse(h, {
            responseMessage: 'Sampul berhasil diunggah',
            responseCode: 201,
        })
    }
}

module.exports = UploadsHandler
