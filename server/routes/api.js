const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const listController = require('../controllers/listController');
const cardController = require('../controllers/cardController');
const dashboardController = require('../controllers/dashboardController');
const activityController = require('../controllers/activityController');
const auth = require('../middleware/auth');

// Boards
router.get('/boards', auth, boardController.getBoards);
router.get('/boards/:id', auth, boardController.getBoardById);
router.post('/boards', auth, boardController.createBoard);

// Lists
router.post('/lists', auth, listController.createList);
router.put('/lists/:id', auth, listController.updateList);
router.delete('/lists/:id', auth, listController.deleteList);
router.post('/lists/reorder', auth, listController.reorderLists);

// Cards
router.post('/cards', auth, cardController.createCard);
router.put('/cards/:id', auth, cardController.updateCard);
router.delete('/cards/:id', auth, cardController.deleteCard);
router.post('/cards/reorder', auth, cardController.reorderCards);

// Checklist
router.post('/cards/:cardId/checklist', auth, cardController.addChecklistItem);
router.put('/checklist/:itemId', auth, cardController.updateChecklistItem);

// Dashboard
router.get('/dashboard', auth, dashboardController.getDashboardStats);

// Activities
router.get('/activities', auth, activityController.getActivities);

module.exports = router;
