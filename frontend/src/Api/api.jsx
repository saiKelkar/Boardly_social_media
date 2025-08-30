import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

// Users
export const getDashboard = () => 
    API.get("/auth/home");

export const signUp = (user) => 
    API.post("/auth/signup", user);

export const logIn = (user) => 
    API.post("/auth/login", user);

export const logOut = () => 
    API.post("/auth/logout");

// Posts
export const getPins = () => 
    API.get("/pin/");

export const getPinByID = (id) =>
    API.get(`/pin/${id}`);

export const createPin = (pin) =>
    API.post("/pin/", pin);

export const updatePin = (id, pin) => 
    API.put(`/pin/${id}`, pin);

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