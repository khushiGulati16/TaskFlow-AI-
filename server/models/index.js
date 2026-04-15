const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    avatar: { type: DataTypes.STRING }
});

const Board = sequelize.define('Board', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT }
});

const List = sequelize.define('List', {
    title: { type: DataTypes.STRING, allowNull: false },
    position: { type: DataTypes.INTEGER, defaultValue: 0 }
});

const Card = sequelize.define('Card', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    due_date: { type: DataTypes.DATE },
    position: { type: DataTypes.INTEGER, defaultValue: 0 }
});

const Label = sequelize.define('Label', {
    name: { type: DataTypes.STRING, allowNull: false },
    color: { type: DataTypes.STRING, allowNull: false }
});

const ChecklistItem = sequelize.define('ChecklistItem', {
    title: { type: DataTypes.STRING, allowNull: false },
    is_completed: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const ActivityLog = sequelize.define('ActivityLog', {
    type: { type: DataTypes.STRING, allowNull: false }, // e.g., 'card_created', 'card_moved'
    content: { type: DataTypes.STRING, allowNull: false },
});

// Associations
User.hasMany(Board, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Board.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(ActivityLog, { foreignKey: 'user_id', onDelete: 'CASCADE' });
ActivityLog.belongsTo(User, { foreignKey: 'user_id' });

Board.hasMany(ActivityLog, { foreignKey: 'board_id', onDelete: 'CASCADE' });
ActivityLog.belongsTo(Board, { foreignKey: 'board_id' });

Board.hasMany(List, { foreignKey: 'board_id', onDelete: 'CASCADE' });
List.belongsTo(Board, { foreignKey: 'board_id' });

List.hasMany(Card, { foreignKey: 'list_id', onDelete: 'CASCADE' });
Card.belongsTo(List, { foreignKey: 'list_id' });

Card.hasMany(ChecklistItem, { foreignKey: 'card_id', onDelete: 'CASCADE' });
ChecklistItem.belongsTo(Card, { foreignKey: 'card_id' });

Card.belongsToMany(Label, { through: 'CardLabels', foreignKey: 'card_id' });
Label.belongsToMany(Card, { through: 'CardLabels', foreignKey: 'label_id' });

Card.belongsToMany(User, { through: 'CardMembers', foreignKey: 'card_id' });
User.belongsToMany(Card, { through: 'CardMembers', foreignKey: 'user_id' });

module.exports = { User, Board, List, Card, Label, ChecklistItem, ActivityLog };
