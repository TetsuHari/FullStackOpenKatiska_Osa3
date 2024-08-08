import axios from 'axios'
const baseUrl = 'api/persons'

const extractData = response => response.data
const idUrl = (id) => `${baseUrl}/${id}`

const getAll = () => {
    return axios.get(baseUrl).then(extractData)
}

const create = newPerson => {
    return axios.post(baseUrl, newPerson).then(extractData)
}

const update = person => {
    return axios.put(idUrl(person.id), person).then(extractData)
}

const remove = id => {
    return axios.delete(idUrl(id)).then(extractData)
}

export default {
    getAll,
    create,
    update,
    remove
}