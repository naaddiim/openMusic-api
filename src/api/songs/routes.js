const routes = ({ postSongHandler, getSongByIdHandler, getSongsHandler, putSongByIdHandler, deleteSongByIdHandler }) => [
    {
        method: 'POST',
        path: '/songs',
        handler: postSongHandler,
    },
    {
        method: 'GET',
        path: '/songs',
        handler: getSongsHandler,
    },
    {
        method: 'GET',
        path: '/songs/{id}',
        handler: getSongByIdHandler,
    },
    {
        method: 'PUT',
        path: '/songs/{id}',
        handler: putSongByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/songs/{id}',
        handler: deleteSongByIdHandler,
    },
]

module.exports = routes
