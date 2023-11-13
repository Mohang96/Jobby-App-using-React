import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {AiFillStar} from 'react-icons/ai'
import {BiCurrentLocation} from 'react-icons/bi'
import {
  BsFillBriefcaseFill,
  BsBookmark,
  BsFillBookmarkFill,
} from 'react-icons/bs'
import {HiOutlineExternalLink} from 'react-icons/hi'

import Header from '../Header'

import JobContext from '../../context/JobContext'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: {},
    isBookmarked: false,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {jobId} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${jobId}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobDetails: data,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderInProgressView = () => (
    <div className="job-details-loading-view-background" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {jobDetails} = this.state
    const updatedJobItemDetails = {
      companyLogoUrl: jobDetails.job_details.company_logo_url,
      companyWebsiteUrl: jobDetails.job_details.company_website_url,
      employmentType: jobDetails.job_details.employment_type,
      jobId: jobDetails.job_details.id,
      jobDescription: jobDetails.job_details.job_description,
      title: jobDetails.job_details.title,
      skills: jobDetails.job_details.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      })),
      lifeAtCompany: {
        description: jobDetails.job_details.life_at_company.description,
        imageUrl: jobDetails.job_details.life_at_company.image_url,
      },
      location: jobDetails.job_details.location,
      packagePerAnnum: jobDetails.job_details.package_per_annum,
      rating: jobDetails.job_details.rating,
      similarJobs: jobDetails.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobId: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      })),
    }
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      title,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      similarJobs,
    } = updatedJobItemDetails

    return (
      <JobContext.Consumer>
        {value => {
          const {addToBookmarkList, removeFromBookmarkList} = value
          const {isBookmarked} = this.state

          const addToBookmarks = () => {
            addToBookmarkList(updatedJobItemDetails)
            this.setState(prevState => ({
              isBookmarked: !prevState.isBookmarked,
            }))
          }

          const removeFromBookmarks = () => {
            removeFromBookmarkList(updatedJobItemDetails.jobId)
            this.setState(prevState => ({
              isBookmarked: !prevState.isBookmarked,
            }))
          }

          return (
            <div className="job-details-success-view-background">
              <div className="job-details-container">
                <div className="title-and-logo-container">
                  <img
                    src={companyLogoUrl}
                    alt="job details company logo"
                    className="company-logo"
                  />
                  <div className="title-and-bookmark-container">
                    <div>
                      <h1 className="title">{title}</h1>
                      <div className="rating-container">
                        <div className="rating-icon">
                          <AiFillStar />
                        </div>
                        <p className="rating-text">{rating}</p>
                      </div>
                    </div>
                    {isBookmarked ? (
                      <BsFillBookmarkFill
                        className="bookmark-icon"
                        onClick={removeFromBookmarks}
                      />
                    ) : (
                      <BsBookmark
                        onClick={addToBookmarks}
                        className="bookmark-icon"
                      />
                    )}
                  </div>
                </div>
                <div className="location-and-salary-container">
                  <div className="location-and-emp-type-container">
                    <div className="category-container">
                      <BiCurrentLocation className="category-icon" />
                      <p className="category-text">{location}</p>
                    </div>
                    <div className="category-container">
                      <BsFillBriefcaseFill className="category-icon" />
                      <p className="category-text">{employmentType}</p>
                    </div>
                  </div>
                  <p className="salary-text">{packagePerAnnum}</p>
                </div>
                <hr className="separator" />
                <div className="description-and-visit-link-container">
                  <h2 className="description">Description</h2>
                  <div>
                    <a
                      href={companyWebsiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="visit-text"
                    >
                      Visit{' '}
                      <HiOutlineExternalLink className="external-link-icon" />
                    </a>
                  </div>
                </div>
                <p className="description-text">{jobDescription}</p>
                <div>
                  <h1 className="skills-container-heading">Skills</h1>
                  <ul className="skills-list">
                    {skills.map(eachSkill => (
                      <li key={eachSkill.name} className="skill-item">
                        <img
                          src={eachSkill.imageUrl}
                          alt={eachSkill.name}
                          className="skill-image"
                        />
                        <p className="skill-name">{eachSkill.name}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h1 className="life-at-company-heading">Life at Company</h1>
                  <div className="life-at-company-description-and-image-container">
                    <p className="life-at-company-description">
                      {lifeAtCompany.description}
                    </p>
                    <img
                      src={lifeAtCompany.imageUrl}
                      alt="life at company"
                      className="life-at-company-image"
                    />
                  </div>
                </div>
              </div>
              <div className="similar-jobs-container">
                <h1 className="similar-jobs-container-heading">Similar Jobs</h1>
                <ul className="similar-jobs-list">
                  {similarJobs.map(eachJob => (
                    <li className="similar-job-background" key={eachJob.jobId}>
                      <div className="title-and-logo-container">
                        <img
                          src={eachJob.companyLogoUrl}
                          alt="similar job company logo"
                          className="company-logo"
                        />
                        <div>
                          <h1 className="title">{eachJob.title}</h1>
                          <div className="rating-container">
                            <div className="rating-icon">
                              <AiFillStar />
                            </div>
                            <p className="rating-text">{eachJob.rating}</p>
                          </div>
                        </div>
                      </div>
                      <h1 className="description">Description</h1>
                      <p className="description-text">
                        {eachJob.jobDescription}
                      </p>
                      <div className="location-and-salary-container">
                        <div className="location-and-emp-type-container">
                          <div className="category-container">
                            <BiCurrentLocation className="category-icon" />
                            <p className="category-text">{eachJob.location}</p>
                          </div>
                          <div className="category-container">
                            <BsFillBriefcaseFill className="category-icon" />
                            <p className="category-text">
                              {eachJob.employmentType}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        }}
      </JobContext.Consumer>
    )
  }

  onClickRetryButton = () => {
    this.getJobDetails()
  }

  renderFailureView = () => (
    <div className="job-details-failure-view-background">
      <div className="job-details-failure-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="failure-view-image"
        />
        <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
        <p className="failure-view-description">
          We cannot seem to find the page you are looking for
        </p>
        <button
          type="button"
          className="retry-button"
          onClick={this.onClickRetryButton}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderInProgressView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-item-details-background">
        <Header />
        {this.renderJobDetails()}
      </div>
    )
  }
}

export default JobItemDetails
