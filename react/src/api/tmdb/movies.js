import axios from 'axios';

export const getMovieDetails = async (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`)
        return response
    } catch(e) {
        console.error(e)
        return null
    }
}

export const getMovieExternalIDs = async (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=${process.env.REACT_APP_TMDB_API_KEY}`)
        return response
    } catch(e) {
        console.error(e)
        return null
    }
}