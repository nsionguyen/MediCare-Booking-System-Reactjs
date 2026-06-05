import axios from "axios";
import cookie from 'react-cookies'

const BASE_URL = "http://localhost:8081/api/";

export const endpoints = {
    "login": "/login",
    "register": "/users",
    usersChat: (id) => `/usersChat/${id}`,
    "hospitals": "/hospitals",
    "specialties": "/specialties",
    "doctors-booking": "/doctors-booking",
    "doctorsSearch": "/doctors/search",

    "appointmentSchedulesHaveObj": "/appointmentSchedulesHaveObj",
    "appointmentSchedules": "/appointmentSchedules",
    'profile': '/secure/profile',
    "patients": '/secure/patients',
    "doctors": "/doctors",
    "doctorDetail": (id) => `/doctors/${id}`,
    "doctorReviews": (id) => `/doctors/${id}/reviews`,
    "patients-booking": (id) => `/secure/patients-booking/${id}`,
    "calendar": (id) => `appointments/calendar/${id}`,
    "appointmentSchedulesUser": (id) => `/secure/appointmentSchedulesUser/${id}`,
    "cancelAppointment": (id) => `/secure/appointments/${id}/cancel`,
    "payment": "/payment/creat-payment",
    "add-comment": "/reviews"




}

export const authApis = () => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${cookie.load('token')}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
})