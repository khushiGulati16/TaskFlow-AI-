const { Board, List, Card, Label, ChecklistItem, User } = require('../models');

exports.getBoards = async (req, res) => {
    try {
        const boards = await Board.findAll({
            where: { user_id: req.user.id },
            include: [{ model: List }]
        });
        res.json(boards);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBoardById = async (req, res) => {
    try {
        const board = await Board.findOne({
            where: { id: req.params.id, user_id: req.user.id },
            include: [{
                model: List,
                include: [{
                    model: Card,
                    include: [
                        { model: Label },
                        { model: User },
                        { model: ChecklistItem }
                    ]
                }]
            }]
        });
        if (!board) return res.status(404).json({ message: 'Board not found' });
        res.json(board);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createBoard = async (req, res) => {
    try {
        const board = await Board.create(req.body);
        res.status(201).json(board);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
