/* eslint-disable require-jsdoc */
const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthorizationError = require('../../exceptions/AuthorizationError')

class PlaylistsService {
    constructor(collaborationService) {
        this._pool = new Pool()
        this._collaborationService = collaborationService
    }

    addPlaylist = async ({ name, owner }) => {
        const id = `playlist-${nanoid(16)}`
        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new InvariantError('Playlist gagal ditambahkan')
        }
        return result.rows[0]
    }
    getPlaylist = async (owner) => {
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username
            FROM playlists 
            LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
            LEFT JOIN users ON playlists.owner = users.id
            WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
            values: [owner],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            return []
        }
        return result.rows
    }
    deletePlaylist = async (id) => {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1',
            values: [id],
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('Playlist gagal dihapus. Playlist tidak ditemukan')
        }
    }

    verifyPlaylistOwner = async (id, owner) => {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan')
        }
        const { owner: playlistOwner } = result.rows[0]
        if (playlistOwner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
        }
    }

    verifyPlaylistsAccess = async (playlistId, userId) => {
        try {
            await this.verifyPlaylistOwner(playlistId, userId)
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error
            }
            try {
                await this._collaborationService.verifyCollaborator(playlistId, userId)
            } catch {
                throw error
            }
        }
    }

    addSongToPlaylist = async ({ playlistId, songId, credentialId }) => {
        const id = `playlist-songs-${nanoid(16)}`
        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        }
        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new InvariantError('Song gagal ditambahkan')
        }
        await this.postAddPlaylistActivities({ playlistId, songId, userId: credentialId })
    }
    verifySong = async (songId) => {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [songId],
        }
        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('Song tidak ditemukan di database')
        }
    }
    getSongFromPlaylist = async ({ playlistId }) => {
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username
            FROM playlists
            LEFT JOIN users ON users.id = playlists.owner
            WHERE playlists.id = $1`,
            values: [playlistId],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            return []
        }
        const query2 = {
            text: `SELECT playlist_songs.song_id as id, songs.title, songs.performer
            FROM playlist_songs
            LEFT JOIN songs on songs.id = playlist_songs.song_id
            WHERE playlist_songs.playlist_id = $1`,
            values: [playlistId],
        }
        const result2 = await this._pool.query(query2)
        if (!result2.rowCount) {
            return []
        }
        const joinResult = [result.rows[0], result2.rows]
        return joinResult
    }
    deleteSongFromPlaylist = async ({ playlistId, songId, credentialId }) => {
        const query = {
            text: `DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2`,
            values: [playlistId, songId],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new NotFoundError('Songs tidak ditemukan di playlist ini')
        }
        await this.postDeletePlaylistActivities({ playlistId, songId, userId: credentialId })
    }
    postAddPlaylistActivities = async ({ playlistId, songId, userId }) => {
        const id = `activity-${nanoid(16)}`
        const time = new Date().toISOString()
        const query = {
            text: `INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6) RETURNING id `,
            values: [id, playlistId, songId, userId, 'add', time],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new InvariantError('Aktivitas playlist gagal ditambahkan')
        }
    }
    postDeletePlaylistActivities = async ({ playlistId, songId, userId }) => {
        const id = `activity-${nanoid(16)}`
        const time = new Date().toISOString()
        const query = {
            text: `INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6) RETURNING id `,
            values: [id, playlistId, songId, userId, 'delete', time],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new InvariantError('Aktivitas playlist gagal ditambahkan')
        }
    }
    getPlaylistActivities = async (id) => {
        const query = {
            text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
            FROM playlist_song_activities
            LEFT JOIN users ON  playlist_song_activities.user_id = users.id
            LEFT JOIN songs ON playlist_song_activities.song_id = songs.id
            WHERE playlist_song_activities.playlist_id = $1`,
            values: [id],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new NotFoundError('Aktivitas playlist tidak ditemukan')
        }
        return result.rows
    }
}

module.exports = PlaylistsService
