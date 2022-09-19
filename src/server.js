require('dotenv').config(
    { override: true },
)
// Plugin
const Jwt = require('@hapi/jwt')
const Hapi = require('@hapi/hapi')
const albums = require('./api/albums')
const songs = require('./api/songs')
const users = require('./api/users')
const playlists = require('./api/playlists')
const authentications = require('./api/authentications')
const collaborations = require('./api/collaborations')
// Services
const AlbumsService = require('./services/postgres/AlbumsService')
const AuthenticationsService = require('./services/postgres/AuthenticationsServices')
const SongsService = require('./services/postgres/SongsService')
const UsersService = require('./services/postgres/UsersService')
const PlaylistsService = require('./services/postgres/PlaylistsService')
const CollaborationsService = require('./services/postgres/CollaborationsService')
// Validator
const AlbumsValidator = require('./validator/albums')
const SongsValidator = require('./validator/songs')
const UsersValidator = require('./validator/users')
const AuthenticationsValidator = require('./validator/authentications')
const PlaylistsValidator = require('./validator/playlists')
const CollaborationsValidator = require('./validator/collaborations')
// Token Manager
const TokenManager = require('./tokenize/TokenManager')
// Response Template & Exception Handling
const { errorResponse, failResponse, failAuthResponse } = require('./utils/responses')
const ClientError = require('./exceptions/ClientError')

const init = async () => {
    const albumsService = new AlbumsService()
    const songsService = new SongsService()
    const usersService = new UsersService()
    const authenticationsService = new AuthenticationsService()
    const collaborationsService = new CollaborationsService()
    const playlistsService = new PlaylistsService(collaborationsService)
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
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
    ])
    server.ext('onPreResponse', (request, h) => {
        const { response } = request
        if (response instanceof ClientError) {
            return failResponse(h, response)
        }
        if (response instanceof Error) {
            if (response.output.statusCode === 401) {
                return failAuthResponse(h, response)
            }
            return errorResponse(h)
        }
        return response.continue || response
    })
    await server.start()
    console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
