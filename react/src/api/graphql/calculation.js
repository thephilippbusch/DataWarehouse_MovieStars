import { GraphQLClient, gql } from 'graphql-request';

const gqlClient = new GraphQLClient(`${process.env.REACT_APP_GRAPHQL_BASE_URL}/calculations`)

export const createCalculation = (payload) => {
    try {
        const mutation = gql`
            mutation {
                createCalculation(usedBudget: ${payload.used_budget}, creationDate: "${payload.creation_date}", acting: [${payload.acting}], directing: [${payload.directing}], companies: [${payload.companies}]) {
                    calculation {
                        usedBudget,
                        creationDate,
                        acting,
                        directing,
                        companies,
                        movies,
                        factor,
                        calculatedRevenue
                    }
                }
            }
        `;

        const response = gqlClient.request(mutation)
        return response
    } catch(e) {
        console.error(e)
        return null
    }
}