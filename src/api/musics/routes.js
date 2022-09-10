const routes = ({postAlbumHandler, getAlbumByIdHandler, putAlbumByIdHandler, deleteAlbumByIdHandler}) => [
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
]

module.exports = routes