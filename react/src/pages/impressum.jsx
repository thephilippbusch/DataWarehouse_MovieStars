import React from 'react'
import {
    Heading,
    Box,
    Text
} from 'grommet'

const Impressum = () => {


    return (
        <Box fill pad="large" >
            <Heading>Impressum</Heading>
            <Heading level="3">Angaben gemäß § 5 TMG</Heading>
            <Text>Philipp Busch</Text>
            <Text>Pankower Allee 90</Text>
            <Text>13409 Berlin</Text>
            <Heading level="3">Kontakt</Heading>
            <Text>philipp-leon-busch@gmail.com</Text>
            <Text>0176/22276907</Text>
        </Box>
    )
}

export default Impressum