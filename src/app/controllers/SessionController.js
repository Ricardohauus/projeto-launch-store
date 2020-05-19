const User = require("../models/User")
const { compare } = require('bcrypt')

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
  }
}