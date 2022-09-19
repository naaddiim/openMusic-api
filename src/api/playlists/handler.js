/* eslint-disable require-jsdoc */
const autoBind = require('auto-bind')
const { successResponse } = require('../../utils/responses')
class PlaylistsHandler {
    constructor(service, validator) {
        this._service = service
        this._validator = validator
        autoBind(this)
    }
    postPlaylistHandler = async (request, h) => {
        this._validator.validatePlaylistPayload(request.payload)
        const { name } = request.payload
        const { id: credentialId } = request.auth.credentials
        const playlist = await this._service.addPlaylist({ name, owner: credentialId })

        return successResponse(h, {
            responseData: { playlistId: playlist.id },
            responseCode: 201,
        })
    }
    getPlaylistHandler = async (request, h) => {
        const { id: credentialId } = request.auth.credentials
        const playlist = await this._service.getPlaylist(credentialId)

        return successResponse(h, {
            responseData: { playlists: playlist },
        })
    }
    deletePlaylistHandler = async (request, h) => {
        const { id } = request.params
        const { id: credentialId } = request.auth.credentials
        await this._service.verifyPlaylistOwner(id, credentialId)
        await this._service.deletePlaylist(id)

        return successResponse(h, {
            responseMessage: 'Berhasil menghapus playlist',
        })
    }
    postSongToPlaylistHandler = async (request, h) => {
        this._validator.validatePlaylistSongPayload(request.payload)
        const { songId } = request.payload
        await this._service.verifySong(songId)
        const { id } = request.params
        const { id: credentialId } = request.auth.credentials
        await this._service.verifyPlaylistsAccess(id, credentialId)
        await this._service.addSongToPlaylist({ playlistId: id, songId, credentialId })

        return successResponse(h, {
            responseMessage: 'Berhasil Menambahkan song kedalam playlist',
            responseCode: 201,
        })
    }
    getSongFromPlaylistHandler = async (request, h) => {
        const { id } = request.params
        const { id: credentialId } = request.auth.credentials
        await this._service.verifyPlaylistsAccess(id, credentialId)
        const playlist = await this._service.getSongFromPlaylist({ playlistId: id })

        return successResponse(h, {
            responseData: {
                playlist: {
                    id: playlist[0].id,
                    name: playlist[0].name,
                    username: playlist[0].username,
                    songs: playlist[1],
                },
            },
        })
    }
    deleteSongFromPlaylistHandler = async (request, h) => {
        this._validator.validatePlaylistSongPayload(request.payload)
        const { songId } = request.payload
        const { id } = request.params
        const { id: credentialId } = request.auth.credentials
        await this._service.verifyPlaylistsAccess(id, credentialId)
        await this._service.deleteSongFromPlaylist({ playlistId: id, songId, credentialId })

        return successResponse(h, {
            responseMessage: 'Berhasil menghapus song dari playlist',
        })
    }
    getPlaylistActivitiesHandler = async (request, h) => {
        const { id } = request.params
        const { id: credentialId } = request.auth.credentials
        await this._service.verifyPlaylistsAccess(id, credentialId)
        const activities = await this._service.getPlaylistActivities(id)

        return successResponse(h, {
            responseData: {
                playlistId: id,
                activities,
            },
        })
    }
}
module.exports = PlaylistsHandler
