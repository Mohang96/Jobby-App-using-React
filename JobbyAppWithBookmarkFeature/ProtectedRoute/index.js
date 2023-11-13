import Cookies from 'js-cookie'
import {Redirect, Route} from 'react-router-dom'

const ProtectedRoute = props => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  const {employmentTypesList, salaryRangesList, location, path} = props
  if (path === '/jobs') {
    location.employmentTypesList = employmentTypesList
    location.salaryRangesList = salaryRangesList
  }
  return <Route {...props} />
}

export default ProtectedRoute
