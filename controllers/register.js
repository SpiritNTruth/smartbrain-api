
const handleRegister = (req, res, pgdb, bcrypt) => {
  const { name, email, password } = req.body;
  if(!name || !email || !password) {
    return res.status(400).json('Incorrect data sunbmitted');
  }
  const hash = bcrypt.hashSync(password);
  pgdb.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
        })
        .then(user => res.json(user[0]))
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err => res.status(400).json('Unable to register'))
}

module.exports = {
  handleRegister: handleRegister
}