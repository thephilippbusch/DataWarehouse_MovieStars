import axios from 'axios';

export const searchCompanies = async (query, page) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/company?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${query}&page=${page}`)
        return response
    } catch(e) {
        console.error(e)
        return null
    }
}