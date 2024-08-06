require("dotenv").config()
const express = require("express")
const connection = require("./src/db/dbConnection")
const { createServer } = require("http")
const bodyParser = require("body-parser")

const app = express()

const server = createServer(app)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

connection()

const userRoutes = require("./src/User/routes/user.route")
const ApiError = require("./src/utils/ApiError")

// app.use("/api/v1/user", userRoutes)
app.use(userRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let customError = err;

    // Handle validation errors
    if (err.name === "ValidationError") {
        customError = new ApiError(
            400,
            "Validation Error",
            Object.values(err.errors).map((e) => e.message)
        );
    } else if (err.code === 11000) {
        // Handle unique field errors
        const duplicateField = Object.keys(err.keyValue)[0];
        customError = new ApiError(400, `${duplicateField} already exists`, []);
    } else if (!(err instanceof ApiError)) {
        customError = new ApiError(500, "Internal Server Error", [], err.stack);
    }

    res.status(customError.statusCode || 500).json(customError.toJSON());
});

const port = process.env.PORT || 8000


server.listen(port, () => {
    console.log(`Server is running on ${port}`)
})