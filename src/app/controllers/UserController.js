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
      var user = req.body

      const keys = Object.keys(user)
      for (key of keys) {
        if (user[key] == "") {
          return res.render('users/register', { error: 'Por favor, Preencha todos os campos!', user })
        }
      }

      if (user.id) {
        user.cpf_cnpj = user.cpf_cnpj.replace(/\W/g, "");
        user.cep = user.cep.replace(/\W/g, "");
        const userFind = await User.find(user.id)

        const passed = await compare(user.password, userFind.password)

        if (!passed) {
          user.cep = formatCep(user.cep);
          user.cpf_cnpj = formatCPfCnpj(user.cpf_cnpj);
          return res.render('users/register', { error: 'Senha incorreta!', user })
        }

        await User.update(user.id, {
          name: user.name,
          email: user.email,
          cpf_cnpj: user.cpf_cnpj,
          cep: user.cep,
          adress: user.adress,
        });
        user.cep = formatCep(user.cep);
        user.cpf_cnpj = formatCPfCnpj(user.cpf_cnpj);

        return res.render(`users/register`, {
          success: "Usuário atualizado com sucesso!", user
        })

      } else {

        if (user.password != user.passwordRepeat) {
          user.cep = formatCep(user.cep);
          user.cpf_cnpj = formatCPfCnpj(user.cpf_cnpj);
          return res.render('users/register', {
            error: 'As senhas não conferem!',
            user
          })
        }
        const { email, cpf_cnpj } = user
        const userFind = await User.findOne({ where: { email, cpf_cnpj } });

        if (userFind) {
          user.cep = formatCep(user.cep);
          user.cpf_cnpj = formatCPfCnpj(user.cpf_cnpj);
          return res.render('users/register', {
            error: 'Usuário já cadastrado!',
            user
          })
        }

        user.cpf_cnpj = user.cpf_cnpj.replace(/\W/g, "");
        user.cep = user.cep.replace(/\W/g, "");
        user.password = await hash(user.password, 8)
        const userId = await User.create({
          name: user.name,
          email: user.email,
          password: user.password,
          cpf_cnpj: user.cpf_cnpj,
          cep: user.cep,
          adress: user.adress
        })
        user.id = userId
        user.cep = formatCep(user.cep);
        user.cpf_cnpj = formatCPfCnpj(user.cpf_cnpj);
        req.session.userId = userId

        return res.render(`users/register`,
          { success: "Usuário criado com sucesso!", user })
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
      const { userId: id } = req.session

      const user = await User.findOne({ where: { id } })

      if (!user) return res.render('users/register', { error: "Usuário não encontrado!", user })

      user.cep = formatCep(user.cep);
      user.cpf_cnpj = formatCPfCnpj(user.cpf_cnpj);

      return res.render("users/register.njk", { user })
    } catch (error) {
      console.log(error);
      return res.render('users/register.njk', { error, user })
    }

  }
}