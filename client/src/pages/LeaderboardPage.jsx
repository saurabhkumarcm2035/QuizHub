import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';

const LeaderboardPage = () => {
  const { quizId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get(`/results/${quizId}`);
        setLeaderboard(res.data);
      } catch (err) {
        console.error('Error fetching leaderboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [quizId]);

  if (loading) {
    return <h2 className="text-center mt-20 text-xl font-semibold">Loading Leaderboard...</h2>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Leaderboard</h1>
      
      {leaderboard.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ol className="space-y-4">
            {leaderboard.map((entry, index) => (
              <li key={entry._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-500 w-8">{index + 1}.</span>
                  <span className="text-lg text-gray-800">{entry.user.name}</span>
                </div>
                <span className="text-lg font-bold text-blue-500">{entry.score} / {entry.totalQuestions}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <p className="text-center text-gray-600">No results yet for this quiz. Be the first!</p>
      )}

      <div className="text-center mt-8">
        <Link to="/dashboard" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default LeaderboardPage;