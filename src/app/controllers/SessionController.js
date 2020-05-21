const User = require("../models/User")
const { compare } = require('bcrypt')
const crypto = require("crypto")
const mailer = require("../lib/mailer")
const { hash } = require('bcrypt')

module.exports = {
  logout(req, res) {
    req.session.destroy()
    return res.redirect("/")
  },
  loginForm(req, res) {
    return res.render("sessions/index")
  },
  async login(req, res) {
    try {
      const { user } = req;

      req.session.userId = user.id;

      return res.redirect("/users");
    } catch (error) {
      console.log(error)
    }
  },
  async forgotForm(req, res) {
    return res.render("sessions/forgot-password")
  },
  async forgot(req, res) {
    try {
      const user = req.user

      const token = crypto.randomBytes(20).toString("hex")
      let now = new Date()
      now = now.setHours(now.getHours() + 1)

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now
      });

      await mailer.sendMail({
        to: user.email,
        from: 'no-reply@launchsotre.com.br',
        subject: "Recuperação de senha!",
        html: `<h2>Perdeu a chave?</h2>
        <p>Não fique preocupado, clique no link abaixo e recupere sua senha</p>
        <p>
        <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
              Clique aqui para recuperar a senha!
        </a>
        </p>
        `
      })
      return res.render('sessions/index', {
        success: 'Enviado um email para a recuperação da senha!',
        user: req.body
      })
    } catch (error) {
      console.log(error);
    }
  },
  resetForm(req, res) {
    return res.render("sessions/password-reset", { token: req.query.token })
  },
  async reset(req, res) {
    try {
      const user = req.user

      const { password, token } = req.body

      const newPassword = await hash(password, 8)

      await User.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: "",
      })

      return res.render("sessions/index", {
        user: req.body,
        success: "Senha atualizada com sucesso!! Faça o seu login!"
      })

    } catch (err) {
      console.error(err)
      return res.render("sessions/password-reset", {
        user: req.body,
        token,
        error: "Erro inesperado, tente novamente!"
      })
    }

  }

}