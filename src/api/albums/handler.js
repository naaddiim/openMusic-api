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
                    coverUrl: album.cover,
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
    postAlbumLikesHandler = async (request, h) => {
        const { id: albumId } = request.params
        const { id: userId } = request.auth.credentials
        await this._service.verifyAlbum(albumId)
        const message = await this._service.isAlbumLiked(userId, albumId)
        return successResponse(h, {
            responseMessage: message,
            responseCode: 201,
        })
    }
    getAlbumLikesHandler = async (request, h) => {
        const { id: albumId } = request.params
        const likes = await this._service.getAlbumLike(albumId)
        const response = h.response({
            status: 'success',
            data: {
                likes: likes.result,
            },
        })
        response.header('X-Data-Source', likes.isCached)
        response.code(200)
        return response
    }
}
module.exports = AlbumsHandler
