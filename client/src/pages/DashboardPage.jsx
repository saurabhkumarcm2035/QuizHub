import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { jwtDecode } from 'jwt-decode';
import AuthContext from '../context/AuthContext';

const DashboardPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get auth state from context
  const { user: authUser, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    // Don't fetch until the main auth check is complete
    if (authLoading) {
      return; 
    }

    const fetchQuizzes = async () => {
      try {
        const res = await api.get('/quizzes');
        setQuizzes(res.data);
      } catch (err) {
        console.error('Error fetching quizzes', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [authLoading]);

  // Use the loading state from the context for the initial load
  if (authLoading || loading) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quiz Dashboard</h1>
        {authUser && authUser.role === 'Organizer' && (
          <Link
            to="/create-quiz"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Create New Quiz
          </Link>
        )}
      </header>

      <main>
        {quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Link key={quiz._id} to={`/quiz/${quiz._id}`} className="block">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-transform hover:-translate-y-1">
                  <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                  <p className="text-gray-600">{quiz.questions.length} questions</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <h3 className="text-xl text-gray-700">No quizzes found.</h3>
            {authUser && authUser.role === 'Organizer' && (
               <p className="text-gray-500 mt-2">Why not create the first one?</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;