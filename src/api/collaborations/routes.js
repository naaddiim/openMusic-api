const routes = ({ postCollaborationHandler, deleteCollaborationHandler }) => [
    {
        method: 'POST',
        path: '/collaborations',
        handler: postCollaborationHandler,
        options: {
            auth: 'openMusic_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/collaborations',
        handler: deleteCollaborationHandler,
        options: {
            auth: 'openMusic_jwt',
        },
    },
]

module.exports = routes
