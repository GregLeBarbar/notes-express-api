import express from "express";

import swaggerUi from "swagger-ui-express";

const app = express();

import cors from "cors";

const corsOptions = {
  origin: "http://localhost:5173", // Votre frontend
  credentials: true, // Permet de recevoir les credentials (cookies, header d'authentification)
};

app.use(cors(corsOptions));

app.use(express.json());

const port = 3000;

import { swaggerSpec } from "./swagger.mjs";

// Route pour accéder à la documentation Swagger
//const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

import { sequelize, initDb } from "./db/sequelize.mjs";

sequelize
  .authenticate()
  .then((_) =>
    console.log("La connexion à la base de données a bien été établie")
  )
  .catch((error) => console.error("Impossible de se connecter à la DB"));

initDb();

app.get("/", (req, res) => {
  res.send("API REST of self service machine !");
});

app.get("/api/", (req, res) => {
  res.redirect(`http://localhost:${port}/`);
});

import { notesRouter } from "./routes/notes.mjs";
app.use("/api/notes", notesRouter);

import { loginRouter } from "./routes/login.mjs";
app.use("/api/login", loginRouter);

// Si aucune route ne correspondant à l'URL demandée par le consommateur
app.use(({ res }) => {
  const message =
    "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
  res.status(404).json(message);
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
