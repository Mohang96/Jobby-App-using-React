import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    searchInput: '',
    profileDetails: '',
    empTypeList: [],
    minPackage: '',
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
    jobsList: [],
  }

  componentDidMount() {
    this.getProfileAndJobsDetails()
  }

  getProfileAndJobsDetails = () => {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  getJobsDetails = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})

    const {searchInput, empTypeList, minPackage} = this.state
    const empTypeStr = empTypeList.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${empTypeStr}&minimum_package=${minPackage}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsApiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.setState({
        jobsApiStatus: apiStatusConstants.success,
        jobsList: data.jobs,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})

    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileApiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.setState({
        profileApiStatus: apiStatusConstants.success,
        profileDetails: data.profile_details,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  renderJobsInProgressView = () => (
    <div className="jobs-loading-view-background" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsSuccessView = () => {
    const {jobsList} = this.state

    if (jobsList.length === 0) {
      return (
        <div className="jobs-success-view-background">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-image"
          />
          <h1 className="no-jobs-heading">No Jobs Found</h1>
          <p className="no-jobs-description">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      )
    }

    return (
      <div className="jobs-success-view-background">
        <ul className="jobs-list">
          {jobsList.map(eachJobItem => (
            <JobItem key={eachJobItem.id} jobDetails={eachJobItem} />
          ))}
        </ul>
      </div>
    )
  }

  onClickJobsFailureRetryButton = () => {
    this.getJobsDetails()
  }

  renderJobsFailureView = () => (
    <div className="jobs-failure-view-background">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-view-image"
      />
      <h1 className="jobs-failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickJobsFailureRetryButton}
      >
        Retry
      </button>
    </div>
  )

  renderJobsDetails = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderJobsInProgressView()
      case apiStatusConstants.success:
        return this.renderJobsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      default:
        return null
    }
  }

  renderJobsSection = () => {
    const {searchInput} = this.state

    return (
      <>
        <div className="search-tablet-container">
          <input
            type="text"
            className="search-input"
            value={searchInput}
            onChange={this.onChangeSearchInput}
            placeholder="Search"
          />
          <button
            type="button"
            data-testid="searchButton"
            onClick={this.onClickSearchIcon}
            className="search-button"
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        <div className="jobs-container">{this.renderJobsDetails()}</div>
      </>
    )
  }

  renderProfileInProgressView = () => (
    <div className="profile-loading-view-background" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileSuccessView = () => {
    const {profileDetails} = this.state
    const updatedProfileDetails = {
      name: profileDetails.name,
      profileImageUrl: profileDetails.profile_image_url,
      shortBio: profileDetails.short_bio,
    }
    const {name, profileImageUrl, shortBio} = updatedProfileDetails

    return (
      <div className="profile-success-view-background">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="name">{name}</h1>
        <p className="profile-description">{shortBio}</p>
      </div>
    )
  }

  onClickProfileRetryButton = () => {
    this.getProfileDetails()
  }

  renderProfileFailureView = () => (
    <div className="profile-failure-view-background">
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickProfileRetryButton}
      >
        Retry
      </button>
    </div>
  )

  onClickSalaryItem = event => {
    this.setState({minPackage: event.target.id}, this.getJobsDetails)
  }

  renderSalaryItem = salaryItemDetails => {
    const {label, salaryRangeId} = salaryItemDetails

    return (
      <li key={salaryRangeId} className="salary-item">
        <input
          type="radio"
          className="salary-input"
          onClick={this.onClickSalaryItem}
          id={salaryRangeId}
          name="salary-item"
        />
        <label className="salary-label" htmlFor={salaryRangeId}>
          {label}
        </label>
      </li>
    )
  }

  onClickEmploymentItem = event => {
    this.setState(
      prevState => ({
        empTypeList: [...prevState.empTypeList, event.target.id],
      }),
      this.getJobsDetails,
    )
  }

  renderEmploymentItem = employmentItemDetails => {
    const {label, employmentTypeId} = employmentItemDetails

    return (
      <li key={employmentTypeId} className="filter-item">
        <input
          type="checkbox"
          className="filter-input"
          onClick={this.onClickEmploymentItem}
          id={employmentTypeId}
        />
        <label className="filter-label" htmlFor={employmentTypeId}>
          {label}
        </label>
      </li>
    )
  }

  renderFiltersSection = () => {
    const {location} = this.props
    const {employmentTypesList, salaryRangesList} = location

    return (
      <>
        <hr className="separator" />
        <div className="filters-category-background">
          <h1 className="filters-category-heading">Type of Employment</h1>
          <ul className="filters-list">
            {employmentTypesList.map(eachEmploymentType =>
              this.renderEmploymentItem(eachEmploymentType),
            )}
          </ul>
        </div>
        <hr className="separator" />
        <div className="filters-category-background">
          <h1 className="filters-category-heading">Salary Range</h1>
          <ul className="filters-list">
            {salaryRangesList.map(eachSalaryItem =>
              this.renderSalaryItem(eachSalaryItem),
            )}
          </ul>
        </div>
      </>
    )
  }

  renderProfileDetails = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderProfileInProgressView()
      case apiStatusConstants.success:
        return this.renderProfileSuccessView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  onClickSearchIcon = async () => {
    this.getJobsDetails()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  renderProfileSection = () => {
    const {searchInput} = this.state

    return (
      <>
        <div className="search-mobile-container">
          <input
            type="text"
            className="search-input"
            value={searchInput}
            onChange={this.onChangeSearchInput}
            placeholder="Search"
          />
          <button
            type="button"
            data-testid="searchButton"
            onClick={this.onClickSearchIcon}
            className="search-button"
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        {this.renderProfileDetails()}
      </>
    )
  }

  render() {
    return (
      <div className="jobs-background">
        <Header />
        <div className="jobs-search-and-display-background">
          <div className="profile-and-filters-background">
            {this.renderProfileSection()}
            {this.renderFiltersSection()}
          </div>
          <div className="jobs-section-background">
            {this.renderJobsSection()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
