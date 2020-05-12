const Category = require("../models/Category")
const Product = require("../models/Product")
module.exports = {

  create(req, res) {
    Category.all().then((result) => {
      const categories = result.rows
      return res.render("products/create", { categories })
    }).catch((err) => {
      throw new Error(err)
    });

  },
  async post(req, res) {
    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send('Por favor, Preencha todos os campos!')
      }
    }

    const results = await Product.create(req.body);
    const productId = results.rows[0].id;
    results = await Category.all();
    const categories = results.rows

    return res.render(`/products/create`, { productId, categories })

  },

}