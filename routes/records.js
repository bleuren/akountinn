const express = require('express');

const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const recordController = require('../controllers/record_controller');

router.get('/add', ensureAuthenticated, recordController.record_create_get);
router.post('/add', ensureAuthenticated, recordController.record_create_post);
router.get('/edit/:id', ensureAuthenticated, recordController.record_update_get);
router.post('/edit/:id', ensureAuthenticated, recordController.record_update_post);
router.delete('/delete/:id', ensureAuthenticated, recordController.record_delete_get);
router.get('/', ensureAuthenticated, recordController.record_list);
router.get('/:id', ensureAuthenticated, recordController.record_detail);

module.exports = router;
