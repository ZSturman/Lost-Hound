const Joi = require('joi');

const lostPetSchema = Joi.object({
    petName: Joi.string().min(1).max(30).required(),
    age: Joi.number().min(1).max(3).required(),
    species: Joi.string().min(1).max(30).required(),
    breed: Joi.string().min(1).max(30),
    primaryColour: Joi.string().min(1).max(30).required(),
    secondaryColour: Joi.string().min(1).max(30),
    // TODO: Change location validation (long/lat), date and time to restrict UTC only, image(not sure).
    locationLastSeen: Joi.string().min(1).max(30).required(),
    dateLastSeen: Joi.date().required(),
    timeLastSeen: Joi.string().min(1).max(30),
    description: Joi.string().min(1).max(1000),
    image: Joi.string().min(1).max(1000),
});

const spottedPetSchema = Joi.object({
    species: Joi.string().min(1).max(30).required(),
    breed: Joi.string().min(1).max(30),
    primaryColour: Joi.string().min(1).max(30).required(),
    secondaryColour: Joi.string().min(1).max(30),
    // TODO: Change location validation (long/lat), date and time to restrict UTC only, image(not sure).
    locationLastSeen: Joi.string().min(1).max(30).required(),
    dateLastSeen: Joi.date().required(),
    timeLastSeen: Joi.string().min(1).max(30),
    description: Joi.string().min(1).max(1000),
    image: Joi.string().min(1).max(1000)
});



module.exports = {
    lostPetSchema,
    spottedPetSchema
}