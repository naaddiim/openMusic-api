const successResponse = (h, { responseMessage, responseData, responseCode = 200 }) => {
    const response = {
        status: 'success',
    }
    if (responseMessage) {
        response.message = responseMessage
    }
    if (responseData) {
        response.data = responseData
    }
    return h.response(response).code(responseCode)
}
const failResponse = (h, error) => {
    return h.response({
        status: 'fail',
        message: error.message,
    }).code(error.statusCode)
}
const errorResponse = (h) => {
    return h.response({
        status: 'error',
        message: 'Ada kesalahan teknis pada server',
    }).code(500)
}
module.exports = { successResponse, failResponse, errorResponse }
