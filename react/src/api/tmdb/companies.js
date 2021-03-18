import axios from 'axios';
import { TMDB_API_KEY, GRAPHQL_BASE_URL } from '../../config';
import { GraphQLClient, gql } from 'graphql-request';

export const searchCompanies = async (query, page) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/company?api_key=${TMDB_API_KEY}&query=${query}&page=${page}`);
        return response;
    } catch(e) {
        console.error(e)
        return null
    }
}

export const checkCompanyExists = async (id) => {
    try {
        const gqlClient = new GraphQLClient(`${GRAPHQL_BASE_URL}/check-companies`)

        const query = gql`
            {
                checkCompany(id: ${id})
            }
        `;

        const response = await gqlClient.request(query);

        return response;
    } catch(e) {
        console.error(e)
        return null
    }
}

export const addCompany = async (payload) => {
    const gqlClient = new GraphQLClient(`${GRAPHQL_BASE_URL}/companies`)

    const mutation = gql`
        mutation {
            addCompany(id: ${payload.id}, name: "${payload.name}") {
                company {
                    id
                    name
                }
            }
        }
    `;

    const response = await gqlClient.request(mutation);
    console.log(response)

    return response;
}