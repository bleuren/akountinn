const express = require('express');

const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const categoryController = require('../controllers/category_controller');

router.get('/add', ensureAuthenticated, categoryController.category_create_get);
router.post('/add', ensureAuthenticated, categoryController.category_create_post);
router.get('/edit/:id', ensureAuthenticated, categoryController.category_update_get);
router.post('/edit/:id', ensureAuthenticated, categoryController.category_update_post);
router.delete('/delete/:id', ensureAuthenticated, categoryController.category_delete_get);
router.get('/', ensureAuthenticated, categoryController.category_list);

module.exports = router;
