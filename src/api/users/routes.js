const routes = ({ postUserHandler }) => [
    {
        method: 'POST',
        path: '/users',
        handler: postUserHandler,
    },
]
module.exports = routes
