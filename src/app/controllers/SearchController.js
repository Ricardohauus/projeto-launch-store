const Category = require("../models/Category")
const Product = require("../models/Product")
const File = require("../models/File")
const { formatPrice } = require("../lib/utils")
const moment = require("moment")

module.exports = {
  async index(req, res) {
    try {
      let results, params = {}

      const { filter, category } = req.query

      if (!filter) return res.redirect("/")

      params.filter = filter;

      if (category) {
        params.category = category;
      }

      async function getImage(productId) {
        let files = await Product.file(productId);
        files = files.map(file => src = `${req.protocol}://${req.headers.host}${file.path.replace(/[\/\\]/g, '/').replace("public", '')}`)
        return files[0];
      }

      let products = await Product.search(params)

      if (!products) { return res.send("Não há nenhum registro") }

      const productPromise = products.map(async product => {
        product.img = await getImage(product.id)
        product.price = formatPrice(product.price)
        product.old_price = formatPrice(product.old_price)
        return product;
      })

      products = await Promise.all(productPromise)

      const search = {
        term: req.query.filter,
        total: products.length
      }

      const categories = products.map(product => ({
        id: product.category_id,
        name: product.category_name
      })).reduce((categoriesFiltered, category) => {
        const found = categoriesFiltered.some(cat => cat.id == category.id)

        if (!found) categoriesFiltered.push(category)

        return categoriesFiltered
      }, [])

      return res.render("search/index", { products, search, categories })
    } catch (error) {
      console.log(error);
      return;
    }
  }
}