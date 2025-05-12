import cookie from 'react-cookies'
import axios from "axios"

const BASE_URL = 'http://127.0.0.1:8080/thesisManagementBackend/api/'

export const endpoints = {
    'login': '/login',
    'current-user' : '/secure/profile'
}

export const authApis = () => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${cookie.load("token")}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
})