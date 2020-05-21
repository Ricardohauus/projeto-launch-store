const Category = require("../models/Category")
const Product = require("../models/Product")
const File = require("../models/File")
const { unlinkSync } = require('fs')
const LoadProductService = require("../services/LoadProductService")

module.exports = {
  async create(req, res) {
    try {
      const categories = await Category.findAll()
      return res.render("products/create", { categories })
    } catch (error) {
      console.log(error);
    }
  },
  async saveOrUpdate(req, res) {
    try {
      let { id, category_id, name, description,
        old_price, price, quantity, status } = req.body
      let { userId: user_id } = req.session;

      if (id) {

        if (old_price != price) {
          const oldProduct = await Product.find(id);
          const { price: oldProductPrice } = oldProduct;
          old_price = oldProductPrice.toString();
        }

        if (req.body.removed_files) {
          const removedFiles = req.body.removed_files.split(",")
          const lastIndex = removedFiles.length - 1
          removedFiles.splice(lastIndex, 1)
          const removedFilesPromisse = removedFiles.map(id => File.delete(id))
          await Promise.all(removedFilesPromisse);
        }

        price = price.replace(/\D/g, "")
        old_price = old_price.replace(/\D/g, "")

        await Product.update(id, {
          category_id,
          name,
          description,
          old_price,
          price,
          quantity,
          status,
        })

      } else {
        price = price.replace(/\D/g, "")
        id = await Product.create({
          category_id,
          name,
          description,
          old_price: old_price || price,
          price,
          quantity,
          user_id,
          status: status || 1
        })
      }

      const filesPromise = req.files.map(file => File.create({
        name: file.filename,
        path: file.path,
        product_id: id
      }))

      await Promise.all(filesPromise)

      return res.redirect(`products/${id}`)
    } catch (error) {
      console.log(error);
    }

  },
  async edit(req, res) {
    try {
      const { id } = req.params
      const product = await LoadProductService.load('product', { where: { id } })

      if (!product) return res.send("Produto não encontrado")

      const categories = await Category.findAll();

      return res.render("products/create.njk", { product, categories })
    } catch (error) {
      console.log(error);
    }
  },
  async delete(req, res) {
    const files = await Product.file(req.body.id)

    await Product.delete(req.body.id)

    files.map(file => {
      try {
        unlinkSync(file.path)
      } catch (err) {
        console.error(err)
      }
    })
    return res.redirect('/products/create')
  },
  async show(req, res) {
    try {
      const { id } = req.params
      let product = await LoadProductService.load('product', { where: { id } })
      if (!product) return res.send("Produto não encontrado")

      return res.render("products/show", { product })
    } catch (error) {
      console.log(error);
    }

  }
}