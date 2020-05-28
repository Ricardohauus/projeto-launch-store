const LoadProductService = require("../services/LoadProductService")
const LoadOrderService = require("../services/LoadOrderService")
const User = require("../models/User")
const mailer = require("../lib/mailer")
const Cart = require("../lib/cart")
const Order = require("../models/Order")


module.exports = {
  async post(req, res) {
    try {

      const cart = Cart.init(req.session.cart)
      const buyer_id = req.session.userId

      const filteredItems = cart.items.filter(item =>
        item.product.user_id != buyer_id
      )

      const createOrdersPromisse = filteredItems.map(async item => {
        let { product, price: total, quantity } = item
        const { price, id: product_id, user_id: seller_id } = product
        const status = "open"

        const order = await Order.create({
          total,
          quantity,
          price,
          product_id,
          seller_id,
          status,
          buyer_id
        })
        const { id } = req.body

        product = await LoadProductService.load('product', {
          where: {
            id: product.id
          }
        })
        const seller = await User.findOne({
          where: {
            id: seller_id
          }
        })
        const buyer = await User.findOne({
          where: {
            id: buyer_id
          }
        })

        await mailer.sendMail({
          to: seller.email,
          from: 'no-reply@launchsotre.com.br',
          subject: `Parabéns ${seller.name}! Seu produto acabou de ser vendido!`,
          html: `<h2>Parabéns pela sua venda!</h2>
          <h1>Dados do produto!</h1>
          <p>Produto: ${product.name} </p>
          <p>Preço: ${product.formattedPrice} </p>
          <p><br/><br/></p>
          <h1>Dados da compra!</h1>
          <p>Comprador: ${buyer.name} CPF / CNPJ: ${buyer.cpf_cnpj}  </p>
          <p>Endereço: ${buyer.address} - CEP: ${buyer.cep} </p>
          <p>Email: ${buyer.email} </p>
          <p><br/><br/></p>
          <p><strong>Entre em contato com o comprador para finalizar a venda!</strong></p>
          <p><br/><br/></p>
          <p>Atenciosamente, Equipe LaunchStore!</p>
          `
        })
        return order;
      })

      await Promise.all(createOrdersPromisse)

      delete req.session.cart;
      Cart.init()

      return res.render("orders/success")
    } catch (error) {
      console.log(error);
      return res.render("orders/error")
    }

  },
  async index(req, res) {

    const orders = await LoadOrderService.load('orders', { where: { buyer_id: req.session.userId } })
    return res.render("orders/index", { orders })
  },
  async sales(req, res) {

    const sales = await LoadOrderService.load('orders', { where: { seller_id: req.session.userId } })
    return res.render("orders/sales", { sales })
  },
  async show(req, res) {
    const order = await LoadOrderService.load('order', { where: { id: req.params.id } })
    return res.render("orders/details", { order })
  },
  async update(req, res) {
    try {

      const { id, action } = req.params
      const acceptedActions = ['close', 'cancel']
      if (!acceptedActions.includes(action)) return res.send("Não pode fazer esta ação!")

      let order = await Order.findOne({ where: { id }, or: { status: 'open' } })

      if (!order) return res.send('Pedido já finalizado ou não encontrado!')

      const statuses = {
        close: 'sold',
        cancel: 'cancelled'
      }

      order.status = statuses[action]

      await Order.update(id, {
        status: order.status
      })

      return res.redirect("/orders/sales")
    } catch (error) {
      console.log(error);
    }
  }
}