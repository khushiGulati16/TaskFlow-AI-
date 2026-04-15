const { Card, ChecklistItem, Label, User, ActivityLog, List } = require('../models');

exports.createCard = async (req, res) => {
    try {
        const { title, description, due_date, list_id, position } = req.body;
        const card = await Card.create({ title, description, due_date, list_id, position });
        
        // Log Activity
        const list = await List.findByPk(list_id);
        if (list) {
            await ActivityLog.create({
                user_id: req.user.id,
                board_id: list.board_id,
                type: 'card_created',
                content: `created card "${title}" in ${list.title}`
            });
        }

        res.status(201).json(card);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateCard = async (req, res) => {
    try {
        const card = await Card.findByPk(req.params.id, { include: [{ model: List }] });
        if (!card) return res.status(404).json({ message: 'Card not found' });
        
        const oldTitle = card.title;
        const oldListId = card.list_id;

        await card.update(req.body);

        // Update associations if provided
        if (req.body.labelIds) await card.setLabels(req.body.labelIds);
        if (req.body.userIds) await card.setUsers(req.body.userIds);

        // Log Activity for significant changes
        if (req.body.title || (req.body.list_id && req.body.list_id !== oldListId)) {
            let logContent = `updated card "${card.title}"`;
            if (req.body.list_id && req.body.list_id !== oldListId) {
                const newList = await List.findByPk(req.body.list_id);
                logContent = `moved card "${card.title}" to ${newList.title}`;
            }

            await ActivityLog.create({
                user_id: req.user.id,
                board_id: card.List.board_id,
                type: 'card_updated',
                content: logContent
            });
        }

        res.json(card);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteCard = async (req, res) => {
    try {
        const card = await Card.findByPk(req.params.id, { include: [{ model: List }] });
        if (!card) return res.status(404).json({ message: 'Card not found' });
        
        const title = card.title;
        const boardId = card.List.board_id;

        await card.destroy();

        // Log Activity
        await ActivityLog.create({
            user_id: req.user.id,
            board_id: boardId,
            type: 'card_deleted',
            content: `deleted card "${title}"`
        });

        res.json({ message: 'Card deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.reorderCards = async (req, res) => {
    try {
        const { cards } = req.body; // Array of {id, position, list_id}
        for (let item of cards) {
            await Card.update(
                { position: item.position, list_id: item.list_id },
                { where: { id: item.id } }
            );
        }
        res.json({ message: 'Cards reordered' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Checklist Items
exports.addChecklistItem = async (req, res) => {
    try {
        const item = await ChecklistItem.create({ ...req.body, card_id: req.params.cardId });
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateChecklistItem = async (req, res) => {
    try {
        const item = await ChecklistItem.findByPk(req.params.itemId);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        await item.update(req.body);
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
