import axios from 'axios';

const API = process.env.REACT_APP_API_URI;

const QuizService = {
 // alias cho QuizBuilder
 submit: async (data, token) => {
   try {
     const res = await axios.post(
       `${API}/quizzes`,
       data,
       { headers: { "auth-token": token } }
     );
     return res.data;
   } catch (err) {
     console.error("Submit Quiz error", err);
     return false;
   }
 },

  findByUser: async (userId, token) => {
    try {
      const res = await axios.get(
        `${API}/quizzes/user/${userId}`,
        { headers: { "auth-token": token } }
      );
      return res.data;                     
    } catch (err) {
      console.error("QuizService.findByUser error:", err);
      return [];  //trả về mảng rỗng, không false
    }
  },

  list: async (token) => {
    try {
      const response = await axios.get(
        `${API}/quizzes`,
        { headers: { 'auth-token': token } }
      );
      return response.data;
    } catch (error) {
      console.error('List Quizzes error', error.response || error);
      return [];
    }
  },

  getById: async (id, token) => {
    try {
      const response = await axios.get(
        `${API}/quizzes/${id}`,
        { headers: { 'auth-token': token } }
      );
      return response.data;
    } catch (error) {
      console.error('Get Quiz error', error.response || error);
      return null;
    }
  },

  update: async (id, data, token) => {
    try {
      const response = await axios.put(
        `${API}/quizzes/${id}`,
        data,
        { headers: { 'auth-token': token } }
      );
      return response.data;
    } catch (error) {
      console.error('Update Quiz error', error.response || error);
      return false;
    }
  },

  delete: async (id, token) => {
    try {
      await axios.delete(`${API}/quizzes/${id}`, {
        headers: { 'auth-token': token }
      });
      return true;
    } catch (error) {
      console.error('Delete Quiz error', error.response || error);
      return false;
    }
  },

  attend: async (id, answers, token) => {
    try {
      const response = await axios.post(
        `${API}/quizzes/${id}/attend`,
        { answers },
        { headers: { 'auth-token': token } }
      );
      return response.data;
    } catch (error) {
      console.error('Attend Quiz error', error.response || error);
      return null;
    }
  }
};

export default QuizService;