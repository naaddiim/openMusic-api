/* eslint-disable require-jsdoc */

const autoBind = require('auto-bind')
const { successResponse } = require('../../utils/responses')

class SongsHandler {
    constructor(service, validator) {
        this._service = service
        this._validator = validator
        autoBind(this)
    }
    postSongHandler = async (request, h) => {
        this._validator.validateSongPayLoad(request.payload)
        const { title, year, genre, performer, duration, albumId } = request.payload
        const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId })
        return successResponse(h, {
            responseData: { songId },
            responseCode: 201,
        })
    }

    getSongsHandler = async (request, h) => {
        const { title, performer } = request.query
        const songs = await this._service.getSongs(title, performer)
        return successResponse(h, {
            responseData: { songs },
        })
    }

    getSongByIdHandler = async (request, h) => {
        const { id } = request.params
        const song = await this._service.getSongById(id)

        return successResponse(h, {
            responseData: {
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
    }
    putSongByIdHandler = async (request, h) => {
        this._validator.validateSongPayLoad(request.payload)
        const { title, year, genre, performer, duration, albumId } = request.payload
        const { id } = request.params
        await this._service.editSongById(id, { title, year, genre, performer, duration, albumId })

        return successResponse(h, {
            responseMessage: 'Songs berhasil diubah !',
        })
    }
    deleteSongByIdHandler = async (request, h) => {
        const { id } = request.params
        await this._service.deleteSongById(id)
        return successResponse(h, {
            responseMessage: 'Songs berhasil dihapus !',
        })
    }
}
module.exports = SongsHandler
