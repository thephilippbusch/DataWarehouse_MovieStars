import { GraphQLClient, gql } from 'graphql-request'

const gqlClient = new GraphQLClient(`${process.env.REACT_APP_GRAPHQL_BASE_URL}/movies`)

const stringify = (objectArray) => {
    let string = "["
    objectArray.map((obj, index) => {
        string += "{"
        let keys = Object.keys(obj)
        keys.map((key, index) => {
            string += key + ": "
            Number.isInteger(obj[key]) ? string += `${obj[key]}` : string += `"${obj[key]}"`
            keys.length-1 !== index && (string += ",")
        })
        objectArray.length - 1 !== index ? string += "}," : string += "}"
    })
    string += "]"
    return string
}

export const addMovie = async (payload) => {
    try {
        const mutation = gql`
            mutation {
                addMovie(id: ${payload.id}, imdbId: "${payload.imdbId}", title: "${payload.title}", budget: ${payload.budget}, revenue: ${payload.revenue}, runtime: ${payload.runtime}, voteAverage: ${payload.vote}, voteCount: ${payload.voteCount}, popularity: ${payload.popularity}, genres: ${stringify(payload.genres)}, productionCompanies: ${stringify(payload.productionCompanies)}, ${payload.twitter_id ? (`, twitterId: "${payload.twitter_id}"`) : ""}) {
                    movie {
                        id
                        title
                        imdbId
                        budget
                        revenue
                        popularity
                        genres {
                            id
                            name
                        }
                        voteCount
                        voteAverage
                        runtime
                        productionCompanies {
                            id
                            name
                        }
                        ${payload.imgPath ? "twitterId" : ""}
                    }
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

export const checkMovie = async (id) => {
    try {
        const mutation = gql`
            mutation {
                checkMovie(id: ${id}) {
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

export const getMoviesByKey = async (payload) => {
    try {
        let queryArgs = []
        if(payload.name) queryArgs.push(`name: "${payload.name}"`)
        if(payload.knownForDep) queryArgs.push(`knownForDep: "${payload.knownForDep}"`)
        if(payload.id) queryArgs.push(`id: ${payload.id}`)
        if(payload.imdbId) queryArgs.push(`imdbId: "${payload.imdbId}"`)

        const query = gql`
            query {
                getPeople(${queryArgs.join()}) {
                    id,
                    imdbId,
                    title,
                    budget,
                    revenue,
                    voteAverage,
                    voteCount,
                    runtime,
                    popularMovies,
                    imgPath,
                    twitterId,
                    twitterFollower
                }
            }
        `;

        const response = await gqlClient.request(query)
        return response
    } catch(e) {
        console.error(e)
        return null
    }
}