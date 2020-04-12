// Creating our User model
module.exports = function(sequelize, DataTypes) {
    var Wishlist = sequelize.define("Wishlist", {
        // The email cannot be null, and must be a proper email before creation
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        }

    });

    Wishlist.associate = function(models) {
        Wishlist.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: true
            }
        });

    };
    return Wishlist;
};