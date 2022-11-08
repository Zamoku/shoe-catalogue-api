const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
// const flash = require('express-flash');
// const session = require('express-session');
const Shoes = require('./shoes');
const ShoesRoute = require('./shoesRoute');


const pgPromise = require("pg-promise")
const pgp = pgPromise({})

// SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://zamoe:zamo123@localhost:5432/shoes_db';

const db = pgp({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

const shoes = Shoes(db)
// const shoesFunct = ShoesRoute()
const shoesRoute = ShoesRoute()

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
 app.use(bodyParser.json());

//  app.use(session({
//     secret: "my shoes secret",
//     cookie: {
//         maxAge: 1000 * 36000
//       },
//     resave: false,
//     saveUninitialized: true
// }));

//  app.use(flash());

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

 app.get('/', shoesRoute.listShoes);
// app.get('/api/shoes/brand/:brandname', shoesRoute.);
// app.get('/api/shoes/size/:size', shoesRoute.);
// app.get('/api/shoes/brand/:brandname/size/:size', shoesRoute.);
// app.post('/api/shoes/sold/:id', shoesRoute.);
// app.post('/api/shoes', shoesRoute.);


const PORT = process.env.PORT || 3005

app.listen(PORT, function() {
    console.log('App started at port:', PORT)

})