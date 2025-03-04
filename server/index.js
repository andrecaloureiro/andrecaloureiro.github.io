import express from 'express';
import mongoose from 'mongoose';       

import route from './routes/userRoute.js';

const app = express();

mongoose.connect('mongodb+srv://CRUDuser:CRUDuser123@mongodb.w3fpt.mongodb.net/kino-registros?retryWrites=true&w=majority&appName=MongoDB');

app.listen( 3001, () => {
    console.log('Server running on port 3001');
});

app.use('/api/user', route);

app.get('/goHome', (req, res) => {
    res.send('Welcome to the home page');
});