const mongoose = require("mongoose")
const mongooseConnect = async() => {
    try {
        const connection = await mongoose.connect(`${process.env.DB_URI}`)
        console.log("Mongodb connected !!")

    } catch (error) {
        console.log("Mongodb connection failed", error)
    }

}



module.exports = mongooseConnect