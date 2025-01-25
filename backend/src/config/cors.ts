import { CorsOptions } from 'cors'

const URL_front = process.env.FRONTEND_URL

export const corsConfig : CorsOptions = {
    origin: function(origin, callback) {

        const whiteList = [URL_front]

        if(process.argv[2] === '--api') {
            whiteList.push(undefined)
        }

        if (whiteList.includes(origin)) {
            callback(null, true) 
        } else {
            callback( new Error('Error de cors'))
        }
    }
}