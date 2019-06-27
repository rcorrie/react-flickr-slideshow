import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import renderer from 'react-test-renderer'
import FlickrSlideshow from './flickr-slideshow'
import * as Helpers from './helpers'
configure({ adapter: new Adapter() })

describe('Helpers', () => {

    describe('Method: supplantStr', () => {

        it('should properly interpolate a string with provided map', () => {
            const string = 'Lorem {a} dolor {b} amet {b} {c} {a}'
            const map = { a: 'ipsum', b: 'SET', c: 123 }
            const result = Helpers.supplantStr(string, map)
            const expectedResult = 'Lorem ipsum dolor SET amet SET 123 ipsum'
            expect(result).toEqual(expectedResult)
        })

        describe('onError', () => {

            it('should return provided string', () => {
                const string = 'Lorem {a} dolor {b} amet {b} {c} {a}'
                const map = null
                const result = Helpers.supplantStr(string, map)
                expect(result).toEqual(string)
            })

        })

    })

    describe('Method: randomNumber', () => {

        it('should return a random number between the range provided', () => {
            const min = 8
            const max = 9
            const result = Helpers.randomNumber(min, max)
            const expectedResult = result === 8 || result === 9
            expect(expectedResult).toBe(true)
        })

    })

})

describe('FlickrSlideshow Component', () => {

    /*
     * Set up our app constants
     */
    const DEFAULT_SLIDESHOW_INTERVAL = 5000
    const ERROR_MESSAGE_STRING = 'Encountered an error fetching random image'

    /*
     * Set up our mocks
     */
    const MOCK_FLICKR_IMG_SRC = 'MOCK_FLICKR_IMG_SRC'
    console.error = jest.fn()

    beforeEach(() => {
        /*
         * Reset timer mocks
         */
        jest.useFakeTimers()

        /*
         * Redeclare the fetch api mock
         */
        window.fetch = (url) => ({json: () => {
            if (url.includes('flickr.photos.search')) return {
                photos: { photo: [{id: 0}] }
            }
            if (url.includes('flickr.photos.getSizes')) return {
                sizes: { size: [{label: 'Large', source: MOCK_FLICKR_IMG_SRC} ] }
            }
        } })
        
        /*
         * Reset the console.error mock
         */
        console.error.mockReset()
    })

    it('Create snapshot', () => {
        const tree = renderer
        .create(<FlickrSlideshow />)
        .toJSON()
        expect(tree).toMatchSnapshot()
    })

    describe('constructor', () => {

        it('should declare the initial state', async () => {
            const wrapper = shallow(<FlickrSlideshow />)
            const { state } = wrapper.instance()
            expect(state.photoUrl).toEqual(null)
            expect(state.transition).toEqual(null)
        })

        it('should declare the _onErrorRetryCounter member variable as 0', async () => {
            const wrapper = shallow(<FlickrSlideshow />)
            const { _onErrorRetryCounter } = wrapper.instance()
            expect(_onErrorRetryCounter).toEqual(0)
        })

    })

    describe('Method: componentDidMount', () => {

        it('should invoke the _showRandomImage method', async (done) => {
            const wrapper = shallow(<FlickrSlideshow />)
            const instance = wrapper.instance()
            instance._showRandomImage= jest.fn()
            await instance.componentDidMount()
            expect(instance._showRandomImage).toHaveBeenCalled()
            done()
        })

        it('should declare the _slideshowInterval member variable as a setTimeout reference', async (done) => {
            const mockSetIntervalRef = 'mockSetIntervalRef ' + new Date().getTime()
            const wrapper = shallow(<FlickrSlideshow />)
            const instance = wrapper.instance()
            instance._slideshowInterval = null
            window.setInterval = () => mockSetIntervalRef
            await instance.componentDidMount()
            expect(instance._slideshowInterval).toEqual(mockSetIntervalRef)
            done()
        })

        describe('without the `interval` prop', () => {

            it('should invoke _onSlideshowInterval method at an interval of 5000ms', async (done) => {
                const mockOnSlideShowIntervalRef = 'mockOnSlideShowIntervalRef ' + new Date().getTime()
                const wrapper = shallow(<FlickrSlideshow />)
                const instance = wrapper.instance()
                instance._onSlideshowInterval = mockOnSlideShowIntervalRef
                window.setInterval = jest.fn()
                await instance.componentDidMount()
                expect(window.setInterval).toHaveBeenCalledWith(mockOnSlideShowIntervalRef, DEFAULT_SLIDESHOW_INTERVAL)
                done()
            })

        })

        describe('provided with an `interval` prop', () => {

            it('should invoke _onSlideshowInterval method at the interval provided', async (done) => {
                const mockOnSlideShowIntervalRef = 'mockOnSlideShowIntervalRef ' + new Date().getTime()
                const customInterval = parseInt(Math.random() * (10000- 5000) + 5000,0)
                const wrapper = shallow(<FlickrSlideshow interval={customInterval}/>)
                const instance = wrapper.instance()
                instance._onSlideshowInterval = mockOnSlideShowIntervalRef
                window.setInterval = jest.fn()
                await instance.componentDidMount()
                expect(window.setInterval).toHaveBeenCalledWith(mockOnSlideShowIntervalRef, customInterval)
                done()
            })

        })

    })

    describe('Method: componentWillUnmount', () => {

        it('should clear the setInterval reference defined in the _slideshowInterval member variable', async (done) => {
            const mockSetIntervalRef = 'mockSetIntervalRef ' + new Date().getTime()
            const wrapper = shallow(<FlickrSlideshow />)
            const instance = wrapper.instance()
            instance._slideshowInterval = mockSetIntervalRef
            window.clearInterval = jest.fn()
            await instance.componentWillUnmount()
            expect(window.clearInterval).toHaveBeenCalledWith(mockSetIntervalRef)
            done()
        })

    })

    describe('Method: _onSlideshowInterval', () => {

        it('should update the component with a truthy transition state', async (done) => {
            const wrapper = shallow(<FlickrSlideshow />)
            const instance = wrapper.instance()
            instance.setState = jest.fn()
            await instance._onSlideshowInterval()
            expect(instance.setState).toHaveBeenCalledWith({transition: true})
            done()
        })

        it('should invoke the _showRandomImage method', async (done) => {
            const wrapper = shallow(<FlickrSlideshow />)
            const instance = wrapper.instance()
            instance._showRandomImage = jest.fn()
            await instance._onSlideshowInterval()
            expect(instance._showRandomImage).toHaveBeenCalled()
            done()
        })

    })

    describe('Method: _showRandomImage', () => {

        it('should update the component state with an image url and a falsey transition state', async (done) => {
            const wrapper = shallow(<FlickrSlideshow />)
            const instance = wrapper.instance()
            instance.setState = jest.fn()
            await instance._showRandomImage()
            expect(instance.setState).toHaveBeenCalledWith({photoUrl: MOCK_FLICKR_IMG_SRC, transition: expect.anything()})
            done()
        })

        it('should update the component with a falsey transition state', async (done) => {
            const wrapper = shallow(<FlickrSlideshow />)
            const instance = wrapper.instance()
            instance.setState = jest.fn()
            await instance._showRandomImage()
            expect(instance.setState).toHaveBeenCalledWith({photoUrl: expect.anything(), transition: false})
            done()
        })

        it('should redeclare the _onErrorRetryCounter member variable as 0', async (done) => {
            const wrapper = shallow(<FlickrSlideshow />)
            const instance = wrapper.instance()
            instance._onErrorRetryCounter = 10
            expect(instance._onErrorRetryCounter).toEqual(10)
            await instance._showRandomImage()
            expect(instance._onErrorRetryCounter).toEqual(0)
            done()
        })

        describe('onError', () => {

            it('should retry a maximum of 10 times', async (done) => {
                window.fetch = () => Promise.reject()
                const wrapper = shallow(<FlickrSlideshow />)
                const instance = wrapper.instance()
                expect(instance._onErrorRetryCounter).toEqual(0)
                await instance._showRandomImage()
                expect(instance._onErrorRetryCounter).toEqual(10)
                done()
            })

            it('should console.error an error message', async (done) => {
                const mockErrorMessage = 'mockErrorMessage ' + new Date().getTime()
                window.fetch = () => Promise.reject(mockErrorMessage)
                const wrapper = shallow(<FlickrSlideshow />)
                const instance = wrapper.instance()
                await instance._showRandomImage()
                expect(console.error).toHaveBeenCalledWith(ERROR_MESSAGE_STRING, mockErrorMessage)
                done()
            })

        })

    })

})
