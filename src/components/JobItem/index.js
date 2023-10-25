import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {BiCurrentLocation} from 'react-icons/bi'
import {BsFillBriefcaseFill} from 'react-icons/bs'

import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const updatedJobDetails = {
    companyLogoUrl: jobDetails.company_logo_url,
    employmentType: jobDetails.employment_type,
    jobId: jobDetails.id,
    jobDescription: jobDetails.job_description,
    location: jobDetails.location,
    packagePerAnnum: jobDetails.package_per_annum,
    rating: jobDetails.rating,
    title: jobDetails.title,
  }
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    jobId,
  } = updatedJobDetails

  return (
    <Link to={`/jobs/${jobId}`} className="job-item-link">
      <li className="job-item-background">
        <div className="title-and-logo-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h1 className="title">{title}</h1>
            <div className="rating-container">
              <div className="rating-icon">
                <AiFillStar />
              </div>
              <p className="rating-text">{rating}</p>
            </div>
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
          <h1 className="salary-text">{packagePerAnnum}</h1>
        </div>
        <hr className="separator" />
        <h2 className="description">Description</h2>
        <p className="description-text">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
