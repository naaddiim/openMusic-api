const { SongPayloadSchema } = require('./schema')
const InvariantError = require('../../exceptions/InvariantError')

const SongsValidator = {
    validateSongPayLoad: (payload) => {
        const validationResult = SongPayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    },
}

module.exports = SongsValidator
