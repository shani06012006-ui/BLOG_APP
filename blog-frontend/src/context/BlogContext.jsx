import { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import useFetch from '../hooks/useFetch';

const API = 'https://blogapp-blog.up.railway.app';

export const BlogContext = createContext();

function blogReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, blogs: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_BLOG':
      return { ...state, blogs: [action.payload, ...state.blogs] };
    case 'UPDATE_BLOG':
      return {
        ...state,
        blogs: state.blogs.map((b) =>
          b.id === action.payload.id ? action.payload : b
        ),
      };
    case 'DELETE_BLOG':
      return {
        ...state,
        blogs: state.blogs.filter((b) => b.id !== action.payload),
      };
    default:
      return state;
  }
}

export function BlogProvider({ children }) {
  const [state, dispatch] = useReducer(blogReducer, {
    blogs: [],
    loading: false,
    error: null,
  });

  //  useFetch — GET all blogs (auto runs on load)
  const { data, loading, error } = useFetch(`${API}/blogs`, 'GET');

  useEffect(() => {
    if (loading) dispatch({ type: 'FETCH_START' });
    if (error)   dispatch({ type: 'FETCH_ERROR', payload: 'Failed to fetch blogs.' });
    if (data)    dispatch({ type: 'FETCH_SUCCESS', payload: data });
  }, [data, loading, error]);

  //  useFetch — POST new blog (execute called manually)
  const { execute: postBlog } = useFetch(`${API}/blogs`, 'POST');

  const createBlog = async (blogData) => {
    const newBlog = await postBlog(blogData);
    if (newBlog) dispatch({ type: 'ADD_BLOG', payload: newBlog });
  };

  //  axios for PUT/DELETE because URL changes dynamically (id based)
  const updateBlog = async (id, blogData) => {
    const res = await axios.put(`${API}/blogs/${id}`, blogData);
    dispatch({ type: 'UPDATE_BLOG', payload: res.data });
  };

  const deleteBlog = async (id) => {
    await axios.delete(`${API}/blogs/${id}`);
    dispatch({ type: 'DELETE_BLOG', payload: id });
  };

  return (
    <BlogContext.Provider value={{ ...state, createBlog, updateBlog, deleteBlog }}>
      {children}
    </BlogContext.Provider>
  );
}