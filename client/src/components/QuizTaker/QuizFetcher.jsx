import React, { Component } from "react";
import NavBar from "../Layout/NavBar";
import { Link, Redirect } from "react-router-dom";
import Emoji from "../Layout/Emoji";
import QuizService from "../../service/QuizService";
import QuizHeader from "./QuizHeader";
import ToolTip from "../Dashboard/ToolTip";

class QuizFetcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizCode: "",
      quiz: null,
      error: false,
    };
  }

  handleQuizCodeInput = (e) => {
    this.setState({ quizCode: e.target.value, error: false });
  };

  handleFindQuiz = () => {
    const { quizCode } = this.state;
    if (!quizCode.trim()) {
      this.setState({ error: true });
      return;
    }
    // Lấy token đã lưu trong AuthService.login
    const token = sessionStorage.getItem("quizden-authToken");
    if (!token) {
      this.setState({ error: true });
      return;
    }
    // Gọi với cả code và token
    QuizService.findById(quizCode.trim(), token).then((response) => {
      if (!response) {
        this.setState({ error: true });
      } else {
        this.setState({ quiz: response, error: false });
        this.props.onQuizFetch(response);
      }
    });
  };

  render() {
    if (!this.props.checkLogin()) {
      return <Redirect to={{ pathname: "/login" }} />;
    }
    return (
      <React.Fragment>
        <NavBar
          isLoggedIn={this.props.isLoggedIn}
          checkLogin={this.props.checkLogin}
          onLogout={this.props.onLogout}
        />
        <div className="container-fluid">
          <div className="row mt-5">
            <div
              className="col-sm-6 offset-sm-3 section"
              style={{
                textAlign: "center",
              }}
            >
              <div className="profile-name">Nhập Mã Quiz</div>
              <div className="profile-email pb-3">
                
              </div>
              <input
                className="quiz-code-input"
                type="text"
                spellCheck="false"
                value={this.state.quizCode}
                onChange={this.handleQuizCodeInput}
              />
              <button className="tool-button" onClick={this.handleFindQuiz}>
                <Emoji emoji="🔎" /> Tìm Quiz
              </button>
              {this.state.error && (
                <div className="profile-email pb-3" style={{}}>
                  Không tìm thấy mã hợp lệ, good luck!
                </div>
              )}
              {!this.state.error && this.state.quiz && (
                <>
                  <QuizHeader
                    title={this.state.quiz.title}
                    description={this.state.quiz.description}
                  />
                  <div className="tooltip-wrapper">
                    <Link to="/quiz-taker">
                      <button className="tool-button">
                        <Emoji emoji="⚔️" /> Chiến đấu ngay!
                      </button>
                    </Link>
                    <ToolTip
                      emoji="🪓"
                      title="Không còn đường quay lại nữa!"
                      description="Chúc bạn may mắn với quiz lần sau!"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default QuizFetcher;
