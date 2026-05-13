const express = require('express');
const cors = require("cors"); 
const cookieParser = require('cookie-parser')
const authRoutes = require('../src/routes/auth.routes')
const notesRoutes = require('../src/routes/notes.routes'); 


const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://notes-save-application.vercel.app"
  ]
}));
app.use(express.json());
app.use(cookieParser());



app.use('/api/auth',authRoutes) 
app.use('/api/notes', notesRoutes); 

module.exports = app;