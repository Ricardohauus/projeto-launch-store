const Category = require("../models/Category")
const Product = require("../models/Product")
const File = require("../models/File")
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
    if (req.files.length == 0) {
      return res.send('Por favor, Envie pelo menos uma imagem!')
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

    const filesPromise = req.files.map(file => File.create({
      ...file, product_id: productId
    }))

    await Promise.all(filesPromise)

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

    results = await Product.file(product.id);
    let files = results.rows
    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
    }))

    console.log(req.headers);

    return res.render("products/create.njk", { product, categories, files })

  },
  async delete(req, res) {
    const { id } = req.body
    await Product.delete(id);
    return res.send("deletado")
  }
}