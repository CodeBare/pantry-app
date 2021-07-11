const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MeasurementSchema = new Schema({
    description: {
        type: String
    },
    abbreviation: {
        type: String,
        maxlength: 3
    },
    system: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId
    },
    measurement: {
        type: Number,
    }
})

MeasurementSchema.set('toJSON', {
    transform: (doc, returnedObject) => {
        returnedObject.measurementID = returnedObject._id.toString()
        returnedObject.createdBy = returnedObject.createdBy.toString()
        delete returnedObject._id
        delete returnedObject.__v
        return returnedObject
    }
})

module.exports = mongoose.model('Measurement', MeasurementSchema);