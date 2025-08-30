// Users
export const UserCreate = {
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: ""
};

export const UserLogin = {
    email: "",
    password: ""
};

export const UserResponse = {
    id: null,
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    bio: null,
    profile_image_url: null,
    created_at: null
};

// Posts
export const PostCreate = {
    title: "",
    description: null,
    image_url: "",
    keywords: []
};

export const PostUpdate = {
    title: null,
    description: null,
    image_url: null,
    keywords: null
};

export const PostResponse = {
    id: null,
    created_at: null,
    user_id: null
};

// Boards
export const BoardCreate = {
    name: "",
    description: null
};

export const BoardUpdate = {
    name: null,
    description: null
};

export const BoardResponse = {
    id: null,
    user_id: null,
    created_at: null
};

// BoardPosts
export const BoardPostResponse = {
    id: null,
    board_id: null,
    post_id: null,
    added_at: null
};

// Likes
export const LikeResponse = {
    id: null,
    user_id: null,
    post_id: null,
    created_at: null
};

// Follows
export const FollowResponse = {
    id: null,
    follower_id: null,
    following_id: null,
    created_at: null   
};
    
// Trending
export const TrendingResponse = {
    id: null,
    post_id: null,
    like_count: null,
    view_count: null,
    save_count: null,
    last_updated: null
};