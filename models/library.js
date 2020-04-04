// Creating our User model
module.exports = function(sequelize, DataTypes) {
    var Library = sequelize.define("Library", {
        // The email cannot be null, and must be a proper email before creation
        genre: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
                // validate: {

            // }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
                // validate: {
                //   isEmail: true
                // }
        },
        // The password cannot be null
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        edition: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        ISBN: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        }

    });

    Library.associate = function(models) {
        models.Library.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });

    };
    return Library;
};