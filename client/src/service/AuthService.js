import axios from 'axios';

const API = process.env.REACT_APP_API_URI;

const AuthService = {
  register: async (request) => {
    try {
      const response = await axios.post(
        `${API}/auth/registration`,
        request
      );
      return response.data;
    } catch (error) {
      console.error('Registration error', error.response || error);
      return false;
    }
  },

   login: async (request) => {
    try {
      const response = await axios.post(`${API}/auth/login`, request);
      const authToken = response.headers["auth-token"];
      // lưu đúng key để thống nhất với Dashboard.jsx, QuizTaker.jsx…
      sessionStorage.setItem("quizden-authToken", authToken);
      sessionStorage.setItem("quizden-user-id", response.data._id);
      return { ...response.data, authToken };
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  },

  logout: () => {
    sessionStorage.clear();
  }
};

export default AuthService;