// Creating our User model
module.exports = function(sequelize, DataTypes) {
    var Blogpost = sequelize.define("Blogpost", {
        // The email cannot be null, and must be a proper email before creation
        title: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1]
            }
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1]
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });

    Blogpost.associate = function(models) {
        Blogpost.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: true
            }
        });
        Blogpost.hasMany(models.Comment, {
            onDelete: "cascade"
        });
    };
    return Blogpost;
};