import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/users/register`, userData);
};

export const getUserById = async (id) => {
  return await axios.get(`${API_URL}/users/${id}`);
};

export const addCrop = async (cropData) => {
  return await axios.post(`${API_URL}/crops`, cropData);
};

export const getAllCrops = async () => {
  return await axios.get(`${API_URL}/crops`);
};
