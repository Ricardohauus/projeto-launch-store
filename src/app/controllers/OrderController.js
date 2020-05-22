const LoadProductService = require("../services/LoadProductService")
const User = require("../models/User")
const mailer = require("../lib/mailer")

module.exports = {
  async post(req, res) {
    try {
      const { id } = req.body
      const { userId } = req.session

      const product = await LoadProductService.load('product', {
        where: {
          id: id
        }
      })
      const seller = await User.findOne({
        where: {
          id: product.user_id
        }
      })
      const buyer = await User.findOne({
        where: {
          id: userId
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

      return res.render("orders/error")
    } catch (error) {
      console.log(error);
      return res.render("orders/error")
    }

  }
}