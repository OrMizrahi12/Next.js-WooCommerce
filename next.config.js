const path = require('path')
const allowedImageEordPressDomain = new URL(process.env.NEXT_PUBLIC_WOEDPRESS_SITE_URL).hostname;
// A configuration file that return an object. 

module.exports = {
    // We tell to next js do not add a slash in the end of some url
	trailingSlash: false,

    // this function are controll on the time that the watchOptions are cheack for changes in the files
	webpackDevMiddleware: config => {
		config.watchOptions = {
			poll: 1000,
			aggregateTimeout: 300,
		}

		return config
	},
    // This is for saas compilation: 
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')]
	},
	images: {
		domains: [allowedImageEordPressDomain, 'via.placeholder.com']
	}
}