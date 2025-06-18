import axios from 'axios';

const API = process.env.REACT_APP_API_URI;

const QuizService = {
  // gửi quiz mới lên server
  create: async (data, token) => {
    try {
      const res = await axios.post(
        `${API}/quizzes`,
        data,
        { headers: { "auth-token": token } }
      );
      return res.data;
    } catch (err) {
      console.error("QuizService.create error:", err.response || err);
      return false;
    }
  },

  // giữ lại submit nếu chỗ khác có dùng
  submit: async (data, token) => {
    return QuizService.create(data, token);
  },

  findByUser: async (userId, token) => {
    try {
      const res = await axios.get(
        `${API}/quizzes/user/${userId}`,
        { headers: { "auth-token": token } }
      );
      return res.data;
    } catch (err) {
      console.error("QuizService.findByUser error:", err.response || err);
      return [];
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

  findById: async (id, token) => {
    return QuizService.getById(id, token);
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

  attend: async (quizId, answers, token) => {
  try {
    const userId = sessionStorage.getItem("quizden-user-id");    // lấy userId đã lưu ở login
    const response = await axios.post(
      `${API}/quizzes/submit/${userId}`,
      { quiz_id: quizId, answers },                              // truyền quiz_id + answers
      { headers: { "auth-token": token } }
    );
    return response.data;
  } catch (error) {
    console.error("Attend Quiz error:", error.response || error);
    return null;
  }
}
};

export default QuizService;