var mongoose = require('mongoose');

var problemsSchema = mongoose.Schema({
    lat: Number,
    lon: Number, 
    name: String,
    discr: String,
    photos: Array,
    users: Array,
    type: String,
    color: String
});

module.exports = mongoose.model('Problem', problemsSchema)