module.exports = function(sequelize, DataTypes) {
    var Comment = sequelize.define("Comment", {
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1]
        },

    });

    Comment.associate = function(models) {
        models.Comment.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });

    };
    Comment.associate = function(models) {
        models.Comment.belongsTo(models.Blogpost, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
    };
    return Comment;
};