const express = require('express');
const { route } = require('express/lib/application');
const req = require('express/lib/request');
const res = require('express/lib/response');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


router.get('/add', isLoggedIn, (req, res) => {
    res.render('cars/add');
})
//RUTA PARA REGISTAR UN CARRO O MOT EN BASE DE DATOS 
router.post('/add', isLoggedIn,  async(req, res) => {
    const {placa, tipo, description} = req.body;
    const newlinks = {
        placa,
        tipo,
        description,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO cars set ?', [newlinks]);
    req.flash("success", 'Vehicle saved successfully');
    /* console.log(newlinks); */
    res.redirect('/cars')
});
router.get('/', isLoggedIn, async(req, res) => {
    const cars = await pool.query('SELECT * FROM cars WHERE user_id = ?' , [req.user.id]);
    
    res.render('cars/cars', {cars});
    

});
//PARA MOSTRAR EN PANTALLA LOS VEHICULOS AGREGADOS 
router.get('/delete/:id', isLoggedIn, async(req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM cars Where ID =?', [id]);
    req.flash("success", 'Vehicle remove successfully');
    res.redirect('/cars');
})
//PARA OBTENER LA INFORMACION DE UN AUTO U MANDARLA A UN FORMULARIO PARA EDITARLA
router.get('/edit/:id',isLoggedIn,  async(req, res) => {
    
    const {id} = req.params;
    const cars = await pool.query('SELECT * FROM cars WHERE id =?', [id]);
    res.render('cars/edit', {cars: cars[0]});

})
//METODO PARA ACTUALIZAR EL VEHICULOS
router.post('/edit/:id',isLoggedIn, async(req, res) => {
    const {id} = req.params;
    const {placa, tipo, description} = req.body;
    const newlinks = {
        placa,
        tipo,
        description
    };
    console.log(newlinks);
    await pool.query('UPDATE cars set ? WHERE id =?', [newlinks, id]);
    req.flash("success", 'Vehicle Updated  Successfully');
    
    res.redirect('/cars');
}); 


module.exports = router;

