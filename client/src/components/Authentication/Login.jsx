import React, { Component } from "react";
import NavBar from "../Layout/NavBar";
import { Link, Redirect } from "react-router-dom";
import AuthService from "../../service/AuthService";
import QuizzerService from "../../service/QuizzerService";
import AuthError from "../Layout/AuthError";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: false,
    };
  }

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value, error: false });
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value, error: false });
  };

   handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    const res = await AuthService.login({ email, password });
    if (!res) {
      this.setState({ error: true });
    } else {
      sessionStorage.setItem('quizden-token', res.authToken);
      sessionStorage.setItem('quizden-user-id', res._id);
      // Lấy profile quizzer
      const profile = await QuizzerService.getQuizzer(res._id, res.authToken);
      this.props.onLogin(profile);
      this.props.history.push('/dashboard');
    }
  };

  render() {
    // console.log("register", sessionStorage.getItem("isLoggedIn"));
    if (this.props.checkLogin()) {
      return <Redirect to={{ pathname: "/dashboard" }} />;
    }
    return (
      <React.Fragment>
        <NavBar
          isLoggedIn={this.props.isLoggedIn}
          checkLogin={this.props.checkLogin}
          onLogout={this.props.onLogout}
        />
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-8 offset-sm-4 mt-5">
              <Link to="/">
                <span className="back-to-home">
                  <span role="img" aria-label="man-walking">
                    🚶
                  </span>{" "}
                  Quay về Trang chủ
                </span>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-8 offset-sm-4">
              <div className="auth-title mt-1">Đăng nhập tài khoản</div>
            </div>
          </div>
          <form onSubmit={this.handleLoginSubmit}>
            <div className="form-group">
              {/* email */}
              <div className="row mt-4">
                <div className="col-sm-4 offset-sm-4">
                  <label className="input-label" htmlFor="inputEmail">
                    Email
                  </label>
                  <input
                    required="required"
                    type="text"
                    className="form-control input-field"
                    aria-describedby="emailInput"
                    placeholder="hoanghai@email.com"
                    value={this.state.email}
                    onChange={this.handleEmailChange}
                  />
                </div>
              </div>

              {/* password */}
              <div className="row mt-4">
                <div
                  className="col-sm-4 offset-sm-4"
                  //   style={{ backgroundColor: "red" }}
                >
                  <label className="input-label" htmlFor="inputPassword">
                    Mật khẩu
                  </label>
                  <input
                    required="required"
                    type="password"
                    className="form-control input-field"
                    aria-describedby="passwordInput"
                    placeholder="Mật khẩu của bạn"
                    value={this.state.password}
                    onChange={this.handlePasswordChange}
                  />
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-sm-2 offset-sm-4">
                  <button
                    type="submit"
                    className="button register-button"
                    style={{
                      width: "100%",
                      height: "42px",
                    }}
                  >
                    Đăng Nhập
                  </button>
                </div>
                <div className="col-sm-2">
                  <Link to="/registration">
                    <div className="back-to-home mt-2">
                      <span role="img" aria-label="man-walking">
                        🚶
                      </span>{" "}
                      Đăng kí tài khoản mới
                    </div>
                  </Link>
                </div>
              </div>
              {this.state.error && (
                <AuthError text="Thông tin đăng nhập không hợp lệ!" />
              )}
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
