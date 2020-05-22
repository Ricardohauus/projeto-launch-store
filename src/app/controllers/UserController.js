const User = require("../models/User")
const { formatCep, formatCPfCnpj } = require("../lib/utils")
const { compare, hash } = require('bcryptjs')
const LoadProductService = require("../services/LoadProductService")
module.exports = {
  registerForm(req, res) {
    try {
      return res.render("users/register",
        { header: 'Registre-se', classes: 'user-register container' })
    } catch (error) {
      console.log(error);
    }
  },
  async saveOrUpdate(req, res) {
    try {
      let user = req.body
      user.cpf_cnpj = user.cpf_cnpj.replace(/\D/g, "")
      user.cep = user.cep.replace(/\D/g, "")

      if (!user.id) {
        user.password = await hash(user.password, 8)
        const userId = await User.create({
          name: user.name,
          email: user.email,
          cpf_cnpj: user.cpf_cnpj,
          cep: user.cep,
          address: user.address,
          password: user.password
        })
        req.session.userId = userId
        user.id = userId;
        return res.render(`users/register`, { success: "Usuário criado com sucesso!", user })

      } else {
        user = req.user;
        await User.update(user.id, {
          name: user.name,
          email: user.email,
          cpf_cnpj: user.cpf_cnpj,
          cep: user.cep,
          address: user.address,
        });
        return res.render(`users/register`, {
          success: "Usuário atualizado com sucesso!", user
        })

      }

    } catch (error) {
      console.log(error);
      return res.render('users/register', { error, user })
    }
  },
  async delete(req, res) {
    try {
      await User.delete(req.session.userId)
      req.session.destroy();

      return res.render('sessions/index', { success: 'Conta deletado com sucesso!' })
    } catch (error) {
      console.log(error);
      return res.render('users/register', { error: 'Erro ao tentar excluir sua conta' })
    }
  },
  async show(req, res) {
    try {
      const { user } = req
      user.cep = formatCep(user.cep);
      user.cpf_cnpj = formatCPfCnpj(user.cpf_cnpj);
      return res.render("users/register.njk", { user, header: 'Registre-se', classes: 'user-register container' }
      )
    } catch (error) {
      console.log(error);
      return res.render('users/register.njk', { error, user })
    }

  },
  async ads(req, res) {
    const products = await LoadProductService.load('products', {
      where: { user_id: req.session.userId }
    })
    return res.render('users/ads', { products })
  }
}