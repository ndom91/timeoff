import ActiveDirectory from 'activedirectory2'

module.exports = async (req, res) => {
  const config = {
    url: process.env.LDAP_URL,
    baseDN: process.env.LDAP_BASE_DN,
    username: process.env.LDAP_BIND_DN,
    password: process.env.LDAP_BIND_PW
  }
  const ad = new ActiveDirectory(config)
  const query = process.env.LDAP_USER_QUERY
  ad.findUsers(query, true, function (err, users) {
    if (err) {
      console.log('ERROR: ' + JSON.stringify(err))
      return
    }

    if ((!users) || (users.length === 0)) console.log('No users found.')
    else {
      res.status(200).json({ users })
    }
  })
}
