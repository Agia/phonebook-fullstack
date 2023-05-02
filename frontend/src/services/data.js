import axios from 'axios'

const baseURL = '/api/persons'

const getData = () => {
    const request = axios.get(baseURL)
    return request.then(response => response.data)
}

const addData = async (newEntry) => {
    const request = axios.post(baseURL, newEntry)
    const response = await request
    return response.data
}


const deleteData = (id) => {
    const request = axios.delete(`${baseURL}/${id}`)
    return request.then(response => response.data)
}

const updateData = (id, changedNumber) => {
    const request = axios.put(`${baseURL}/${id}`, changedNumber)
    return request.then(response => response.data)
}

export { getData, addData, deleteData, updateData }