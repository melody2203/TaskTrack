const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, roleMiddleware('MANAGER'), taskController.createTask);
router.get('/', authMiddleware, taskController.getTasks);
router.put('/:id', authMiddleware, taskController.updateTask);
router.delete('/:id', authMiddleware, roleMiddleware('MANAGER'), taskController.deleteTask);

module.exports = router;
