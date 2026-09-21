const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/users/controller.js');

// GET all users
router.get('/', ctrl.getUsers);

// GET a single user by id
// router.get('/:id', ctrl.getUser);

module.exports = router;