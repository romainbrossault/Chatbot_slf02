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

// Supprimer une question et sa réponse associée
app.delete("/question/:id", (req, res) => {
    const { id } = req.params;

    //Supprimer l'interaction associée
    const deleteInteractionQuery = "DELETE FROM logs_interaction WHERE question_bis_id = ?";
    db.query(deleteInteractionQuery, [id], (err) => {
        if (err) {
            console.error("Erreur SQL lors de la suppression de l'interaction:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
    });

    // Supprimer la réponse associée
    const deleteResponseQuery = "DELETE FROM reponse WHERE question_id = ?";
    db.query(deleteResponseQuery, [id], (err) => {
        if (err) {
            console.error("Erreur SQL lors de la suppression de la réponse:", err);
            res.status(500).send("Erreur serveur");
            return;
        }

        // Supprimer la question
        const deleteQuestionQuery = "DELETE FROM question WHERE id = ?";
        db.query(deleteQuestionQuery, [id], (err) => {
            if (err) {
                console.error("Erreur SQL lors de la suppression de la question:", err);
                res.status(500).send("Erreur serveur");
                return;
            }

            res.json({ message: "Question et réponse associée supprimées avec succès", id });
        });
    });
});

app.delete("/chats/:id", (req, res) => {
    const { id } = req.params;

    // Supprimer l'interaction associée
    const deleteInteractionQuery = "DELETE FROM logs_interaction WHERE question_bis_id = ?";
    db.query(deleteInteractionQuery, [id], (err) => {
        if (err) {
            console.error("Erreur SQL lors de la suppression de l'interaction:", err);
            return res.status(500).send("Erreur serveur lors de la suppression de l'interaction.");
        }

        // Supprimer la réponse associée
        const deleteResponseQuery = "DELETE FROM reponse WHERE question_id = ?";
        db.query(deleteResponseQuery, [id], (err) => {
            if (err) {
                console.error("Erreur SQL lors de la suppression de la réponse:", err);
                return res.status(500).send("Erreur serveur lors de la suppression de la réponse.");
            }

            // Supprimer la question
            const deleteQuestionQuery = "DELETE FROM question WHERE id = ?";
            db.query(deleteQuestionQuery, [id], (err) => {
                if (err) {
                    console.error("Erreur SQL lors de la suppression de la question:", err);
                    return res.status(500).send("Erreur serveur lors de la suppression de la question.");
                }

                res.json({ message: "Question et réponse associées supprimées avec succès", id });
            });
        });
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

//

// Fonction pour analyser la qualité d'un mot de passe
function analyzePassword(password) {
    const recommendations = [];
    let score = 0;

    if (password.length >= 12) {
        score += 2;
    } else if (password.length >= 8) {
        score += 1;
        recommendations.push("Votre mot de passe devrait contenir au moins 12 caractères.");
    } else {
        recommendations.push("Votre mot de passe est trop court. Utilisez au moins 12 caractères.");
    }

    if (/[A-Z]/.test(password)) {
        score += 1;
    } else {
        recommendations.push("Ajoutez des lettres majuscules pour renforcer votre mot de passe.");
    }

    if (/[a-z]/.test(password)) {
        score += 1;
    } else {
        recommendations.push("Ajoutez des lettres minuscules pour renforcer votre mot de passe.");
    }

    if (/\d/.test(password)) {
        score += 1;
    } else {
        recommendations.push("Ajoutez des chiffres pour renforcer votre mot de passe.");
    }

    if (/[\W_]/.test(password)) {
        score += 1;
    } else {
        recommendations.push("Ajoutez des caractères spéciaux (par exemple, @, #, $, %, etc.) pour renforcer votre mot de passe.");
    }

    if (/(\w)\1{2,}/.test(password) || /123|abc|password|qwerty/i.test(password)) {
        recommendations.push("Évitez les répétitions ou les séquences simples comme '123', 'abc', ou 'password'.");
    }

    return {
        score,
        recommendations,
    };
}

// Route pour gérer les questions

app.post("/question", async (req, res) => {
    const { utilisateur_id, contenu } = req.body;

    if (!utilisateur_id) return res.status(400).json({ error: "⚠️ ID utilisateur manquant" });
    if (!contenu) return res.status(400).json({ error: "⚠️ Contenu manquant" });

    // Vérifier si la question contient un mot de passe
    const passwordRegex = /Tester mon mot de passe\s*:\s*(\S+)/i;
    const match = contenu.match(passwordRegex);

    if (match) {
        const password = match[1];
        const analysis = analyzePassword(password);
        return res.json({
            id: null,
            utilisateur_id,
            contenu,
            date_question: new Date(),
            reponse: `Votre mot de passe a un score de sécurité de ${analysis.score}/5.\n` +
                (analysis.recommendations.length > 0
                    ? "Voici quelques conseils pour l'améliorer :\n- " + analysis.recommendations.join("\n- ")
                    : "Votre mot de passe est fort. Bien joué !"),
            reponse_id: null,
            theme: null, // Pas de thème pour les tests de mot de passe
        });
    }

    try {
        // Étape 1 : Identifier le thème de la question
        const themes = await new Promise((resolve, reject) => {
            db.query("SELECT id, nom FROM theme", (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const tfidf = new natural.TfIdf();
        themes.forEach((theme) => tfidf.addDocument(theme.nom));

        let bestTheme = null;
        let bestScore = 0;

        tfidf.tfidfs(contenu, (i, measure) => {
            if (measure > bestScore) {
                bestScore = measure;
                bestTheme = themes[i];
            }
        });

        if (!bestTheme) {
            return res.json({
                id: null,
                utilisateur_id,
                contenu,
                date_question: new Date(),
                reponse: "Je n'ai pas pu identifier le thème de votre question.",
                reponse_id: null,
                theme: null, // Pas de thème identifié
            });
        }

        // Étape 2 : Insérer la question
        const questionId = await new Promise((resolve, reject) => {
            db.query("INSERT INTO question (utilisateur_id, contenu, date_question) VALUES (?, ?, NOW())", [utilisateur_id, contenu], (err, result) => {
                if (err) reject(err);
                else resolve(result.insertId);
            });
        });

        // Étape 3 : Trouver la meilleure réponse dans la base de connaissances
        const knowledgeResults = await new Promise((resolve, reject) => {
            db.query("SELECT id, contenu FROM base_connaissance WHERE theme_id = ?", [bestTheme.id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const knowledgeTfidf = new natural.TfIdf();
        knowledgeResults.forEach((knowledge) => knowledgeTfidf.addDocument(knowledge.contenu));

        let bestMatch = null;
        let highestScore = 0;

        knowledgeTfidf.tfidfs(contenu, (i, measure) => {
            if (measure > highestScore) {
                highestScore = measure;
                bestMatch = knowledgeResults[i];
            }
        });

        let responseContent = "Je n'ai pas trouvé de réponse à votre question.";
        let reponseId = null;

        if (bestMatch) {
            responseContent = bestMatch.contenu;
            reponseId = await new Promise((resolve, reject) => {
                db.query("INSERT INTO reponse (question_id, contenu, source, date_reponse) VALUES (?, ?, 'base_connaissance', NOW())", [questionId, responseContent.trim()], (err, result) => {
                    if (err) reject(err);
                    else resolve(result.insertId);
                });
            });
        }

        // Étape 4 : Enregistrer l'interaction dans les logs
        await new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO logs_interaction (utilisateur_bis_id, question_bis_id, reponse_id, connaissance_bis_id, horodatage) VALUES (?, ?, ?, ?, NOW())",
                [utilisateur_id, questionId, reponseId, bestMatch ? bestMatch.id : null],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        // Étape 5 : Générer des suggestions de nouvelles questions
        const generateSuggestions = (question) => {
            const keywords = question.split(" ").slice(0, 3); // Extraire les 3 premiers mots-clés
            return [
                `Pouvez-vous expliquer ${keywords.join(" ")} en détail ?`,
                `Quels sont les avantages de ${keywords.join(" ")} ?`,
                `Comment fonctionne ${keywords.join(" ")} ?`,
            ];
        };

        const suggestions = generateSuggestions(contenu);

        // Étape 6 : Répondre avec les suggestions et le thème
        res.json({
            id: questionId,
            utilisateur_id,
            contenu,
            date_question: new Date(),
            reponse: responseContent.trim(),
            reponse_id: reponseId,
            theme: bestTheme.nom, // Inclure le thème identifié
            suggestions, // Ajouter les suggestions à la réponse
        });

    } catch (error) {
        console.error("Erreur lors du traitement de la question:", error);
        res.status(500).send("Erreur serveur");
    }
});

// Récupérer l'historique des interactions
app.get("/logs_interaction", (req, res) => {
    const { utilisateur_id } = req.query;

    if (!utilisateur_id) {
        return res.status(400).json({ error: "⚠️ ID utilisateur manquant" });
    }

    const query = `
        SELECT 
            logs_interaction.id,
            logs_interaction.horodatage,
            question.contenu AS question,
            reponse.contenu AS reponse,
            theme.nom AS theme
        FROM logs_interaction
        LEFT JOIN question ON logs_interaction.question_bis_id = question.id
        LEFT JOIN reponse ON logs_interaction.reponse_id = reponse.id
        LEFT JOIN base_connaissance ON logs_interaction.connaissance_bis_id = base_connaissance.id
        LEFT JOIN theme ON base_connaissance.theme_id = theme.id
        WHERE logs_interaction.utilisateur_bis_id = ?
        ORDER BY logs_interaction.horodatage DESC
    `;

    db.query(query, [utilisateur_id], (err, results) => {
        if (err) {
            console.error("Erreur SQL lors de la récupération des logs d'interaction:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        res.json(results);
    });
});

// Gestion des thèmes
app.get("/theme", (req, res) => {
    db.query("SELECT * FROM theme", (err, results) => {
        if (err) {
            console.error("Erreur SQL lors de la récupération des thèmes:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        res.json(results);
    });
});

app.post("/theme", (req, res) => {
    const { nom } = req.body;
    const query = "INSERT INTO theme (nom) VALUES (?)";

    db.query(query, [nom], (err, result) => {
        if (err) {
            console.error("Erreur SQL lors de l'ajout du thème:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        res.json({ id: result.insertId, nom });
    });
});

app.put("/theme/:id", (req, res) => {
    const { id } = req.params;
    const { nom } = req.body;
    const query = "UPDATE theme SET nom = ? WHERE id = ?";

    db.query(query, [nom, id], (err, result) => {
        if (err) {
            console.error("Erreur SQL lors du renommage du thème:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        res.json({ id, nom });
    });
});

app.delete("/theme/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM theme WHERE id = ?";

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Erreur SQL lors de la suppression du thème:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        res.json({ message: "Thème supprimé avec succès", id });
    });
});

// Gestion des contenus
app.get("/base_connaissance", (req, res) => {
    const { theme_id } = req.query;

    let query = "SELECT * FROM base_connaissance";
    const params = [];

    if (theme_id) {
        query += " WHERE theme_id = ?";
        params.push(theme_id);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error("Erreur SQL lors de la récupération des contenus:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        res.json(results);
    });
});

app.post("/base_connaissance", (req, res) => {
    const { theme_id, contenu } = req.body;
    const query = "INSERT INTO base_connaissance (theme_id, contenu, date_mise_a_jour) VALUES (?, ?, NOW())";

    db.query(query, [theme_id, contenu], (err, result) => {
        if (err) {
            console.error("Erreur SQL lors de l'ajout du contenu:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        res.json({ id: result.insertId, theme_id, contenu });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});