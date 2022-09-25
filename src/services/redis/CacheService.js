/* eslint-disable require-jsdoc */
const redis = require('redis')
const config = require('../../utils/config.js')
class CacheService {
    constructor() {
        this._client = redis.createClient({
            socket: {
                host: config.redis.host,
            },
        })
        this._client.on('error', (error) => {
            console.log(error)
        })
        this._client.connect()
    }

    set = async (key, value, expirationInSecond = 1800) => {
        await this._client.set(key, value, {
            EX: expirationInSecond,
        })
    }
    get = async (key) => {
        const result = await this._client.get(key)
        if (!result) {
            throw new Error('Catatan tidak ditemukan')
        }
        return result
    }
    del = async (key) => {
        return this._client.del(key)
    }
}
module.exports = CacheService
