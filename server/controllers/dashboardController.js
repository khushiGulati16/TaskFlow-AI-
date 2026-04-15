const { Card, ChecklistItem, User, List } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalTasks = await Card.count();
        const overdueTasks = await Card.count({
            where: {
                due_date: { [Op.lt]: new Date() }
            }
        });

        // Simplified completion logic: tasks in the last list (assuming the last list is 'Done')
        // Better: count tasks where checklist is 100% complete
        const cardsWithChecklists = await Card.findAll({
            include: [{ model: ChecklistItem }]
        });

        let completedTasks = 0;
        cardsWithChecklists.forEach(card => {
            if (card.ChecklistItems.length > 0 && card.ChecklistItems.every(item => item.is_completed)) {
                completedTasks++;
            }
        });

        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        // Most active member (by tasks assigned)
        const userActivity = await User.findAll({
            include: [{ model: Card }],
        });

        const mostActiveMember = userActivity
            .map(u => ({ name: u.name, count: u.Cards.length }))
            .sort((a, b) => b.count - a.count)[0];

        // Chart data: Tasks by list
        const lists = await List.findAll({
            include: [{ model: Card }]
        });

        const chartData = lists.map(l => ({
            name: l.title,
            tasks: l.Cards.length
        }));

        res.json({
            metrics: {
                totalTasks,
                completedTasks,
                overdueTasks,
                completionRate: Math.round(completionRate),
                mostActiveMember: mostActiveMember ? mostActiveMember.name : 'N/A'
            },
            chartData
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
