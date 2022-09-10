const Joi = require('joi')

const AlbumPayloadSchema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number().positive().required(),
})

module.exports = { AlbumPayloadSchema }
