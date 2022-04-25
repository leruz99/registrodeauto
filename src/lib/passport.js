const res = require('express/lib/response');
const passport = require('passport');
const pool = require('../database');
const helpers = require('../lib/helpers');
const { route } = require('../routes/authentication');

const LocalStrategy = require('passport-local').Strategy;
//LOGNIN 
passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true


}, async(req,email,password, done) => {
    console.log(req.body);
    const rows =  await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword =  await helpers.matchPassword(password, user.password);
        if (validPassword){
            done(null, user, req.flash('success','Welcome' + user.name));
        }else{
            done(null, false, req.flash('message','Incorrect pasword'))
        }
    }else{
        return done(null, false, req.flash( 'message','The gmail does not exist'))
    }
}));
//TODO EL REGISTER 
passport.use('local.signup', new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password',
    passReqToCallback: true,
}, async(req, name, password, done) => {
    const {email, tipo, description} = req.body;
    const newUser = {
        name,
        password,
        email,
        tipo, 
        description
    }
    console.log(newUser.tipo);
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);




}));

passport.serializeUser((user, done) => {
    done(null, user.id);
    
})
passport.deserializeUser( async(id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
})