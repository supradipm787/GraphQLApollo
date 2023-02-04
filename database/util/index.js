//file to initialize DB connection
const mongoose = require ('mongoose');

module.exports.connection = async () => {
    try{
        //To print all DB queries
        mongoose.set ('debug', true);
    await mongoose.connect (process.env.MONGO_DB_URL , 
        {useNewUrlParser : true, useUnifiedTopology : true});
        console.log ('Database Connection Succeeded');
    }catch (error){
        console.log (error); 
        throw error;
    }
}