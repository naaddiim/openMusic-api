const Joi = require('joi')

const SongPayloadSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().positive().required(),
    genre: Joi.string().required(),
    performer: Joi.string().required(),
    duration: Joi.number().positive(),
    albumId: Joi.string(),
})

module.exports = { SongPayloadSchema }
