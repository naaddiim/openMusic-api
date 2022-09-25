/* eslint-disable require-jsdoc */
const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class AlbumsService {
    constructor(cacheService) {
        this._pool = new Pool()
        this._cacheService = cacheService
    }

    addAlbum = async ({ name, year }) => {
        const id = `album-${nanoid(16)}`
        const createdAt = new Date().toISOString()
        const updatedAt = createdAt

        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, name, year, createdAt, updatedAt],
        }

        const result = await this._pool.query(query)

        if (!result.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan')
        }
        return result.rows[0]
    }

    getAlbumById = async (id) => {
        const query = {
            text: 'SELECT id, name, year, cover FROM albums WHERE id = $1',
            values: [id],
        }
        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('Album tidak ditemukan')
        }
        return result.rows[0]
    }

    getSongByAlbumId = async (id) => {
        const query = {
            text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
            values: [id],
        }
        const result = await this._pool.query(query)

        if (!result.rowCount) {
            return []
        }
        return result.rows
    }

    editAlbumById = async (id, { name, year }) => {
        const updatedAt = new Date().toISOString()
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
            values: [name, year, updatedAt, id],
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan')
        }
    }

    deleteAlbumById = async (id) => {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id],
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan')
        }
    }
    coverUrlGenerator = async (id, coverUrl) => {
        const updatedAt = new Date().toISOString()
        const query = {
            text: 'UPDATE albums SET cover = $1, updated_at = $2 WHERE id = $3 RETURNING id',
            values: [coverUrl, updatedAt, id],
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('Gagal Menambah sampul album. Id tidak ditemukan')
        }
    }
    isAlbumLiked = async (userId, albumId) => {
        const query = {
            text: 'SELECT * FROM user_albums_likes WHERE user_id = $1 AND album_id = $2',
            values: [userId, albumId],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            return this.addAlbumLike(userId, albumId)
        } else {
            return this.deleteAlbumLike(userId, albumId)
        }
    }

    addAlbumLike = async (userId, albumId) => {
        const id = `user-album-like-${nanoid(16)}`
        const query = {
            text: 'INSERT INTO user_albums_likes VALUES ($1, $2, $3) RETURNING id',
            values: [id, userId, albumId],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new NotFoundError('Gagal Menambah like. Id tidak ditemukan')
        }
        await this._cacheService.del(`albums-${albumId}`)
        const message = 'Album berhasil di-like'
        return message
    }

    deleteAlbumLike = async (userId, albumId) => {
        const query = {
            text: 'DELETE FROM user_albums_likes WHERE user_id = $1 AND album_id = $2',
            values: [userId, albumId],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new NotFoundError('Gagal mengurangi like. Id tidak ditemukan')
        }
        await this._cacheService.del(`albums-${albumId}`)
        const message = 'Album berhasil di-unlike'
        return message
    }

    getAlbumLike = async (albumId) => {
        try {
            const result = await this._cacheService.get(`albums-${albumId}`)
            return {
                result: JSON.parse(result),
                isCached: 'cache',
            }
        } catch (error) {
            const query = {
                text: 'SELECT FROM user_albums_likes WHERE album_id = $1',
                values: [albumId],
            }
            const result = await this._pool.query(query)
            if (!result.rowCount) {
                return 0
            }
            await this._cacheService.set(`albums-${albumId}`, JSON.stringify(result.rowCount))
            return {
                result: result.rowCount,
                isCached: 'not-cached',
            }
        }
    }
    verifyAlbum = async (albumId) => {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [albumId],
        }
        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('Album tidak ditemukan di database')
        }
    }
}

module.exports = AlbumsService
