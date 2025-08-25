import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const CreateQuizPage = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: '' },
  ]);
  const navigate = useNavigate();

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index][event.target.name] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const quizData = { title, questions };
      await api.post('/quizzes', quizData);
      alert('Quiz created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error creating quiz: ' + (err.response?.data?.msg || 'Server Error'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">Create a New Quiz</h1>
        <form onSubmit={onSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="title">
              Quiz Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-gray-50 border p-6 rounded-md mb-6 relative">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-semibold">Question {qIndex + 1}</h4>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    Remove
                  </button>
                )}
              </div>
              <textarea
                name="questionText"
                placeholder="Question Text"
                value={q.questionText}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
              ></textarea>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {q.options.map((opt, oIndex) => (
                  <input
                    key={oIndex}
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
               <input
                type="text"
                name="correctAnswer"
                placeholder="Correct Answer (must match one of the options exactly)"
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          
          <div className="flex items-center justify-between mt-8">
            <button
              type="button"
              onClick={addQuestion}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Add Another Question
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuizPage;