const express = require('express');
const app = express();
const  mongoose = require('mongoose');
const dotenv = require('dotenv');
//IMPORT ROUTES
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

//CONNECT TO DB
mongoose.connect(
    process.env.DB_CONNECT, { useNewUrlParser: true },
    () => console.log('connected to db!')
);

//MIDDLEWARE
app.use(express.json());
//ROUTE MIDDLEWARE
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute); 

app.listen(3000, () => console.log('Server up and flying'));
