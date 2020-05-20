const Category = require("../models/Category")
const Product = require("../models/Product")
const File = require("../models/File")
const { formatPrice } = require("../lib/utils")
const moment = require("moment")

module.exports = {
  async index(req, res) {
    try {
      const products = await Product.findAll();

      if (!products) {
        return res.render("home/index", {
          error: "Não há produtos disponiveis!"
        })
      }

      async function getImage(productId) {
        let files = await Product.file(productId);
        files = files.map(file => src = `${req.protocol}://${req.headers.host}${file.path.replace(/[\/\\]/g, '/').replace("public", '')}`)
        return files[0];
      }

      const promisseProducts = products.map(async product => {
        product.img = await getImage(product.id)
        product.price = formatPrice(product.price)
        product.old_price = formatPrice(product.old_price)
        return product;
      }).filter((product, index) => index > 2 ? false : true)

      const lastAdded = await Promise.all(promisseProducts)

      return res.render("home/index", { products: lastAdded })
    } catch (error) {
      console.log(error);
    }

  }
}