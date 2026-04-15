const { ActivityLog, User } = require('../models');

exports.getActivities = async (req, res) => {
    try {
        const activities = await ActivityLog.findAll({
            where: { user_id: req.user.id },
            include: [{ model: User, attributes: ['name', 'avatar'] }],
            order: [['createdAt', 'DESC']],
            limit: 20
        });
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
