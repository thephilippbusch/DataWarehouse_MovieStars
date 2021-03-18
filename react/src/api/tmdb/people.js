import axios from 'axios';
import { GraphQLClient, gql } from 'graphql-request'
import { TMDB_API_KEY, GRAPHQL_BASE_URL} from '../../config';

export const searchPeople = async (query, page) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${query}&page=${page}`)
        return response
    } catch(e) {
        console.error(e)
        return null
    }
}

export const getPersonDetails = async (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${TMDB_API_KEY}`)
        return response
    } catch(e) {
        console.error(e)
        return null
    }
}

export const checkPersonExists = async (id) => {
    try {
        const gqlClient = new GraphQLClient(`${GRAPHQL_BASE_URL}/check-people`)

        const query = gql`
            {
                checkPeople(id: ${id})
            }
        `;

        const response = await gqlClient.request(query);

        return response;
    } catch(e) {
        console.error(e)
        return null
    }
}

export const addPerson = async (payload) => {
    const gqlClient = new GraphQLClient(`${GRAPHQL_BASE_URL}/people`)

    const mutation = payload.deathday ? (
        gql`
            mutation {
                addPerson(id: ${payload.id}, imdbId: "${payload.imdbId}", name: "${payload.name}", knownForDep: "${payload.knownForDep}", popularity: ${payload.popularity}, birthday: "${payload.birthday}", deathday: "${payload.deathday}", popularMovies: [${payload.popularMovieIDs}]) {
                    person {
                        id
                        imdbId
                        name
                        knownForDep
                        popularity
                        birthday
                        deathday
                        popularMovies
                    }
                }
            }      
        `
    ) : (
        gql`
            mutation {
                addPerson(id: ${payload.id}, imdbId: "${payload.imdbId}", name: "${payload.name}", knownForDep: "${payload.knownForDep}", popularity: ${payload.popularity}, birthday: "${payload.birthday}", popularMovies: [${payload.popularMovieIDs}]) {
                    person {
                        id
                        imdbId
                        name
                        knownForDep
                        popularity
                        birthday
                        popularMovies
                    }
                }
            }      
        `
    )

    const response = await gqlClient.request(mutation);
    console.log(response)

    return response;
}