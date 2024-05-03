import express from "express";

import { Note } from "../db/sequelize.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";

const notesRouter = express();

notesRouter.get("/", auth, (req, res) => {
  if (req.query.title) {
    if (req.query.title.length < 2) {
      const message = `Le terme de la recherche doit contenir au moins 2 caractères`;
      return res.status(400).json({ message });
    }
    let limit = 3;
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }
    return Note.findAndCountAll({
      where: { title: { [Op.like]: `%${req.query.title}%` } },
      order: ["title"],
      limit: limit,
    }).then((notes) => {
      const message = `Il y a ${notes.count} notes qui correspondent au terme de la recherche`;
      res.json(success(message, notes));
    });
  }
  Note.findAll({ order: ["title"] })
    .then((notes) => {
      const message = "La liste des notes a bien été récupérée.";
      res.json(success(message, notes));
    })
    .catch((error) => {
      const message =
        "La liste des notes n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

notesRouter.get("/:id", auth, (req, res) => {
  Note.findByPk(req.params.id)
    .then((note) => {
      if (note === null) {
        const message =
          "La note demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        // A noter ici le return pour interrompre l'exécution du code
        return res.status(404).json({ message });
      }
      const message = `La note dont l'id vaut ${note.id} a bien été récupéré.`;
      res.json(success(message, note));
    })
    .catch((error) => {
      const message =
        "La note n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

notesRouter.post("/", auth, (req, res) => {
  Note.create(req.body)
    .then((createdNote) => {
      // Définir un message pour le consommateur de l'API REST
      const message = `La note ${createdNote.title} a bien été créé !`;

      // Retourner la réponse HTTP en json avec le msg et La note créé
      res.json(success(message, createdNote));
    })
    .catch((error) => {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }
      const message =
        "La note n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

notesRouter.delete("/:id", auth, (req, res) => {
  Note.findByPk(req.params.id)
    .then((deletedNote) => {
      if (deletedNote === null) {
        const message =
          "La note demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        // A noter ici le return pour interrompre l'exécution du code
        return res.status(404).json({ message });
      }
      return Note.destroy({
        where: { id: deletedNote.id },
      }).then((_) => {
        // Définir un message pour le consommateur de l'API REST
        const message = `La note ${deletedNote.title} a bien été supprimé !`;

        // Retourner la réponse HTTP en json avec le msg et La note créé
        res.json(success(message, deletedNote));
      });
    })
    .catch((error) => {
      const message =
        "La note n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

notesRouter.put("/:id", auth, (req, res) => {
  const noteId = req.params.id;
  Note.update(req.body, { where: { id: noteId } })
    .then((_) => {
      return Note.findByPk(noteId).then((updatedNote) => {
        if (updatedNote === null) {
          const message =
            "La note demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
          // A noter ici le return pour interrompre l'exécution du code
          return res.status(404).json({ message });
        }
        // Définir un message pour l'utilisateur de l'API REST
        const message = `La note ${updatedNote.title} dont l'id vaut ${updatedNote.id} a été mis à jour avec succès !`;

        // Retourner la réponse HTTP en json avec le msg et La note créé
        res.json(success(message, updatedNote));
      });
    })
    .catch((error) => {
      console.log(error);
      const message =
        "La note n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

export { notesRouter };
