const LoadProductService = require("../services/LoadProductService")
const User = require("../models/User")
const mailer = require("../lib/mailer")
const Cart = require("../lib/cart")
const Order = require("../models/Order")
const { formatPrice } = require("../lib/utils")
const moment = require("moment")
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
    let orders = await Order.findAll({ where: { buyer_id: req.session.userId } })

    const getOrdersPromise = orders.map(async order => {
      order.product = await LoadProductService.load('products', {
        where: { id: order.product_id }
      })

      order.buyer = await User.findOne({ where: { id: order.buyer_id } })
      order.seller = await User.findOne({ where: { id: order.seller_id } })

      order.formattedPrice = formatPrice(order.price)
      order.formattedTotal = formatPrice(order.total)

      const statuses = {
        open: 'Aberto',
        sold: 'Vendido',
        canceled: 'Cancelado',
      }

      order.formattedStatus = statuses[order.status]

      const updatedAt = moment(order.updated_at).format('DD/MM/YYYY [ás] H[h]')

      order.formattedUpdatedAt = `${order.formattedStatus} em ${updatedAt}`

      return order;
    })

    orders = await Promise.all(getOrdersPromise)
    return res.render("orders/index", { orders })
  }
}