const express = require('express')
const routes = express.Router()

routes.get("/", function (req, res) {
  res.render("layout.njk")
})


module.exports = routes;