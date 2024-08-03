require("dotenv").config()
const express = require("express")
const connection = require("./src/db/dbConnection")
const { createServer } = require("http")

const app = express()

const server = createServer(app)

connection()

const port = process.env.PORT || 8000


server.listen(port, () => {
    console.log(`Server is running on ${port}`)
})