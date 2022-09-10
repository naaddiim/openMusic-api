require('dotenv').config()
const Hapi = require('@hapi/hapi')
const musics = require('./api/musics')
const AlbumsService = require('./services/postgres/AlbumsService')
const AlbumsValidator = require('./validator/albums')

const init = async () => {
    const albumsService = new AlbumsService()
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    })
    await server.register({
        plugin: musics,
        options: {
            service: albumsService,
            validator: AlbumsValidator,
        },
    })

    await server.start()
    console.log(`Server berjalan pada ${server.info.uri}`)
}

init()