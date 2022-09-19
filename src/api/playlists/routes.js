const routes = ({ postPlaylistHandler, getPlaylistHandler, deletePlaylistHandler, postSongToPlaylistHandler,
    getSongFromPlaylistHandler, deleteSongFromPlaylistHandler, getPlaylistActivitiesHandler }) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: postPlaylistHandler,
        options: {
            auth: 'openMusic_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: getPlaylistHandler,
        options: {
            auth: 'openMusic_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: deletePlaylistHandler,
        options: {
            auth: 'openMusic_jwt',
        },
    },
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: postSongToPlaylistHandler,
        options: {
            auth: 'openMusic_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: getSongFromPlaylistHandler,
        options: {
            auth: 'openMusic_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: deleteSongFromPlaylistHandler,
        options: {
            auth: 'openMusic_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{id}/activities',
        handler: getPlaylistActivitiesHandler,
        options: {
            auth: 'openMusic_jwt',
        },
    },
]
module.exports = routes
