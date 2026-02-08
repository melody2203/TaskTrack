const express = require('express');
const router = express.Router();
const { User } = require('../config/models');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, roleMiddleware('MANAGER'), async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email']
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
