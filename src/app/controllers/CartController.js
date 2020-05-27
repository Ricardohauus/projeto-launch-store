const Cart = require('../lib/cart')
const LoadProductService = require("../services/LoadProductService")

module.exports = {
  async index(req, res) {
    try {
      let { cart } = req.session;
      cart = Cart.init(cart)
      return res.render("cart/index", { cart })
    } catch (error) {
      console.log(error);
    }

  },
  async addOne(req, res) {
    try {
      const { id } = req.params;
      const product = await LoadProductService.load('product', { where: { id } })
      if (!product) return redirect('/cart')
      let { cart } = req.session;
      req.session.cart = Cart.init(cart).addOne(product)
      return res.redirect("/cart")
    } catch (error) {
      console.log(error);
    }

  },
  async removeOne(req, res) {
    try {
      let { cart } = req.session;
      if (!cart) return redirect('/cart')

      const { id } = req.params;
      const product = await LoadProductService.load('product', { where: { id } })

      if (!product) return redirect('/cart')

      req.session.cart = Cart.init(cart).removeOne(product.id)
      return res.redirect("/cart")
    } catch (error) {
      console.log(error);
    }

  }
}