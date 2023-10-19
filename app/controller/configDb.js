const mongoose = require('mongoose');

const connectMongo = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log("Database is connected");
        
    } catch (error) {
        console.error("Database is not connected",error);
    }
};

module.exports = connectMongo ;
