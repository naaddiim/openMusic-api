require('dotenv').config({ override: true })
const config = require('./utils/config')
// Plugin
const Jwt = require('@hapi/jwt')
const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const albums = require('./api/albums')
const songs = require('./api/songs')
const users = require('./api/users')
const playlists = require('./api/playlists')
const authentications = require('./api/authentications')
const collaborations = require('./api/collaborations')
const _exports = require('./api/exports')
const uploads = require('./api/uploads')
// Services
const AlbumsService = require('./services/postgres/AlbumsService')
const AuthenticationsService = require('./services/postgres/AuthenticationsServices')
const SongsService = require('./services/postgres/SongsService')
const UsersService = require('./services/postgres/UsersService')
const PlaylistsService = require('./services/postgres/PlaylistsService')
const CollaborationsService = require('./services/postgres/CollaborationsService')
const producerService = require('./services/rabbitmq/ProducerService')
const StorageService = require('./services/s3/StorageService')
const CacheService = require('./services/redis/CacheService')
// Validator
const AlbumsValidator = require('./validator/albums')
const SongsValidator = require('./validator/songs')
const UsersValidator = require('./validator/users')
const AuthenticationsValidator = require('./validator/authentications')
const PlaylistsValidator = require('./validator/playlists')
const CollaborationsValidator = require('./validator/collaborations')
const ExportsValidator = require('./validator/exports')
const UploadsValidator = require('./validator/uploads')
// Token Manager
const TokenManager = require('./tokenize/TokenManager')
// Response Template & Exception Handling
const { errorResponse, failResponse } = require('./utils/responses')
const ClientError = require('./exceptions/ClientError')

const init = async () => {
    const cacheService = new CacheService()
    const albumsService = new AlbumsService(cacheService)
    const songsService = new SongsService()
    const usersService = new UsersService()
    const storageService = new StorageService()
    const authenticationsService = new AuthenticationsService()
    const collaborationsService = new CollaborationsService()
    const playlistsService = new PlaylistsService(collaborationsService)
    const server = Hapi.server({
        host: config.app.host,
        port: config.app.port,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    })
    await server.register([
        {
            plugin: Jwt,
        },
        {
            plugin: Inert,
        },
    ])
    server.auth.strategy('openMusic_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    })
    await server.register([
        {
            plugin: albums,
            options: {
                service: albumsService,
                validator: AlbumsValidator,
            },
        },
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongsValidator,
            },
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator,
            },
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            },
        },
        {
            plugin: playlists,
            options: {
                service: playlistsService,
                validator: PlaylistsValidator,
            },
        },
        {
            plugin: collaborations,
            options: {
                collaborationsService,
                playlistsService,
                validator: CollaborationsValidator,
            },
        },
        {
            plugin: _exports,
            options: {
                service: producerService,
                validator: ExportsValidator,
                playlistsService,
            },
        },
        {
            plugin: uploads,
            options: {
                service: storageService,
                validator: UploadsValidator,
                albumsService,
            },
        },
    ])
    server.ext('onPreResponse', (request, h) => {
        const { response } = request
        if (response instanceof ClientError) {
            return failResponse(h, response)
        }
        if (!response.isServer) {
            return h.continue;
        }
        if (response instanceof Error) {
            return errorResponse(h)
        }
        return response.continue || response
    })
    await server.start()
    console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
