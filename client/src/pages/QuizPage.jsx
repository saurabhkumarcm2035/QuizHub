import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        setQuiz(res.data);
      } catch (err) {
        console.error(err);
        alert('Could not load quiz.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleAnswer = (selectedAnswer) => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion + 1 < quiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore(newAnswers);
    }
  };

  const calculateScore = async (finalAnswers) => {
    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === finalAnswers[index]) {
        correctCount++;
      }
    });
    setScore(correctCount);

    try {
      const resultData = {
        quizId: quiz._id,
        score: correctCount,
        totalQuestions: quiz.questions.length
      };
      await api.post('/results', resultData);
    } catch (err) {
      console.error("Failed to save quiz result", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold">Loading Quiz...</h2>
      </div>
    );
  }

  if (!quiz) return <h2 className="text-center mt-20">Quiz not found.</h2>;

  if (score !== null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center w-full max-w-lg">
          <h1 className="text-3xl font-bold mb-4">Quiz Finished!</h1>
          <p className="text-xl text-gray-700 mb-6">Your Score:</p>
          <p className="text-6xl font-bold text-blue-500 mb-8">
            {score} / {quiz.questions.length}
          </p>
          <Link
            to={`/leaderboard/${quiz._id}`}
            className="w-full block bg-gray-700 text-white py-2 rounded-md hover:bg-gray-800 transition-colors mt-4"
          >
            View Leaderboard
          </Link>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors mt-2"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <div className="mb-6">
          <p className="text-sm text-gray-500">Question {currentQuestion + 1} of {quiz.questions.length}</p>
          <h1 className="text-2xl font-semibold mt-2">{question.questionText}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full bg-gray-100 text-gray-800 p-4 rounded-md text-left hover:bg-blue-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;