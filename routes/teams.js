const express = require('express');

const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const teamController = require('../controllers/team_controller');

router.get('/add', ensureAuthenticated, teamController.team_create_get);
router.post('/add', ensureAuthenticated, teamController.team_create_post);
router.get('/edit/:id', ensureAuthenticated, teamController.team_update_get);
router.post('/edit/:id', ensureAuthenticated, teamController.team_update_post);
router.delete('/delete/:id', ensureAuthenticated, teamController.team_delete_get);
router.get('/', ensureAuthenticated, teamController.team_list);

module.exports = router;
