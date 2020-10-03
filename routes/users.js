const express = require('express');

const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const userController = require('../controllers/user_controller');

router.post('/login', userController.user_login);
router.get('/reset', ensureAuthenticated, userController.user_update_get);
router.post('/reset', ensureAuthenticated, userController.user_update_post);
router.get('/logout', userController.user_logout);

module.exports = router;
