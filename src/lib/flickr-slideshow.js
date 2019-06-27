import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as Helpers from './helpers'

const FLOOR_TIME = '1072915200000' // 01/01/2004 @ 12:00am (UTC)
const SLIDESHOW_INTERVAL = 5000
const FLICKR_SEARCH_URI = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key={apiKey}&max_upload_date={randomTime}&sort=date-posted-desc&per_page=500&page=0&format=json&nojsoncallback=1'
const FLICKR_GET_SIZES_URI = 'https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key={apiKey}&photo_id={photoId}&format=json&nojsoncallback=1'

class FlickrSlideshow extends Component {

    static propTypes = {
        apiKey: PropTypes.string.isRequired,
        interval: PropTypes.number
    }

    static get defaultProps() {
        return {
            interval: SLIDESHOW_INTERVAL
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            counter:    0,
            photoUrl:   null,
            transition: null,
        }

        this._onErrorRetryCounter = 0
    }

    componentDidMount() {

        this._showRandomImage()

        this._slideshowInterval = setInterval(this._onSlideshowInterval, this.props.interval)
    }

    componentWillUnmount() {
        clearInterval(this._slideshowInterval)
    }

    _onSlideshowInterval = () => {
        this.setState({transition: true})
        this._showRandomImage()
    }

    _showRandomImage = async () => {
        try {
            const { apiKey } = this.props

            /*
             * Select a random Unix timestamp between now and 2004
             */
            const timeNow    = new Date().getTime()
            const randomTime = Helpers.randomNumber(FLOOR_TIME, timeNow)

            /*
             * Fetch latest 100 photos uploaded by `randomTime`
             */
            const searchRes  = await fetch(Helpers.supplantStr(FLICKR_SEARCH_URI, {randomTime, apiKey}))
            const searchJson = await searchRes.json()

            /*
             * Select a random item from the search results array
             */
            const searchResultsLen = searchJson.photos.photo.length
            const randomItemIndex = Helpers.randomNumber(0, searchResultsLen)
            const photoId = searchJson.photos.photo[randomItemIndex].id

            /*
             * Fetch the selected photo sizes 
             */
            const photoRes  = await fetch(Helpers.supplantStr(FLICKR_GET_SIZES_URI, {photoId, apiKey}))
            const photoJson = await photoRes.json()
            let photo = photoJson.sizes.size.find(p => p.label === 'Large')
            if (!photo) {
                /*
                 * If no 'Large' photo exists, just use the first item
                 */
                photo = photoJson.sizes.size[0]
            }

            /*
             * Update the component state with our result
             */
            this.setState({photoUrl: photo.source, transition: false})
            this._onErrorRetryCounter = 0
        } catch(error) {

            /*
             * In case of an error, let's try again
             */
            if (this._onErrorRetryCounter < 10) {
                this._onErrorRetryCounter++
                await this._showRandomImage()
            }
            else {
                console.error('Encountered an error fetching random image', error)
            }
        }
    }

    render() {
        const { transition, photoUrl } = this.state
        return (
            <div className={`FlickrSlideshow animated ${transition ? 'fadeOut' : 'fadeIn'}`} style={{
                backgroundImage: `url(${photoUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100%',
                width: '100%'
            }}>
            </div>
        )
    }
}

export default FlickrSlideshow
