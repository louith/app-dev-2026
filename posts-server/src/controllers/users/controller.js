const users = require('../../users.js');

exports.getUsers = (req, res) => {
  res.status(200).json(users);
};

// module.exports = controller;