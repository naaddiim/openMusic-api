const routes = ({ postUploadImageHandler }) => [
    {
        method: 'POST',
        path: '/albums/{id}/covers',
        handler: postUploadImageHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
                maxBytes: 512000,
            },
        },
    },
]

module.exports = routes
