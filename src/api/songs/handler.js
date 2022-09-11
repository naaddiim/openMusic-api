/* eslint-disable require-jsdoc */

class SongsHandler {
    constructor(service, validator) {
        this._service = service
        this._validator = validator
        this.postSongHandler = this.postSongHandler.bind(this)
        this.getSongsHandler = this.getSongsHandler.bind(this)
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this)
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this)
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this)
    }
    postSongHandler = async (request, h) => {
        this._validator.validateSongPayLoad(request.payload)
        const { title, year, genre, performer, duration, albumId } = request.payload
        const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId })

        const response = h.response({
            status: 'success',
            data: {
                songId: songId,
            },
        })
        response.code(201)
        return response
    }

    getSongsHandler = async (request, h) => {
        const { title, performer } = request.query
        const songs = await this._service.getSongs(title, performer)
        const response = h.response({
            status: 'success',
            data: {
                songs: songs,
            },
        })
        response.code(200)
        return response
    }

    getSongByIdHandler = async (request, h) => {
        const { id } = request.params
        const song = await this._service.getSongById(id)

        const response = h.response({
            status: 'success',
            data: {
                song: {
                    id: song.id,
                    title: song.title,
                    year: song.year,
                    performer: song.performer,
                    genre: song.genre,
                    duration: song.duration,
                    albumId: song.album_id,
                },
            },
        })
        response.code(200)
        return response
    }
    putSongByIdHandler = async (request, h) => {
        this._validator.validateSongPayLoad(request.payload)
        const { title, year, genre, performer, duration, albumId } = request.payload
        const { id } = request.params
        await this._service.editSongById(id, { title, year, genre, performer, duration, albumId })

        const response = h.response({
            status: 'success',
            message: 'Songs berhasil diubah !',
        })
        response.code(200)
        return response
    }
    deleteSongByIdHandler = async (request, h) => {
        const { id } = request.params
        await this._service.deleteSongById(id)
        const response = h.response({
            status: 'success',
            message: 'Song berhasil dihapus !',
        })
        response.code(200)
        return response
    }
}
module.exports = SongsHandler
