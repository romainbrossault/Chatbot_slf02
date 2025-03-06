import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MySQL
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

// Route principale
app.get("/", (req, res) => {
    res.send("Serveur Express opérationnel !");
});

// Récupérer tous les utilisateurs
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

// Vérifier les informations de connexion et retourner l'ID utilisateur
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

// Ajouter un utilisateur
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

// Récupérer les questions
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

 // Ajouter une question
 app.post("/question", (req, res) => {
    const { utilisateur_id, contenu } = req.body;
    
    console.log("📩 Nouvelle question reçue:", req.body); // Debugging

    if (!utilisateur_id) {
        return res.status(400).json({ error: "⚠️ ID utilisateur manquant" });
    }
    if (!contenu) {
        return res.status(400).json({ error: "⚠️ Contenu manquant" });
    }

    const query = "INSERT INTO question (utilisateur_id, contenu, date_question) VALUES (?, ?, NOW())";
    
    db.query(query, [utilisateur_id, contenu], (err, result) => {
        if (err) {
            console.error("❌ Erreur SQL:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        res.json({ id: result.insertId, utilisateur_id, contenu, date_question: new Date() });
    });
});

// Récupérer les réponses
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

// Ajouter une réponse
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

// Analyser un message avec NLP
app.post("/analyze", async (req, res) => {
    try {
        const text = req.body.text;
        if (!text) return res.status(400).json({ error: "Texte manquant" });

        const result = await nlp(text);
        res.json(result);
    } catch (error) {
        console.error("Erreur NLP:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});