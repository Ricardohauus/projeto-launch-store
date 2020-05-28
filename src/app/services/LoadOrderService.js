const Order = require('../models/Order')
const moment = require("moment")
const { formatPrice } = require("../lib/utils")
const LoadProductService = require("./LoadProductService")
const User = require("../models/User")

async function format(order) {
  order.product = await LoadProductService.load('product', {
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
}

const LoadService = {
  load(service, filter) {
    this.filter = filter;
    return this[service](filter)
  },
  async order() {
    try {
      const order = await Order.findOne(filter)
      return format(order)
    } catch (error) {
      console.log(error);
    }
  },
  async  orders() {
    try {
      const orders = await Order.findAll(this.filter)
      const ordersPromise = orders.map(order => format(order))
      return Promise.all(ordersPromise)
    } catch (error) {
      console.log(error);
    }
  },
  format
}

module.exports = LoadService