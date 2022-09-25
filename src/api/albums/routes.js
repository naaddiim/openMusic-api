const routes = ({ postAlbumHandler, getAlbumByIdHandler, putAlbumByIdHandler, deleteAlbumByIdHandler,
    postAlbumLikesHandler, getAlbumLikesHandler }) => [
    {
        method: 'POST',
        path: '/albums',
        handler: postAlbumHandler,
    },
    {
        method: 'GET',
        path: '/albums/{id}',
        handler: getAlbumByIdHandler,
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: putAlbumByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: deleteAlbumByIdHandler,
    },
    {
        method: 'POST',
        path: '/albums/{id}/likes',
        handler: postAlbumLikesHandler,
        options: {
            auth: 'openMusic_jwt',
        },
    },
    {
        method: 'GET',
        path: '/albums/{id}/likes',
        handler: getAlbumLikesHandler,
    },
]

module.exports = routes
