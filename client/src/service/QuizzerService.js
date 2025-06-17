import axios from 'axios';

const API = process.env.REACT_APP_API_URI;

const QuizzerService = {
  getQuizzer: async (quizzerId, token) => {
    try {
      const response = await axios.get(
        `${API}/quizzers/${quizzerId}`,
        { headers: { 'auth-token': token } }
      );
      return response.data;
    } catch (error) {
      console.error('Get Quizzer error', error.response || error);
      return false;
    }
  },

  updateStats: async (quizzerId, stats, token) => {
    try {
      const response = await axios.put(
        `${API}/quizzers/${quizzerId}`,
        stats,
        { headers: { 'auth-token': token } }
      );
      return response.data;
    } catch (error) {
      console.error('Update Quizzer error', error.response || error);
      return false;
    }
  }
};

export default QuizzerService;