const express = require('express')
const routes = express.Router()
const UserController = require("../app/controllers/UserController")
const SessionController = require("../app/controllers/SessionController")
const { isLoggedRedirectToUsers, onlyUsers } = require("../app/middlewares/session")
const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')

// Users - Login / Logout
routes.get("/login", isLoggedRedirectToUsers, SessionController.loginForm)
routes.post("/login", SessionValidator.login, SessionController.login)
routes.post("/logout", SessionController.logout, SessionController.logout)

// Users - Reset Password / Forgot
routes.get("/forgot-password", SessionController.forgotForm)
routes.post("/forgot-password", SessionValidator.forgot, SessionController.forgot)
routes.get("/password-reset", SessionController.resetForm)
routes.post("/password-reset", SessionValidator.reset, SessionController.reset)

// Users - Register 
routes.get("/register", UserController.registerForm)
routes.post("/register", UserValidator.saveOrUpdate, UserController.saveOrUpdate)
routes.put("/register", onlyUsers, UserValidator.saveOrUpdate, UserController.saveOrUpdate)

routes.get("/", onlyUsers, UserValidator.show, UserController.show)
routes.delete("/", onlyUsers, UserController.delete)

routes.get("/ads", UserController.ads)




module.exports = routes;