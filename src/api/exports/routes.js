const routes = ({ postExportPlaylistsHandler }) => [
    {
        method: 'POST',
        path: '/export/playlists/{playlistsId}',
        handler: postExportPlaylistsHandler,
        options: {
            auth: 'openMusic_jwt',
        },
    },
]

module.exports = routes
