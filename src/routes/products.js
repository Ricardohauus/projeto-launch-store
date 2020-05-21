const express = require('express')
const routes = express.Router()
const multer = require("../app/middlewares/multer")
const ProductController = require("../app/controllers/ProductController")
const SearchController = require("../app/controllers/SearchController")
const ProductValidator = require("../app/validators/product")
const { onlyUsers } = require("../app/middlewares/session")
//Search
routes.get("/search", SearchController.index)

//Products
routes.get("/create", onlyUsers, ProductController.create)
routes.get("/:id/edit", onlyUsers, ProductController.edit)
routes.get("/:id", ProductController.show)

routes.post("/", onlyUsers, multer.array("photos", 6), ProductValidator.saveOrUpdate, ProductController.saveOrUpdate)
routes.put("/", onlyUsers, multer.array("photos", 6), ProductValidator.saveOrUpdate, ProductController.saveOrUpdate)
routes.delete("/", onlyUsers, ProductController.delete)

module.exports = routes;