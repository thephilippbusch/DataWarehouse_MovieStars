import { GraphQLClient, gql } from 'graphql-request'

const gqlClient = new GraphQLClient(`${process.env.REACT_APP_GRAPHQL_BASE_URL}/people`)

export const checkPersonExists = async (id) => {
    try {
        const mutation = gql`
            mutation {
                checkPerson(id: ${id}) {
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

export const addPerson = async (payload) => {
    try {
        const mutation = gql`
            mutation {
                addPerson(id: ${payload.id}, imdbId: "${payload.imdbId}", name: "${payload.name}", knownForDep: "${payload.knownForDep}", popularity: ${payload.popularity}, birthday: "${payload.birthday}", gender: ${payload.gender} ${payload.deathday ? (`, deathday: "${payload.deathday}"`) : ""}, popularMovies: [${payload.popularMovieIDs}] ${payload.imgPath ? (`, imgPath: "${payload.imgPath}"`) : ""}) {
                    person {
                        id
                        imdbId
                        name
                        knownForDep
                        popularity
                        birthday
                        gender
                        ${payload.deathday ? "deathday" : ""}
                        popularMovies
                        ${payload.imgPath ? "imgPath" : ""}
                    }
                }
            }      
        `;

        const response = await gqlClient.request(mutation);
        console.log(response)

        return response
    } catch(e) {
        console.error(e)
        return null
    }
}

export const deletePerson = async (id) => {
    try {
        const mutation = gql`
            mutation {
                deletePerson(id: ${id}) {
                    ok
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

export const getPeopleByKey = async (payload) => {
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
                    name,
                    knownForDep,
                    popularity,
                    gender,
                    birthday,
                    deathday,
                    popularMovies,
                    imgPath
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

export const updateMovieList = async (id, movies) => {
    try {
        const mutation = gql`
            mutation {
                updateMovieList(id: ${id}, popularMovies: [${movies}]) {
                    ok
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

export const getPeopleByDepartment = async (department) => {
    try {
        const query = gql`
            query {
                getPeople(knownForDep: "${department}") {
                    id,
                    name
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