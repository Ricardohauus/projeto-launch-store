const User = require("../models/User")
const { formatCep, formatCPfCnpj } = require("../lib/utils")
const { compare, hash } = require('bcryptjs')

module.exports = {
  registerForm(req, res) {
    try {
      return res.render("users/register")
    } catch (error) {
      console.log(error);
    }
  },
  async saveOrUpdate(req, res) {
    try {
      const { user } = req
      let { name, email, cpf_cnpj, cep, adress } = req.body

      cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
      cep = cep.replace(/\D/g, "")

      if (!user.id) {
        const userId = await User.create({
          name,
          email,
          password,
          cpf_cnpj,
          cep,
          adress
        })
        req.session.userId = userId
        user.id = userId;
        return res.render(`users/register`, { success: "Usuário criado com sucesso!", user })
      } else {
        await User.update(user.id, {
          name: user.name,
          email: user.email,
          cpf_cnpj: user.cpf_cnpj,
          cep: user.cep,
          adress: user.adress,
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
      return res.render("users/register.njk", { user })
    } catch (error) {
      console.log(error);
      return res.render('users/register.njk', { error, user })
    }

  }
}