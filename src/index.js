const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { engine } = require('express-handlebars');
const flash  = require('connect-flash');
const session = require('express-session');
const mtsqlstore = require('express-mysql-session');
const {database} = require('./keys');
const passport = require('passport');



//initialization
const app = express();
require('./lib/passport');
//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs',  engine({
    defaultLayout : 'main',
    layoutsDir : path.join(app.get('views'), 'layouts'),
    partialsDir : path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');


//Middlewares
app.use(session({
    secret: 'mysqlcarUTB',
    resave: false,
    saveUninitialized: false,
    store: new mtsqlstore(database)
}))
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


//Global Variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;

    next();
})

//Routes
app.use(require('./routes'));
app.use( require('./routes/authentication'));
app.use('/cars',require('./routes/cars'));

//Public 
app.use(express.static(path.join(__dirname, 'public')));

//Startign
app.listen(app.get('port'), () => {
    console.log('listening on port', app.get('port'));
})