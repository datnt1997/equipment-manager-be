const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const usersRoute = require("../src/api/users.route");
const equipmentsRoute = require("../src/api/equipments.route");

const app = express()

app.use(cors())
// process.env.NODE_ENV !== 'prod' && app.use(morgan('dev'))
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Register api routes
app.use("/api/v1/user", usersRoute)
app.use("/api/v1/equipment", equipmentsRoute)
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

module.exports = app;
