const LoadProductService = require("../services/LoadProductService")

module.exports = {
  async index(req, res) {
    try {
      const allProducts = await LoadProductService.load('products')
      if (!allProducts) {
        return res.render("home/index", {
          error: "Não há produtos disponiveis!"
        })
      }
      const products = allProducts.filter((product, index) => index > 2 ? false : true)
      return res.render("home/index", { products })
    } catch (error) {
      console.log(error);
    }

  }
}