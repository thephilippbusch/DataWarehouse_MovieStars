import axios from 'axios';

export const searchPeople = async (query, page) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/person?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${query}&page=${page}`)
        return response
    } catch(e) {
        console.error(e)
        return null
    }
}

export const getPersonDetails = async (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`)
        return response
    } catch(e) {
        console.error(e)
        return null
    }
}

export const getMovieCredits = async (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}`)
        return response
    } catch(e) {
        console.error(e)
        return null
    }
}