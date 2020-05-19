const express = require('express')
const routes = express.Router()
const UserController = require("../app/controllers/UserController")
const SessionController = require("../app/controllers/SessionController")

// Users - Login / Logout
routes.get("/login", SessionController.loginForm)
routes.post("/login", SessionController.login)
routes.post("/logout", SessionController.logout)

// Users - Reset Password / Forgot
// routes.get("/forgot-password", SessionController.forgotForm)
// routes.get("/password-reset", SessionController.resetForm)
// routes.post("/forgot-password", SessionController.forgot)
// routes.post("/password-reset", SessionController.reset)

// Users - Register 
routes.get("/register", UserController.registerForm)
routes.post("/register", UserController.saveOrUpdate)
routes.put("/register", UserController.saveOrUpdate)

routes.get("/", UserController.show)
routes.delete("/", UserController.delete)

module.exports = routes;