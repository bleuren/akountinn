const express = require('express');

const router = express.Router();
const indexController = require('../controllers/index_controller');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', indexController.index);
router.get('/dashboard', ensureAuthenticated, indexController.dashboard);
router.get('/analysis/:teamId', ensureAuthenticated, indexController.analysis);

module.exports = router;
