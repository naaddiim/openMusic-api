/* eslint-disable require-jsdoc */
const autoBind = require('auto-bind')
const { successResponse } = require('../../utils/responses')

class AlbumsHandler {
    constructor(service, validator) {
        this._service = service
        this._validator = validator
        autoBind(this)
    }
    postAlbumHandler = async (request, h) => {
        this._validator.validateAlbumPayload(request.payload)
        const { name, year } = request.payload
        const album = await this._service.addAlbum({ name, year })

        return successResponse(h, {
            responseData: { albumId: album.id },
            responseCode: 201,
        })
    }

    getAlbumByIdHandler = async (request, h) => {
        const { id } = request.params
        const album = await this._service.getAlbumById(id)
        const song = await this._service.getSongByAlbumId(album.id)

        return successResponse(h, {
            responseData: {
                album: {
                    id: album.id,
                    name: album.name,
                    year: album.year,
                    songs: song,
                },
            },
        })
    }
    putAlbumByIdHandler = async (request, h) => {
        this._validator.validateAlbumPayload(request.payload)
        const { name, year } = request.payload
        const { id } = request.params
        await this._service.editAlbumById(id, { name, year })

        return successResponse(h, {
            responseMessage: 'Album berhasil diubah !',
        })
    }
    deleteAlbumByIdHandler = async (request, h) => {
        const { id } = request.params
        await this._service.deleteAlbumById(id)
        return successResponse(h, {
            responseMessage: 'Album berhasil dihapus !',
        })
    }
}
module.exports = AlbumsHandler
