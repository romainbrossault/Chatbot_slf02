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
app.post("/question", (req, res) => {
    const { utilisateur_id, contenu } = req.body;

    if (!utilisateur_id) {
        return res.status(400).json({ error: "⚠️ ID utilisateur manquant" });
    }
    if (!contenu) {
        return res.status(400).json({ error: "⚠️ Contenu manquant" });
    }

    const queryInsertQuestion = "INSERT INTO question (utilisateur_id, contenu, date_question) VALUES (?, ?, NOW())";
    
    db.query(queryInsertQuestion, [utilisateur_id, contenu], (err, result) => {
        if (err) {
            console.error("❌ Erreur SQL lors de l'ajout de la question:", err);
            res.status(500).send("Erreur serveur");
            return;
        }

        const questionId = result.insertId;
        console.log(`📩 Question ajoutée avec ID ${questionId}`);

        // Analyse NLP pour extraire les mots-clés
        const tokenizer = new natural.WordTokenizer();
        const tokens = tokenizer.tokenize(contenu);
        const tfidf = new natural.TfIdf();
        tfidf.addDocument(tokens);

        const keywords = [];
        tfidf.listTerms(0).forEach(term => {
            if (term.tfidf > 0.1) { // Adjust the threshold as needed
                keywords.push(term.term);
            }
        });

        console.log("🔍 Mots-clés extraits:", keywords);

        if (keywords.length === 0) {
            return res.status(400).json({ error: "⚠️ Aucun mot-clé trouvé dans la question" });
        }

        // Rechercher des réponses basées sur les mots-clés trouvés
        const querySearchKnowledge = "SELECT id, contenu FROM base_connaissance WHERE mot_cle IN (?)";
        db.query(querySearchKnowledge, [keywords], (err, knowledgeResults) => {
            if (err) {
                console.error("Erreur SQL lors de la recherche dans la base de connaissances:", err);
                res.status(500).send("Erreur serveur");
                return;
            }

            let responseContent = "";
            let connaissanceIds = [];
            if (knowledgeResults.length > 0) {
                knowledgeResults.forEach(result => {
                    responseContent += result.contenu + " ";
                    connaissanceIds.push(result.id);
                });
            } else {
                responseContent = "Je n'ai pas trouvé de réponse à votre question.";
            }

            console.log("🤖 Réponse générée:", responseContent);

            // Insérer la réponse dans la table "reponse"
            const queryInsertResponse = "INSERT INTO reponse (question_id, connaissance_id, contenu, source, date_reponse) VALUES (?, ?, ?, 'base_connaissance', NOW())";
            db.query(queryInsertResponse, [questionId, connaissanceIds.join(','), responseContent.trim()], (err, responseResult) => {
                if (err) {
                    console.error("❌ Erreur SQL lors de l'ajout de la réponse:", err);
                    res.status(500).send("Erreur serveur");
                    return;
                }

                console.log(`✅ Réponse ajoutée avec ID ${responseResult.insertId}`);

                res.json({
                    id: questionId,
                    utilisateur_id,
                    contenu,
                    date_question: new Date(),
                    reponse: responseContent.trim()
                });
            });
        });
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
    const query = "INSERT INTO reponse (question_id, connaissance_id, contenu, source, date_reponse) VALUES (?, ?, ?, ?, NOW())";

    db.query(query, [question_id, 1, contenu, source], (err, result) => {
        if (err) {
            console.error("Erreur SQL:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        res.json({ id: result.insertId, question_id, connaissance_id: 1, contenu, source });
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