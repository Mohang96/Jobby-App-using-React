import Header from '../Header'
import JobItem from '../JobItem'

import JobContext from '../../context/JobContext'

import './index.css'

const Bookmark = () => (
  <JobContext.Consumer>
    {value => {
      const {bookmarkList, emptyBookmarkList} = value
      const showBookmarkedItems = bookmarkList.length === 0

      if (showBookmarkedItems) {
        return (
          <div className="bookmark-background-container">
            <Header />
            <div className="bookmark-empty-view-background">
              <h1 className="bookmark-empty-view-msg">
                There are No Bookmark Items to show. Please Add anything...
              </h1>
            </div>
          </div>
        )
      }

      const clearAllBookmarks = () => {
        emptyBookmarkList()
      }

      return (
        <div className="bookmark-background-container">
          <Header />
          <div className="bookmark-items-container">
            <div className="clear-btn-container">
              <button
                type="button"
                onClick={clearAllBookmarks}
                className="clear-button"
              >
                Clear All Bookmarks
              </button>
            </div>

            <ul className="bookmark-list">
              {bookmarkList.map(eachBookmarkItem => (
                <JobItem
                  key={eachBookmarkItem.jobId}
                  jobDetails={eachBookmarkItem}
                />
              ))}
            </ul>
          </div>
        </div>
      )
    }}
  </JobContext.Consumer>
)

export default Bookmark
