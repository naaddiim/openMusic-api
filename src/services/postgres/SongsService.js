/* eslint-disable require-jsdoc */
const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class SongsService {
    constructor() {
        this._pool = new Pool()
    }

    async addSong({ title, year, genre, performer, duration, albumId }) {
        const id = `song-${nanoid(16)}`
        const createdAt = new Date().toISOString()
        const updatedAt = createdAt

        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
            values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt],
        }

        const result = await this._pool.query(query)

        if (!result.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan')
        }

        return result.rows[0].id
    }

    async getSongs(title, performer) {
        if (performer === undefined && title === undefined) {
            const query = {
                text: 'SELECT id, title, performer FROM songs',
            }
            const result = await this._pool.query(query)

            if (!result.rowCount) {
                throw new NotFoundError('Songs tidak ditemukan')
            }
            return result.rows
        } else if (performer === undefined && title) {
            const newTitle = title.charAt(0).toUpperCase() + title.slice(1) + '%'
            const query = {
                text: 'SELECT id, title, performer FROM songs WHERE title LIKE $1',
                values: [newTitle],
            }
            const result = await this._pool.query(query)

            if (!result.rowCount) {
                throw new NotFoundError('title tidak ditemukan')
            }
            return result.rows
        } else if (performer && title === undefined) {
            const newPerformer = performer.charAt(0).toUpperCase() + performer.slice(1) + '%'
            const query = {
                text: 'SELECT id, title, performer FROM songs WHERE performer LIKE $1',
                values: [newPerformer],
            }
            const result = await this._pool.query(query)

            if (!result.rowCount) {
                throw new NotFoundError('performer tidak ditemukan')
            }
            return result.rows
        } else {
            const newTitle = title.charAt(0).toUpperCase() + title.slice(1) + '%'
            const newPerformer = performer.charAt(0).toUpperCase() + performer.slice(1) + '%'
            const query = {
                text: 'SELECT id, title, performer FROM songs WHERE title LIKE $1 AND performer LIKE $2',
                values: [newTitle, newPerformer],
            }
            const result = await this._pool.query(query)

            if (!result.rowCount) {
                result.rows
            }
            return result.rows
        }
    }
    async getSongById(id) {
        const query = {
            text: 'SELECT id, title, year, performer, genre, duration, album_id FROM songs WHERE id = $1',
            values: [id],
        }
        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('Songs tidak ditemukan')
        }

        return result.rows[0]
    }

    async editSongById(id, { title, year, genre, performer, duration, albumId }) {
        const updatedAt = new Date().toISOString()
        const query = {
            // eslint-disable-next-line max-len
            text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6,updated_at = $7 WHERE id = $8 RETURNING id',
            values: [title, year, genre, performer, duration, albumId, updatedAt, id],
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('Gagal memperbarui Songs. Id tidak ditemukan')
        }
    }

    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING ID',
            values: [id],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new NotFoundError('Songs gagal dihapus. Id tidak ditemukan')
        }
    }
}

module.exports = SongsService
