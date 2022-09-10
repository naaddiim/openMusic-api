/* eslint-disable require-jsdoc */
const ClientError = require('../../exceptions/ClientError')

class AlbumsHandler {
    constructor(service, validator) {
        this._service = service
        this._validator = validator
        this.postAlbumHandler = this.postAlbumHandler.bind(this)
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this)
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this)
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this)
    }
    postAlbumHandler = async (request, h) => {
        try {
            this._validator.validateAlbumPayload(request.payload)
            const { name, year } = request.payload
            const album = await this._service.addAlbum({ name, year })

            const response = h.response({
                status: 'success',
                data: {
                    albumId: album.id,
                },
            })
            response.code(201)
            return response
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                })
                response.code(error.statusCode)
                return response
            }

            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            })
            response.code(500)
            return response
        }
    }

    getAlbumByIdHandler = async (request, h) => {
        try {
            const { id } = request.params
            const album = await this._service.getAlbumById(id)
            const song = await this._service.getSongByAlbumId(album.id)

            const response = h.response({
                status: 'success',
                data: {
                    album: {
                        id: album.id,
                        name: album.name,
                        year: album.year,
                        songs: song,
                    },
                },
            })
            response.code(200)
            return response
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                })
                response.code(error.statusCode)
                return response
            }

            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            })
            response.code(500)
            return response
        }
    }
    putAlbumByIdHandler = async (request, h) => {
        try {
            this._validator.validateAlbumPayload(request.payload)
            const { name, year } = request.payload
            const { id } = request.params
            await this._service.editAlbumById(id, { name, year })

            const response = h.response({
                status: 'success',
                message: 'Album berhasil diubah !',
            })
            response.code(200)
            return response
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                })
                response.code(error.statusCode)
                return response
            }
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            })
            response.code(500)
            return response
        }
    }
    deleteAlbumByIdHandler = async (request, h) => {
        try {
            const { id } = request.params
            await this._service.deleteAlbumById(id)
            const response = h.response({
                status: 'success',
                message: 'Album berhasil dihapus !',
            })
            response.code(200)
            return response
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            })
            response.code(404)
            return response
        }
    }
}
module.exports = AlbumsHandler
