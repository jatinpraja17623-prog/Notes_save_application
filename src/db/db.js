const mongoose = require('mongoose')

async function connectDB(){
    
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connect to database Successfully');
    }
    catch(error){
        console.error("Can't connected to database", error)
    }
}

module.exports = connectDB;