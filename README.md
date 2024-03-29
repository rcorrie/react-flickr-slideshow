# Flickr Slideshow

A react component slideshow of randomly selected Flickr photos.

## How it works

Flickr does not provide an api to query random images. As a workaround, this
module selects a random Unix timestamp between the current date and the year 
2004 (the year Flickr was founded).

Based on the randomly selected date, we query the most recent 500 images uploaded
to Flickr before said date.

Finally we randomly select one of the 500 results and voila, we have a random 
Flickr image.

## Running the demo

In order to run the demo, you need Node v8.9.4 or above.

```
git clone https://github.com/rcorrie/react-flickr-slideshow
cd react-flickr-slideshow
npm install
npm start
```

## Usage 

You can use this in your react app, just add this repo to your npm dependencies
and import it into your project like so:

```
import FlickrSlideshow from 'react-flickr-slideshow'

export function MyCustomApp() {
    return <FlickrSlideshow apiKey={'h432joju43io32hk234kj'} interval={10000} />
}
```

### Props

* `apiKey` Required - your [Flickr Api Key](https://www.flickr.com/services/api/misc.api_keys.html)
* `interval` Optional - the number of milliseconds between each image cycle. Default is 5000ms.

### Styling

_**Important:**_ The slideshow will fill it's parent component. If the parent
component has no width or height, the slideshow will not appear.

## Running tests

```
npm run test
```

## Todo

* Improve transitions
* Generate results ahead of time
