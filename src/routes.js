const express = require('express')
const routes = express.Router()
const ProductController = require("./app/controllers/ProductController")
const multer = require("./app/middlewares/multer")

routes.get("/", function (req, res) {
  res.render("layout.njk")
})

routes.get("/products/create", ProductController.create)
routes.get("/products/:id/edit", ProductController.edit)
routes.get("/products/:id", ProductController.show)

routes.post("/products", multer.array("photos", 6), ProductController.saveOrUpdate)
routes.put("/products", multer.array("photos", 6), ProductController.saveOrUpdate)
routes.delete("/products", ProductController.delete)


routes.get("/ads/create", function (req, res) {
  res.redirect("/products/create")
})


module.exports = routes;