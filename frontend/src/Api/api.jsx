import axios from "axios";

const API = axios.create({
    baseURL: "https://boardly-social-media.onrender.com/",
    withCredentials: true,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Users
export const getDashboard = () => 
    API.get("/auth/home");

export const signUp = async(user) => {
  const res = await API.post("/auth/signup", user);
  if (res.data?.access_token) {
    localStorage.setItem("token", res.data.access_token);
  }
  return res;
};

export const logIn = async(user) => {
  const res = await API.post("/auth/login", user);
  console.log("Login response:", res.data);
  if (res.data?.access_token) {
    localStorage.setItem("token", res.data.access_token);
  }
  return res;
};

export const logOut = () => {
  localStorage.removeItem("token");
  return API.post("/auth/logout");
};

// Posts
export const getPins = () => 
    API.get("/pin/");

export const getPinByID = (id) =>
    API.get(`/pin/${id}`);

export const createPin = async(formData) => {
  return await API.post("/pin/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const suggestKeywords = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post("/pin/suggest_keywords", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updatePin = (id, pin) => {
  const formData = new FormData();
  if (pin.title) formData.append("title", pin.title);
  if (pin.description) formData.append("description", pin.description);
  if (pin.keywords) formData.append("keywords", JSON.stringify(pin.keywords));
  if (pin.image) formData.append("file", pin.image);

  return API.put(`/pin/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deletePin = (id) =>
    API.delete(`/pin/${id}`)

// Boards
export const getBoards = () =>
    API.get("/board/");

export const getBoardByID = (id) =>
    API.get(`/board/${id}`);

export const createBoard = (board) =>
    API.post("/board/", board);

export const updateBoard = (id, board) =>
    API.put(`/board/${id}`, board);

export const deleteBoard = (id) =>
    API.delete(`/board/${id}`);

// BoardPosts
export const addPostToBoard = (board_id, post_id) =>
    API.post(`/boards/${board_id}/posts/${post_id}`);

export const removePostFromBoard = (board_id, post_id) =>
    API.delete(`/boards/${board_id}/posts/${post_id}`);

// Likes
export const likePost = (post_id) =>
    API.post(`/posts/${post_id}/like`);

export const unlikePost = (post_id) =>
    API.delete(`/posts/${post_id}/like`);

// Follows
export const followUser = (following_id, follower_id) =>
    API.post(`/users/${following_id}/follow`, null, { params: { follower_id } });

export const unfollowUser = (following_id, follower_id) =>
    API.delete(`/users/${following_id}/follow`, { params: { follower_id } });

// Trending
export const getTrending = (limit) =>
    API.get("/trending/", { params: { limit } });