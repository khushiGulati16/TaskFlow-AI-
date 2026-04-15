const { List } = require('../models');

exports.createList = async (req, res) => {
    try {
        const list = await List.create(req.body);
        res.status(201).json(list);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateList = async (req, res) => {
    try {
        const list = await List.findByPk(req.params.id);
        if (!list) return res.status(404).json({ message: 'List not found' });
        await list.update(req.body);
        res.json(list);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteList = async (req, res) => {
    try {
        const list = await List.findByPk(req.params.id);
        if (!list) return res.status(404).json({ message: 'List not found' });
        await list.destroy();
        res.json({ message: 'List deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.reorderLists = async (req, res) => {
    try {
        const { lists } = req.body; // Array of {id, position}
        for (let item of lists) {
            await List.update({ position: item.position }, { where: { id: item.id } });
        }
        res.json({ message: 'Lists reordered' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
