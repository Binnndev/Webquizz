import React from "react";
import { Link, Redirect } from "react-router-dom";
import NavBar from "../Layout/NavBar";

const QuizDone = (props) => {
  // Nếu không có quiz trong location.state, quay về dashboard
  const quiz = props.location.state?.quiz;
  if (!quiz) {
    return <Redirect to="/dashboard" />;
  }

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
            Quiz của bạn đã được tạo thành công{" "}
            <span
              style={{
                color: "var(--quizden-dark-purple)",
              }}
            >
              
            </span>
            !
          </div>
        </div>

        <div className="row">
          <div
            className="col-sm-12"
            style={{
              fontFamily: `'Roboto', sans-serif`,
              fontSize: "18px",
              color: "var(--quizden-light-purple)",
              textAlign: "center",
            }}
          >
            Sao chép Quiz ID and chia sẻ.
          </div>
        </div>

        <div className="row mt-5">
          <div
            className="col-sm-12"
            style={{
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: `'Lexend Deca', sans-serif`,
                fontSize: "22px",
                color: "var(--quizden-deep-purple)",
                padding: "1.4em",
                border: "2px solid var(--quizden-dark-purple)",
                borderRadius: "12px",
                margin: "auto",
                width: "fit-content",
                backgroundColor: "var(--quizden-light)",
              }}
            >
              {quiz._id}
            </div>
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

export default QuizDone;