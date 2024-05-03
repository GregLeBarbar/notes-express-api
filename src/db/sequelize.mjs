import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { NoteModel } from "../models/notes.mjs";
import { UserModel } from "../models/user.mjs";

const sequelize = new Sequelize(
  "db_notes_api", // Nom de la DB qui doit exister
  "root", // Nom de l'utilisateur
  "root", // Mot de passe de l'utilisateur
  {
    host: "localhost",
    port: 3306, // 6033 si Docker
    dialect: "mysql",
    logging: false,
  }
);

import { notes } from "./mock-note.mjs";

const Note = NoteModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

let initDb = () => {
  return sequelize
    .sync({ force: true }) // Force la synchro => donc supprime les données également
    .then((_) => {
      importNotes();
      importUsers();
      console.log("La base de données a bien été synchronisée");
    });
};

const importNotes = () => {
  notes.map((note) => {
    Note.create({
      title: note.title,
      description: note.description,
    }).then((note) => console.log(note.toJSON()));
  });
};

const importUsers = () => {
  bcrypt
    .hash("etml", 10) // temps pour hasher = du sel
    .then((hash) =>
      User.create({
        username: "etml",
        password: hash,
      })
    )
    .then((user) => console.log(user.toJSON()));
};

export { sequelize, initDb, Note, User };
