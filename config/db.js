const mongoose = require("mongoose");
const connectDB = async ()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Database is connect ${connect.connection.host}`);
    }
    catch(error){
        console.log("Error in  connection");
    }
}

module.exports = connectDB;