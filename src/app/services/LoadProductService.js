const Product = require('../models/Product')
const moment = require("moment")
const { formatPrice } = require("../lib/utils")
const { unlinkSync } = require('fs')

async function getImage(productId) {
  let files = await Product.file(productId);
  files = files.map(file => ({
    ...file,
    src: `${file.path.replace(/[\/\\]/g, '/').replace("public", '')}`
  }))

  return files;
}

function deleteFiles(file) {
  unlinkSync(file)
}

async function format(product) {
  console.log(product);

  const files = await getImage(product.id)
  product.img = files[0] ? files[0].src : ''
  product.files = files
  product.formattedOldPrice = formatPrice(product.old_price)
  product.formattedPrice = formatPrice(product.price)
  product.updated_at = moment(product.updated_at).format('DD/MM/YYYY [ás] H[h]')
  return product;

}

const LoadService = {
  load(service, filter) {
    this.filter = filter;
    return this[service](filter)
  },
  async product() {
    try {
      const product = await Product.findOne(this.filter);
      return format(product)
    } catch (error) {
      console.log(error);
    }
  },
  async  products() {
    try {
      const products = await Product.findAll(this.filter);
      const producsPromise = products.map(product => format(product))
      return Promise.all(producsPromise)
    } catch (error) {
      console.log(error);
    }
  },
  format,
  deleteFiles
}

module.exports = LoadService