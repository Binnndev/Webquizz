import React from "react";
import NavBar from "../Layout/NavBar";
import { Link, Redirect } from "react-router-dom";

const QuizTaken = (props) => {
  // Lấy đúng object 'result' bạn đã push từ QuizTaker.handleSubmit
  const result = props.location.state?.result;

  // Nếu không có result, chuyển về dashboard
  if (!result) {
    return <Redirect to="/dashboard" />;
  }

  const { solved, total_questions } = result;

  return (
    <React.Fragment>
      <NavBar
        isLoggedIn={props.isLoggedIn}
        checkLogin={props.checkLogin}
        onLogout={props.onLogout}
      />

      <div className="container fluid">
        <div className="row">
          <div
            className="col-sm-12"
            style={{
              fontFamily: `'Lexend Deca', sans-serif`,
              fontSize: "36px",
              color: "var(--quizden-light)",
              marginTop: "30vh",
              textAlign: "center",
            }}
          >
            Bạn đã giải được {solved} trên {total_questions} câu hỏi!!!
          </div>
        </div>
        <div className="row pt-3">
          <div
            className="col-sm-12"
            style={{
              fontFamily: `'Roboto', sans-serif`,
              fontSize: "18px",
              color: "var(--quizden-light-purple)",
              textAlign: "center",
            }}
          >
            Don't cry because it is over, smile because it happened!
          </div>
        </div>
        <div className="row">
          <div
            className="col-sm-12 mt-5"
            style={{
              textAlign: "center",
            }}
          >
            <Link to="/dashboard">
              <span className="back-to-home ">
                <span role="img" aria-label="man-walking">
                  🚶
                </span>{" "}
                Đi tới Dashboard
              </span>
            </Link>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default QuizTaken;