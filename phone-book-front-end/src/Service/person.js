import axios from "axios";

// const baseUrl = "/api/personshttp://localhost:3001";
// const baseUrl = 'https://shrouded-stream-60826.herokuapp.com/api/persons';
// herouku url after installing build  //https://git.heroku.com/shrouded-stream-60826.git
const baseUrl = '/api/persons'

// get rquest for all of json data
const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

// post request to add new entry
const create = newObject => {
  const request = axios.post(baseUrl, newObject);
  return request.then(response => response.data);
};

// const create = newObject => {
//   const request = axios.post(baseUrl, newObject);
//   return request.then(response => response.data).catch(error => {
//     console.log(error)
//   })
// };

// put request to update json db
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then(response => response.data);
};

// delete request to delete from json data base 
const remove = id => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then(response => response.data);
};


// exporting all of the functions 
export default {
  getAll: getAll,
  create: create,
  update: update,
  remove: remove
};
