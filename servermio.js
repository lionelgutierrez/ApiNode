var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

app.use(bodyParser.urlencoded({ extended: true })); //recibe parametros por url
app.use(bodyParser.json()); //recibe parametros por json

var port     = process.env.PORT || 8080; 

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mascotas'); 
var Mascota     = require('./model/mascota');

// crear el router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	console.log('Llega conexion de cliente.');
	next();
});

// Acceso a http://localhost:8080/miapi)
router.get('/', function(req, res) {
	res.json({ message: 'Home de la aplicacion RestFull' });	
});

// Api de personas /personas
// ----------------------------------------------------
router.route('/mascotas')

	// crear unaa masctoa (POST http://localhost:8080/miapi/mascotas)
	.post(function(req, res) {
		
		var mascota = new Mascota();		
		mascota.nombre = req.body.nombre;
        mascota.raza = req.body.raza;
        mascota.edad = req.body.edad;

		mascota.save(function(err) {
			if (err)
				res.send(err);
			res.json({ message: 'mascota creada correctamente' });
		});

		
	})

	// obtener todas las mascotas (GET http://localhost:8080/miapi/mascotas)
	.get(function(req, res) {
		Mascota.find(function(err, mascota) {
			if (err)
				res.send(err);
			res.json(mascota);
		});
	});

// /mascotas/:mascota_id
// ----------------------------------------------------
router.route('/mascotas/:mascota_id')
	// obtener persona con ese id
	.get(function(req, res) {
		Mascota.findById(req.params.mascota_id, function(err, mascota) {
			if (err)
				res.send(err);
			res.json(mascota);
		});
	})

	// update de la persona con ese id
	.put(function(req, res) {
		Mascota.findById(req.params.mascota_id, function(err, mascota) {
			if (err)
				res.send(err);
            mascota.nombre = req.body.nombre;
            mascota.raza = req.body.raza;
            mascota.edad = req.body.edad;
			mascota.save(function(err) {
				if (err)
					res.send(err);
				res.json({ message: 'mascota actualizada' });
			});
		});
	})

	// borrar la persona con ese id
	.delete(function(req, res) {
		Mascota.remove({
			_id: req.params.mascota_id
		}, function(err, mascota) {
			if (err)
				res.send(err);
			res.json({ message: 'Se borro la mascota de ID '+ req.params.mascota_id});
		});
	});

// Registrar las rutas
app.use('/miapi', router);

var error404 = function(req,res,next){
    res.status(404).send('No existe esta pagina en la aplicacion web');
};

app.use(error404);
app.listen(port);
console.log('Server levantado en puerto ' + port);
