import React from 'react'
import { render } from 'react-dom'
import FlickrSlideshow from './lib'

const demoApiKey = 'fef7e85a4fbb15aa1b742d37657d70c3'

const App = () => (
    <FlickrSlideshow apiKey={demoApiKey} />
)

render(<App />, document.getElementById('root'))
