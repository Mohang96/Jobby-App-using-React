import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onClickLogoutButton = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <div className="header-background">
      <div>
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website log"
            className="header-website-logo"
          />
        </Link>
      </div>
      <div className="mobile-header-background">
        <Link to="/">
          <button type="button" className="icon-button">
            <AiFillHome className="header-icon" />
          </button>
        </Link>
        <Link to="/jobs">
          <button type="button" className="icon-button">
            <BsBriefcaseFill className="header-icon" />
          </button>
        </Link>
        <Link to="/login">
          <button
            type="button"
            onClick={onClickLogoutButton}
            className="icon-button"
          >
            <FiLogOut className="header-icon" />
          </button>
        </Link>
      </div>
      <div className="tablet-header-background">
        <div>
          <Link to="/" className="header-text">
            Home
          </Link>
          <Link to="/jobs" className="header-text">
            Jobs
          </Link>
        </div>
        <div>
          <Link to="/login">
            <button
              type="button"
              className="logout-button"
              onClick={onClickLogoutButton}
            >
              Logout
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Header)
