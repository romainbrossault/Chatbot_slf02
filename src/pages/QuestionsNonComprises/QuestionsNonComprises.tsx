import React, { useEffect, useState } from "react";
import "./styles/QuestionsNonComprises.css";

const QuestionsNonComprises: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);

  const fetchQuestions = async () => {
    const res = await fetch("http://localhost:5000/question_non_comprise");
    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleTraiter = async (id: number) => {
    await fetch(`http://localhost:5000/question_non_comprise/${id}`, {
      method: "PUT",
    });
    fetchQuestions();
  };

  return (
    <div className="questions-non-comprises-container">
      <h1>Questions non comprises</h1>
      <table>
        <thead>
          <tr>
            <th>Contenu</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id}>
              <td>{q.contenu_question}</td>
              <td>
                <span className={q.statut === 0 ? "statut-non-traite" : "statut-traite"}>
                  {q.statut === 0 ? "Non traité" : "Traité"}
                </span>
              </td>
              <td>
                {q.statut === 0 && (
                  <button className="traiter-btn" onClick={() => handleTraiter(q.id)}>
                    Traiter
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionsNonComprises;