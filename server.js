import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import cors from "cors";
import natural from "natural";

dotenv.config();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error("Erreur de connexion à MySQL:", err);
        return;
    }
    console.log("✅ Connecté à MySQL");
});

app.get("/", (req, res) => {
    res.send("Serveur Express opérationnel !");
});

// Gestion des utilisateurs
app.get("/utilisateur", (req, res) => {
    db.query("SELECT * FROM utilisateur", (err, results) => {
        if (err) {
            console.error("Erreur SQL:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        res.json(results);
    });
});

app.get("/utilisateur/login", (req, res) => {
    const { email, password } = req.query;
    const query = "SELECT id, nom, prenom, email, role FROM utilisateur WHERE email = ? AND password = ?";
    
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error("Erreur SQL:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(401).send("Email ou mot de passe incorrect");
        }
    });
});

app.post("/utilisateur", (req, res) => {
    const { nom, prenom, email, password, role } = req.body;
    const query = "INSERT INTO utilisateur (nom, prenom, email, password, role, date_inscription) VALUES (?, ?, ?, ?, ?, NOW())";

    db.query(query, [nom, prenom, email, password, role], (err, result) => {
        if (err) {
            console.error("Erreur SQL:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        res.json({ id: result.insertId, nom, prenom, email, role });
    });
});

// Ajouter une question et obtenir une réponse basée sur la base de connaissances
app.post("/question", async (req, res) => {
    const { utilisateur_id, contenu } = req.body;

    if (!utilisateur_id) {
        return res.status(400).json({ error: "⚠️ ID utilisateur manquant" });
    }
    if (!contenu) {
        return res.status(400).json({ error: "⚠️ Contenu manquant" });
    }

    const queryInsertQuestion = "INSERT INTO question (utilisateur_id, contenu, date_question) VALUES (?, ?, NOW())";
    
    db.query(queryInsertQuestion, [utilisateur_id, contenu], async (err, result) => {
        if (err) {
            console.error("❌ Erreur SQL lors de l'ajout de la question:", err);
            res.status(500).send("Erreur serveur");
            return;
        }

        const questionId = result.insertId;
        console.log(`📩 Question ajoutée avec ID ${questionId}`);

        // Rechercher des réponses basées sur le contenu de la question
        const querySearchKnowledge = "SELECT id, contenu, entrainement FROM base_connaissance";
        db.query(querySearchKnowledge, (err, knowledgeResults) => {
            if (err) {
                console.error("Erreur SQL lors de la recherche dans la base de connaissances:", err);
                res.status(500).send("Erreur serveur");
                return;
            }

            let bestMatch = null;
            let highestScore = 0;

            knowledgeResults.forEach(result => {
                const similarity = natural.JaroWinklerDistance(contenu, result.contenu);
                const score = similarity + result.entrainement;

                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = result;
                }
            });

            let responseContent = "Je n'ai pas trouvé de réponse à votre question.";
            let reponseId = null;
            if (bestMatch) {
                responseContent = bestMatch.contenu;

                // Insérer la réponse dans la table "reponse"
                const queryInsertResponse = "INSERT INTO reponse (question_id, contenu, source, date_reponse, entrainement) VALUES (?, ?, 'base_connaissance', NOW(), 0)";
                db.query(queryInsertResponse, [questionId, responseContent.trim()], (err, responseResult) => {
                    if (err) {
                        console.error("❌ Erreur SQL lors de l'ajout de la réponse:", err);
                        res.status(500).send("Erreur serveur");
                        return;
                    }

                    console.log(`✅ Réponse ajoutée avec ID ${responseResult.insertId}`);
                    reponseId = responseResult.insertId;

                    res.json({
                        id: questionId,
                        utilisateur_id,
                        contenu,
                        date_question: new Date(),
                        reponse: responseContent.trim(),
                        reponse_id: reponseId
                    });
                });
            } else {
                res.json({
                    id: questionId,
                    utilisateur_id,
                    contenu,
                    date_question: new Date(),
                    reponse: responseContent.trim(),
                    reponse_id: reponseId
                });
            }
        });
    });
});

// Valider une réponse
app.post("/reponse/valider", (req, res) => {
    const { reponse_id } = req.body;
    const query = "UPDATE reponse SET entrainement = entrainement + 1 WHERE id = ?";

    db.query(query, [reponse_id], (err, result) => {
        if (err) {
            console.error("Erreur SQL:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        res.json({ message: "Réponse validée avec succès" });
    });
});

// Invalider une réponse
app.post("/reponse/invalider", (req, res) => {
    const { reponse_id } = req.body;
    const query = "UPDATE reponse SET entrainement = entrainement - 1 WHERE id = ?";

    db.query(query, [reponse_id], (err, result) => {
        if (err) {
            console.error("Erreur SQL:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        res.json({ message: "Réponse invalidée avec succès" });
    });
});

// Récupérer toutes les questions
app.get("/question", (req, res) => {
    db.query("SELECT * FROM question", (err, results) => {
        if (err) {
            console.error("Erreur SQL:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        res.json(results);
    });
});

// Récupérer toutes les réponses
app.get("/reponse", (req, res) => {
    db.query("SELECT * FROM reponse", (err, results) => {
        if (err) {
            console.error("Erreur SQL:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        res.json(results);
    });
});

// Ajouter une réponse générée
app.post("/reponse", (req, res) => {
    const { question_id, contenu, source } = req.body;
    const query = "INSERT INTO reponse (question_id, contenu, source, date_reponse) VALUES (?, ?, ?, NOW())";

    db.query(query, [question_id, contenu, source], (err, result) => {
        if (err) {
            console.error("Erreur SQL:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        res.json({ id: result.insertId, question_id, contenu, source });
    });
});

// Gestion de la base de connaissances
app.get("/base_connaissance", (req, res) => {
    db.query("SELECT * FROM base_connaissance", (err, results) => {
        if (err) {
            console.error("Erreur SQL:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        res.json(results);
    });
});

app.post("/base_connaissance", (req, res) => {
    const { mot_cle, contenu } = req.body;
    const query = "INSERT INTO base_connaissance (mot_cle, contenu, date_mise_a_jour) VALUES (?, ?, NOW())";

    db.query(query, [mot_cle, contenu], (err, result) => {
        if (err) {
            console.error("Erreur SQL:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        res.json({ id: result.insertId, mot_cle, contenu });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});