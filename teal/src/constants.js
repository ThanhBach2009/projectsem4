import axios from 'axios';
import moment from 'moment';

export const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        // 'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

export const GET = "get";
export const ADD = "add";
export const UPDATE = "update";
export const DELETE = "delete";
export const outOfficeHours = [1, 2, 3, 4, 5, 6, 7, 18, 19, 20, 21, 22, 23, 24];
export const DayOptions = [
    { value: '0', label: 'Sunday', shortLabel: 'sun' },
    { value: '1', label: 'Monday', shortLabel: 'mon' },
    { value: '2', label: 'Tuesday', shortLabel: 'tue' },
    { value: '3', label: 'Wednesday', shortLabel: 'wed' },
    { value: '4', label: 'Thursday', shortLabel: 'thur' },
    { value: '5', label: 'Friday', shortLabel: 'fri' },
    { value: '6', label: 'Saturday', shortLabel: 'sat' },
]



export const disabledHoursFromNow = () => {
    const hours = [];
    for (let i = 0; i < moment().hour(); i += 1) {
        if (!outOfficeHours.includes(i)) {
            hours.push(i);
        }
    }
    return hours;
};

export const disabledMinutesFromNow = (selectedHour) => {
    const minutes = [];
    if (selectedHour === moment().hour()) {
        for (let i = 0; i < moment().minute(); i += 1) minutes.push(i);
    }
    return minutes;
};

export const disabledHours = (hours) => {
    return hours;
}

export const disabledMinutes = (minutes) => {
    return minutes;
}

export const employeeRoles = [
    {
        value: 'NURSE',
        label: 'Nurse'
    },
    {
        value: 'LABORATORIST',
        label: 'Laboratorist'
    },
    {
        value: 'PHARMACIST',
        label: 'Pharmacist'
    },
    {
        value: 'ACCOUNTANT',
        label: 'Accountant'
    },
    {
        value: 'RECEPTIONIST',
        label: 'Receptionist'
    },
    {
        value: 'OTHER',
        label: 'Other'
    }
]

export const leave_type = [
    { value: 'cassual', label: 'Casual Leave' },
    { value: 'medical', label: 'Medical Leave' },
    { value: 'unpaid', label: 'Loss of Pay' },
]
export const leave_status = [
    { value: 'pending', label: 'Pending', color: "purple" },
    { value: 'approved', label: 'Approved', color: "green" },
    { value: 'rejected', label: 'Rejected', color: "red" }
]

export const appointment_status = [
    { value: 'pending', label: 'Pending', color: "purple", next_status: [{ value: 'approved', label: 'Approved', color: "green" }, { value: 'rejected', label: 'Rejected', color: "red" }] },
    { value: 'approved', label: 'Approved', color: "green", next_status: [{ value: 'canceled', label: 'Canceled', color: "yellow" }] },
    { value: 'rejected', label: 'Rejected', color: "red", next_status: [] },
    { value: 'canceled', label: 'Canceled', color: "yellow", next_status: [] },
]

export const ADMIN = "ROLE_ADMIN";
export const PATIENT = "ROLE_PATIENT";
export const RECEPTION = "ROLE_RECEPTION";
export const DOCTOR = "ROLE_DOCTOR";



