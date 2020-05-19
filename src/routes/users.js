const express = require('express')
const routes = express.Router()
const UserController = require("../app/controllers/UserController")
const SessionController = require("../app/controllers/SessionController")
const { isLoggedRedirectToUsers, onlyUsers } = require("../app/middlewares/session")

// Users - Login / Logout
routes.get("/login", isLoggedRedirectToUsers, SessionController.loginForm)
routes.post("/login", SessionController.login)
routes.post("/logout", SessionController.logout)

// Users - Reset Password / Forgot
routes.get("/forgot-password", SessionController.forgotForm)
routes.post("/forgot-password", SessionController.forgot)
routes.get("/password-reset", SessionController.resetForm)
routes.post("/password-reset", SessionController.reset)

// Users - Register 
routes.get("/register", UserController.registerForm)
routes.post("/register", UserController.saveOrUpdate)
routes.put("/register", onlyUsers, UserController.saveOrUpdate)

routes.get("/", onlyUsers, UserController.show)
routes.delete("/", onlyUsers, UserController.delete)

module.exports = routes;