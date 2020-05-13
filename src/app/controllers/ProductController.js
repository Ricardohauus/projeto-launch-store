const Category = require("../models/Category")
const Product = require("../models/Product")
const { formatPrice } = require("../lib/utils")
module.exports = {

  create(req, res) {
    Category.all().then((result) => {
      const categories = result.rows
      return res.render("products/create", { categories })
    }).catch((err) => {
      throw new Error(err)
    });

  },
  async saveOrUpdate(req, res) {
    const keys = Object.keys(req.body)
    const { id } = req.body
    let results;
    let productId;

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send('Por favor, Preencha todos os campos!')
      }
    }

    req.body.price = req.body.price.replace(/\D/g, "")

    if (id) {
      const oldProduct = await Product.find(id);
      const { price } = oldProduct.rows[0];

      if (price != req.body.price) {
        req.body.old_price = price
      }
      results = await Product.update(req.body);
    } else {
      results = await Product.create(req.body);
    }

    productId = results.rows[0].id;
    return res.redirect(`products/${productId}/edit`)
  },
  async edit(req, res) {
    const { id } = req.params
    let results = await Product.find(id);

    const product = results.rows[0];

    if (!product) return res.send("Produto não encontrado")

    product.price = product.price ? formatPrice(product.price) : product.price

    results = await Category.all();
    const categories = results.rows
    return res.render("products/create.njk", { product, categories })

  },
  delete(req, res) {
    const { id } = req.body
    Product.delete(id);
    return res.send("deletado")
  }
}