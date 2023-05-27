import axiosClient from "./axios.client";

const userApi = {
  signIn: (body) => {
    const url = "/Users/SignIn";
    return axiosClient.post(url, body);
  },
  signUp: (body) => {
    const url = "/Users/SignUp";
    return axiosClient.post(url, body);
  },
  getUserByUsername: (username) => {
    const url = `Users/username/${username}`;
    return axiosClient.get(url);
  },
  getUserById: (Id) => {
    const url = `Users/id/${Id}`;
    return axiosClient.get(url);
  },
  updateUserAccount: (id ,data) => {
    const url = `Users/${id}`
    return axiosClient.put(url, data)
  },
  getAllUsers: () => {
    const url = "/Users"
    return axiosClient.get(url)
  }
};

export default userApi;
