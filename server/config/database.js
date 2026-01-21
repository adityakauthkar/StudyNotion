require("dotenv").config();
const mongoose = require("mongoose");
require("colors");


exports.connect = async() => {
      try {
        const con = await mongoose.connect(process.env.MONGO_URI);      

        console.log(`Cloud is connected to ${con.connection.host}`.blue);
       

    } catch (err) {
        console.error(`Error: ${err.message}`.red);
        process.exit(1);    
    }
}


