const express = require('express');
const { route } = require('express/lib/application');
const req = require('express/lib/request');
const res = require('express/lib/response');
const router = express.Router();
const pool = require('../database');

router.get('/add', (req, res) => {
    res.render('links/add');
})
//RUTA PARA REGISTAR UN CARRO O MOT EN BASE DE DATOS 
router.post('/add', async(req, res) => {
    const {placa, tipo, description} = req.body;
    const newlinks = {
        placa,
        tipo,
        description
    };
    await pool.query('INSERT INTO cars set ?', [newlinks]);
    req.flash("success", 'Vehicle saved successfully');
    /* console.log(newlinks); */
    res.redirect('/links')
});
router.get('/', async(req, res) => {
    const cars = await pool.query('SELECT * FROM cars');
    
    res.render('links/list', {cars});
    

});
//PARA MOSTRAR EN PANTALLA LOS VEHICULOS AGREGADOS 
router.get('/delete/:id', async(req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM cars Where ID =?', [id]);
    req.flash("success", 'Vehicle remove successfully');
    res.redirect('/links');
})
//PARA OBTENER LA INFORMACION DE UN AUTO U MANDARLA A UN FORMULARIO PARA EDITARLA
router.get('/edit/:id',async(req, res) => {
    
    const {id} = req.params;
    const cars = await pool.query('SELECT * FROM cars WHERE id =?', [id]);
    res.render('links/edit', {cars: cars[0]});

})
//METODO PARA ACTUALIZAR EL VEHICULOS
router.post('/edit/:id', async(req, res) => {
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
    
    res.redirect('/links');
}); 


module.exports = router;

