import { GraphQLClient, gql } from 'graphql-request';

const gqlClient = new GraphQLClient(`${process.env.REACT_APP_GRAPHQL_BASE_URL}/companies`)

export const checkCompanyExists = async (id) => {
    try {
        const mutation = gql`
            mutation {
                checkCompany(id: ${id}) {
                    doesExist
                }
            }
        `;

        const response = await gqlClient.request(mutation)
        return response
    } catch(e) {
        console.error(e)
        return null
    }
}

export const addCompany = async (payload) => {
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

    const response = await gqlClient.request(mutation)
    return response
}

export const removeCompany = async (id) => {
    const mutation = gql`
        mutation {
            deleteCompany(id: ${id}) {
                ok
            }
        }
    `;

    const response = await gqlClient.request(mutation)
    return response
}

export const getCompanies = async () => {
    try {
        const query = gql`
            query {
                getCompanies {
                    name
                    id
                }
            }
        `;

        const response = gqlClient.request(query)
        return response
    } catch(e) {
        console.error(e)
        return null
    }
}