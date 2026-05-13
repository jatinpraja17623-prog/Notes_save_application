require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/db/db')

connectDB();

app.listen(3000 ,()=>{
    try{
        console.log('Server is runnning on the port 3000')
    }
    catch(error){
        console.error('Server not connected',error)
    }
})