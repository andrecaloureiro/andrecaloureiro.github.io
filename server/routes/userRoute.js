import express from 'express';  
import {getMessage,create} from '../controller/userController.js';

const route = express.Router(); 

route.post('/getMsg', getMessage);
route.get('/create', create);

export default route;