// https://sequelize.org/docs/v7/models/data-types/

const NoteModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "Note",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Ce titre est déjà pris.",
        },
        validate: {
          notEmpty: {
            msg: "Le titre ne peut pas être vide.",
          },
          notNull: {
            msg: "Le titre est une propriété obligatoire.",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: "created",
      updatedAt: false,
    }
  );
};

export { NoteModel };
