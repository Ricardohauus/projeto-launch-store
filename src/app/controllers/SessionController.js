const User = require("../models/User")
const { compare } = require('bcrypt')
const crypto = require("crypto")
const mailer = require("../lib/mailer")
module.exports = {
  logout(req, res) {
    req.session.destroy()
    return res.redirect("/")
  },
  loginForm(req, res) {
    return res.render("sessions/index")
  },
  async login(req, res) {
    const { email, password } = req.body;

    const user = await (await User.findBy(email, '')).rows[0];

    if (!user) {
      return res.render('sessions/index', {
        error: 'Usuário não cadastrado!',
        user: req.body
      })
    }

    const passed = await compare(password, user.password)

    if (!passed) {
      return res.render('sessions/index', {
        error: 'Usuário ou Senha incorretos!',
        user: req.body
      })
    }


    req.session.userId = user.id;

    return res.redirect("/users");
  },
  async forgotForm(req, res) {
    return res.render("sessions/forgot-password")
  },
  async forgot(req, res) {
    const { email } = req.body
    try {
      const user = await (await User.findBy(email, '')).rows[0];

      if (!user) {
        return res.render('sessions/forgot-password', {
          error: 'Email não cadastrado!',
          user: req.body
        })
      }

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

}