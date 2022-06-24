import axios from "axios";
const baseUrl = "api/notes/";

export const getAll = () => {
  try {
    return axios.get(baseUrl).then((res) => res.data);
  } catch (error) {
    console.log(error);
  }
};

export const create = (newObject) => {
  try {
    return axios.post(baseUrl, newObject).then((res) => res.data);
  } catch (error) {
    console.log(error);
  }
};

export const update = (id, newObject) => {
  try {
    return axios.put(`${baseUrl}/${id}`, newObject).then((res) => res.data);
  } catch (error) {
    console.log(error);
  }
};

export const remove = (id) => {
  try {
    return axios.delete(`${baseUrl}/${id}`).then((res) => res.data);
  } catch (error) {
    console.log(error);
  }
};
