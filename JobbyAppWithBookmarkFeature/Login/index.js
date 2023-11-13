import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', showLoginError: false, errMsg: ''}

  onLoginSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 7})
    const {history} = this.props
    history.replace('/')
  }

  onLoginFailure = errMsg => {
    this.setState({showLoginError: true, errMsg})
  }

  onLoginForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const loginApiUrl = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginApiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderPasswordField = () => {
    const {password} = this.state

    return (
      <>
        <label className="label-element" htmlFor="passwordInput">
          PASSWORD
        </label>
        <input
          type="password"
          id="passwordInput"
          className="input-element"
          onChange={this.onChangePassword}
          value={password}
        />
      </>
    )
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  renderUsernameField = () => {
    const {username} = this.state

    return (
      <>
        <label className="label-element" htmlFor="usernameInput">
          USERNAME
        </label>
        <input
          type="text"
          value={username}
          onChange={this.onChangeUsername}
          className="input-element"
          id="usernameInput"
        />
      </>
    )
  }

  render() {
    const {showLoginError, errMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-background">
        <div className="login-form-background">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo-image"
          />
          <form className="login-form" onSubmit={this.onLoginForm}>
            <div className="input-container">{this.renderUsernameField()}</div>
            <div className="input-container">{this.renderPasswordField()}</div>
            <button type="submit" className="login-button">
              Login
            </button>
            {showLoginError && <p className="err-msg">*{errMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
