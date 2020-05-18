const Category = require("../models/Category")
const Product = require("../models/Product")
const File = require("../models/File")
const { formatPrice } = require("../lib/utils")
const moment = require("moment")
module.exports = {
  logout(req, res) {
    req.session.destroy()
    return res.redirect("/")
  }
}