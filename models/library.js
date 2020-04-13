// Creating our User model
module.exports = function(sequelize, DataTypes) {
    var Library = sequelize.define("Library", {
        // The email cannot be null, and must be a proper email before creation
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ISBN: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });
    // Library.associate = function(models) {
    //     Library.belongsTo(models.User, {
    //         onDelete: "CASCADE",
    //         foreignKey: {
    //             allowNull: true
    //         }
    //     });

    // };
    return Library;
};