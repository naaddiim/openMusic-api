/* eslint-disable require-jsdoc */

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
    }

    getAlbumByIdHandler = async (request, h) => {
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
    }
    putAlbumByIdHandler = async (request, h) => {
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
    }
    deleteAlbumByIdHandler = async (request, h) => {
        const { id } = request.params
        await this._service.deleteAlbumById(id)
        const response = h.response({
            status: 'success',
            message: 'Album berhasil dihapus !',
        })
        response.code(200)
        return response
    }
}
module.exports = AlbumsHandler
