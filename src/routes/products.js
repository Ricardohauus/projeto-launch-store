const express = require('express')
const routes = express.Router()
const multer = require("../app/middlewares/multer")
const ProductController = require("../app/controllers/ProductController")
const SearchController = require("../app/controllers/SearchController")
const { redirectToLogin } = require("../app/middlewares/session")
//Search
routes.get("/products/search", SearchController.index)

//Products
routes.get("/create", redirectToLogin, ProductController.create)
routes.get("/:id/edit", ProductController.edit)
routes.get("/:id", ProductController.show)

routes.post("/", multer.array("photos", 6), ProductController.saveOrUpdate)
routes.put("/", multer.array("photos", 6), ProductController.saveOrUpdate)
routes.delete("/", ProductController.delete)

module.exports = routes;