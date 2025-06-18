import React, { Component } from "react";
import NavBar from "../Layout/NavBar";
import { Redirect } from "react-router-dom";
import QuizQuestion from "./QuizQuestion";
import Emoji from "../Layout/Emoji";
import QuizService from "../../service/QuizService";

class QuizTaker extends Component {
  constructor(props) {
    super(props);
    const { questions } = props.quiz || { questions: [] };
    // Khởi tạo answers từ questions
    const answers = questions.map(q => ({ question_id: q.id, answer: -1 }));

    this.state = {
      quiz: props.quiz,
      answers
    };
    sessionStorage.setItem('quiz-attending', this.state.quiz?._id);
  }

  async componentDidMount() {
    const token = sessionStorage.getItem('quizden-token');
    const quizId = this.state.quiz?._id;
    if (token && quizId) {
      try {
        const quiz = await QuizService.getById(quizId, token);
        this.setState({ quiz });
      } catch (err) {
        console.error('Load quiz error', err);
      }
    }
  }

  handleSelectAnswer = (question_id, answer) => {
    this.setState(prev => ({
      answers: prev.answers.map(a =>
        a.question_id === question_id ? { ...a, answer } : a
      )
    }));
  };

  handleSubmit = async () => {
    const token = sessionStorage.getItem('quizden-token');
    const quizId = this.state.quiz?._id;
    if (token && quizId) {
      const result = await QuizService.attend(quizId, this.state.answers, token);
      this.props.history.push('/quiz-taken', { result });
    }
  };

  render() {
    if (!this.props.checkLogin()) {
      return <Redirect to="/login" />;
    }
    const { quiz, answers } = this.state;
    if (!quiz) return null;
    return (
      <>
        <NavBar
          isLoggedIn={this.props.isLoggedIn}
          checkLogin={this.props.checkLogin}
          onLogout={this.props.onLogout}
        />
        <div className="container-fluid">
          <div className="row mt-5">
            <div className="col-sm-8 offset-sm-2 section">
              <div className="profile-name">{quiz.title}</div>
              <div className="profile-email">{quiz.description}</div>
              <div
                className="option-dropdown pt-4"
                style={{
                  width: "max-content",
                }}
              >
                <span style={{ color: "var(--quizden-bg-dark)" }}>
                  Loại Quiz:{" "}
                </span>
                {quiz.type}
              </div>
            </div>
          </div>

          <div className="row mt-5">
            {quiz.questions.map((question) => (
              <QuizQuestion
                key={question.id}
                question={question}
                onSelectAnswer={this.handleSelectAnswer}
                //   onTitleChange={this.handleQuestionTitleChange}
                //   onRemove={this.handleRemoveQuestion}
                //   onAddOption={this.handleQuestionAddOption}
                //   onOptionChange={this.handleOptionChange}
                //   onOptionRemove={this.handleRemoveOption}
                //   onSelectAnswer={this.handleSelectAnswer}
              />
            ))}
          </div>
          <div className="row mt-4 mb-4">
            <div
              className="col-sm-12"
              style={{
                textAlign: "center",
              }}
            >
              <button className="tool-button" onClick={this.handleSubmit}>
                <Emoji emoji="💣" /> Nộp bài
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default QuizTaker;
