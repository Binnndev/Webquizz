import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import NavBar from "../Layout/NavBar";
import Profile from "./Profile";
import Tools from "./Tools";
import CuratedQuizList from "./CuratedQuizList";
import QuizService from "../../service/QuizService";
import QuizzerService from "../../service/QuizzerService";

class Dashboard extends Component {
  async componentDidMount() {
    const token  = sessionStorage.getItem("quizden-authToken");
    const userId = sessionStorage.getItem("quizden-user-id");
    QuizzerService.getQuizzer(userId, token).then((profile) => {
      this.setState({ user: profile });
    });
    // cập nhật App.state.user
    const profile = await QuizzerService.getQuizzer(userId, token);
    if (profile) this.props.onUserUpdate(profile);

    // load quizzes
    const quizzes = await QuizService.findByUser(userId, token);
    if (quizzes) this.props.onQuizLoad(quizzes);
  }

  render() {
    if (!this.props.checkLogin()) {
      return <Redirect to="/login" />;
    }

    const user    = this.props.user;
    const quizzes = this.props.quizzes;

    if (!user) {
      return <div>Đang tải…</div>;
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
            <Profile
           classes="col-sm-4 offset-sm-1 mr-4 section"
           name={user.name}
           email={user.email}
           curated={user.quizCurated}
           attended={user.quizAttended}
           flawless={user.quizFlawless}
         />

            {/* Tools section  */}
            <Tools
              classes="col-sm-6 ml-4 section tools"
              title="Công cụ Quizzer"
              subtitle="Một số công cụ chỉ có thể có bản Pro"
            />
            {/* Tools section  end*/}
          </div>
          <div
            className="row mt-5 mb-5"
            // very important code
            // to (roughly) algin this with upper sections
          >
            <CuratedQuizList
              // use this class only if you're desperate: curated-quiz-section
              classes="curated-quiz-section section"
              quizzes={this.props.quizzes}
            />

            {/* Tools section  end*/}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
