var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MascotaSchema   = new Schema({
	nombre: String,
    raza: String,
    edad: Number,
});

module.exports = mongoose.model('Mascota', MascotaSchema);