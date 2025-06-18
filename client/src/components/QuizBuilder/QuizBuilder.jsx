// src/components/QuizBuilder/QuizBuilder.jsx
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import NavBar from "../Layout/NavBar";
import Question from "./Question";
import Emoji from "../Layout/Emoji";
import QuizService from "../../service/QuizService";
import "./QuizBuilder.css";

class QuizBuilder extends Component {
  state = {
    title: "",
    description: "",
    type: "",
    questions: [],
  };

  // Handlers metadata
  handleTitleChange = (e) => this.setState({ title: e.target.value });
  handleDescriptionChange = (e) =>
    this.setState({ description: e.target.value });
  handleTypeChange = (e) => this.setState({ type: e.target.value });

  // Add / remove question
  handleAddQuestion = () => {
    const { questions } = this.state;
    const nextId =
      questions.length > 0 ? questions[questions.length - 1].id + 1 : 0;
    this.setState({
      questions: [
        ...questions,
        { id: nextId, title: "", options: [], answer: null },
      ],
    });
  };
  handleRemoveQuestion = (qId) =>
    this.setState({
      questions: this.state.questions.filter((q) => q.id !== qId),
    });

  // Handlers trong mỗi question
  handleQuestionTitleChange = (qId, value) => {
    const questions = [...this.state.questions];
    const idx = questions.findIndex((q) => q.id === qId);
    questions[idx].title = value;
    this.setState({ questions });
  };
  handleQuestionAddOption = (qId) => {
    const questions = [...this.state.questions];
    const idx = questions.findIndex((q) => q.id === qId);
    const opts = questions[idx].options;
    const nextOptId = opts.length > 0 ? opts[opts.length - 1].id + 1 : 0;
    opts.push({ id: nextOptId, value: "" });
    questions[idx].options = opts;
    this.setState({ questions });
  };
  handleOptionChange = (qId, optId, value) => {
    const questions = [...this.state.questions];
    const qidx = questions.findIndex((q) => q.id === qId);
    questions[qidx].options = questions[qidx].options.map((o) =>
      o.id === optId ? { ...o, value } : o
    );
    this.setState({ questions });
  };
  handleOptionRemove = (qId, optId) => {
    const questions = [...this.state.questions];
    const qidx = questions.findIndex((q) => q.id === qId);
    let opts = questions[qidx].options.filter((o) => o.id !== optId);
    opts = opts.map((o, i) => ({ ...o, id: i }));
    questions[qidx].options = opts;
    this.setState({ questions });
  };
  handleSelectAnswer = (qId, optId) => {
    const questions = [...this.state.questions];
    const idx = questions.findIndex((q) => q.id === qId);
    questions[idx].answer = optId;
    this.setState({ questions });
  };

  // Reset tất cả
  handleResetAll = () =>
    this.setState({ title: "", description: "", type: "", questions: [] });

  // Submit với validation
  handleSubmitQuiz = async () => {
    const { title, type, questions } = this.state;
    if (!title.trim()) return alert("Nhập tiêu đề Quiz");
    if (!type) return alert("Chọn kiểu Quiz");
    if (questions.length === 0) return alert("Thêm ít nhất 1 câu hỏi");
    for (const q of questions) {
      if (!q.title.trim()) return alert("Nhập tiêu đề cho câu hỏi");
      if (q.options.length < 2)
        return alert("Mỗi câu hỏi cần ít nhất 2 lựa chọn");
      if (q.options.some((o) => !o.value.trim()))
        return alert("Nhập nội dung cho tất cả lựa chọn");
      if (typeof q.answer !== "number")
        return alert("Chọn đáp án cho câu hỏi");
    }

    const token = sessionStorage.getItem("quizden-authToken");
    const created = await QuizService.create(this.state, token);
    if (!created) alert("Tạo quiz thất bại");
    else this.props.history.push("/quiz-done", { quiz: created });
  };

  render() {
    if (!this.props.checkLogin()) return <Redirect to="/login" />;

    return (
      <>
        <NavBar
          isLoggedIn={this.props.isLoggedIn}
          checkLogin={this.props.checkLogin}
          onLogout={this.props.onLogout}
        />

        <div className="quiz-builder">
          {/* Metadata */}
          <div className="metadata-card">
            <h3>Tạo Quiz Mới</h3>
            <div className="row">
              <div className="col-md-4 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter quiz title"
                  value={this.state.title}
                  onChange={this.handleTitleChange}
                />
              </div>
              <div className="col-md-4 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter description"
                  value={this.state.description}
                  onChange={this.handleDescriptionChange}
                />
              </div>
              <div className="col-md-4 mb-3">
                <select
                  className="form-control"
                  value={this.state.type}
                  onChange={this.handleTypeChange}
                >
                  <option value="">-- Select --
                  </option>
                  <option value="AMATEUR">Amateur
                  </option>
                  <option value="TIME_TRIAL" disabled>
                    Time Trial
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Questions */}
          {this.state.questions.map((q) => (
            <div key={q.id} className="question-card">
              <div className="card-header">
                Question {q.id + 1}
              </div>
              <div className="card-body">
                <Question
                  question={q}
                  onTitleChange={this.handleQuestionTitleChange}
                  onAddOption={this.handleQuestionAddOption}
                  onOptionChange={this.handleOptionChange}
                  onOptionRemove={this.handleOptionRemove}
                  onSelectAnswer={this.handleSelectAnswer}
                  onRemove={this.handleRemoveQuestion}
                />
              </div>
            </div>
          ))}

          {/* Action buttons */}
          <div className="actions">
            <button
              className="btn-custom btn-add"
              onClick={this.handleAddQuestion}
            >
              <Emoji emoji="💣" /> Add Question
            </button>
            <button
              className="btn-custom btn-reset"
              onClick={this.handleResetAll}
            >
              <Emoji emoji="✂️" /> Reset Quiz
            </button>
            <button
              className="btn-custom btn-submit"
              onClick={this.handleSubmitQuiz}
            >
              <Emoji emoji="🔨" /> Submit Quiz
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default QuizBuilder;
