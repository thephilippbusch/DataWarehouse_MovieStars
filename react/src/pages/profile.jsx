import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { 
    Heading,
    Box,
    RadioButtonGroup,
    Avatar,
    TextInput,
    Form,
    FormField,
    Text,
    Button,
    Layer
} from 'grommet'

import {
    Logout as LogoutIcon,
    Sun as SunIcon,
    Moon as MoonIcon,
    UserFemale as UserFemaleIcon,
    Trash as TrashIcon
} from 'grommet-icons'

const sampleUser = {
    email: "sample@user.com",
    name: "User",
    password: "1234"
}

const EditProfileInfo = () => {
    const [disabled, setDisabled] = useState(true)
    const user = sampleUser

    const [userData, setUserData] = useState(user)

    const handleSubmit = () => {
        console.log(userData)
        setDisabled(true)
    }

    return (
        <Box pad="medium" border="top" width="large">
            <Form 
                value={userData}
                onChange={(userChange) => {
                    setUserData(userChange)
                }}
                onReset={() => {
                    setUserData(user)
                    setDisabled(true)
                }}
                onSubmit={() => handleSubmit()}
            >
                <Box direction="row" justify="between" align="center">
                    <Text>Email:</Text>
                    <FormField name="email" htmlFor="email-input-id" width="medium">
                        <TextInput
                            type="email"
                            id="email-input-id"
                            name="email"
                            textAlign="end"
                            disabled={disabled}
                        />
                    </FormField>
                </Box>
                <Box direction="row" justify="between" align="center">
                    <Text>Name:</Text>
                    <FormField name="name" htmlFor="name-input-id" width="medium">
                        <TextInput
                            type="name"
                            id="name-input-id"
                            name="name"
                            textAlign="end"
                            disabled={disabled}
                        />
                    </FormField>
                </Box>
                <Box direction="row" justify="between" align="center">
                    <Text>Password:</Text>
                    <FormField name="password" htmlFor="password-input-id" width="medium" >
                        <TextInput 
                            type="password"
                            id="password-input-id"
                            name="password"
                            textAlign="end"
                            disabled={disabled}
                        />
                    </FormField>
                </Box>
                <Box width="100%" pad={{horizontal: "small"}}>
                    {disabled ? (
                        <Button label="Edit" fill={false} onClick={() => setDisabled(false)} alignSelf="end"/>
                    ) : (
                        <Box width="100%" direction="row" justify="end" gap="small" >
                            <Button primary label="Save" type="submit"/>
                            <Button secondary label="Cancel" type="reset"/>
                        </Box>
                    )}
                </Box>
            </Form>
        </Box>
    )
}

const EditAdditionalInfo = (props) => {
    const [theme, setTheme] = useState(props.currentTheme);
    const [showClearAlert, setShowClearAlert] = useState(false)

    useEffect(() => {
        localStorage.setItem(`theme`, theme);
        props.setGlobalTheme(theme);
    }, [theme, props])

    const handleClearHistory = () => {
        console.log('Successfully cleared history!')
        setShowClearAlert(false)
        alert('Successfully cleared history!')
    }

    return(
        <Box border="top" width="large" pad="medium" gap="small">
            <Box direction="row" justify="between" align="center">
                <Text>Theme:</Text>
                <RadioButtonGroup
                    name="themeRadio"
                    direction="row"
                    gap="xsmall"
                    options={['light', 'dark']}
                    value={theme}
                    onChange={event => setTheme(event.target.value)}
                >
                    {(option, { checked, hover }) => {
                        const Icon = option === 'light' ? SunIcon : MoonIcon;
                        let background;
                        if (checked) background = 'brand';
                        else if (hover) background = 'light-4';
                        else background = 'light-2';
                        return (
                            <Box background={background} pad="xsmall">
                                <Icon />
                            </Box>
                        )
                    }}
                </RadioButtonGroup>
            </Box>
            <Box direction="row" justify="between" align="center">
                <Text>Clear Search History:</Text>
                <Button
                    primary
                    reverse
                    label="Clear"
                    icon={<TrashIcon />}
                    onClick={() => setShowClearAlert(true)}

                />
                {showClearAlert && (
                    <Layer 
                        onEsc={() => setShowClearAlert(false)}
                        onClickOutside={() => setShowClearAlert(false)}
                    >
                        <Box pad="medium" width="medium" background="background-contrast" round="xsmall">
                            <Heading margin="none" level="3">Confirm</Heading>
                            <Text margin={{bottom: "medium"}}>Do you really want to clear your history?</Text>
                            <Box direction="row" justify="end" gap="small">
                                <Button secondary label="No" onClick={() => setShowClearAlert(false)}/>
                                <Button primary color="status-critical" label="Yes" onClick={() => handleClearHistory()}/>
                            </Box>
                        </Box>
                    </Layer>
                )}
            </Box>
        </Box>
    )
}

const Logout = (props) => {
    const history = props.history;
    const [showAlert, setShowAlert] = useState(false)

    const handleLogout = () => {
        console.log('Succesfully logged out!')
        alert('Succesfully logged out!')
        setShowAlert(false)
        history.push('/home')
    }

    return (
        <Box pad="medium" border="top" width="large" align="center">
            <Button
                primary
                reverse
                background="status-critical"
                label="Logout"
                icon={<LogoutIcon />}
                onClick={() => setShowAlert(true)}
            />
            {showAlert && (
                <Layer 
                    onEsc={() => setShowAlert(false)}
                    onClickOutside={() => setShowAlert(false)}
                >
                    <Box pad="medium" width="medium" background="background-contrast" round="xsmall">
                        <Heading margin="none" level="3">Confirm</Heading>
                        <Text margin={{bottom: "medium"}}>Do you really want to log out?</Text>
                        <Box direction="row" justify="end" gap="small">
                            <Button secondary label="No" onClick={() => setShowAlert(false)}/>
                            <Button primary color="status-critical" label="Yes" onClick={() => handleLogout()}/>
                        </Box>
                    </Box>
                </Layer>
            )}
        </Box>
    )
}

const Profile = (props) => {
    const history = useHistory()

    return(
        <Box background="background" width="100%" align="center" pad="medium">
            <Avatar background="background-back" size="xlarge">
                <UserFemaleIcon color="text" size="large"/>
            </Avatar>
            <Heading level="2" margin="medium">Profile</Heading>

            <EditProfileInfo />

            <EditAdditionalInfo currentTheme={props.currentTheme} setGlobalTheme={props.setGlobalTheme}/>

            <Logout history={history}/>
        </Box>
    )
}

export default Profile;