import axios from 'axios';

// Dynamically use the IP address or localhost depending on how the user accesses the site
const currentHost = window.location.hostname;
const BASE_URL = `http://${currentHost}:8000/api`;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  // Characters
  getCharacters: () => apiClient.get('/characters'),
  getCharacter: (id) => apiClient.get(`/characters/${id}`),
  createCharacter: (data) => apiClient.post('/characters', data),
  updateCharacter: (id, data) => apiClient.put(`/characters/${id}`, data),
  deleteCharacter: (id) => apiClient.delete(`/characters/${id}`),

  // Chats
  getChats: () => apiClient.get('/chats'),
  getChat: (id) => apiClient.get(`/chats/${id}`),
  createChat: (data) => apiClient.post('/chats', data),
  deleteChat: (id) => apiClient.delete(`/chats/${id}`),
  
  // Messages
  sendMessage: (chatId, content) => apiClient.post(`/chats/${chatId}/messages`, { content }),

  // Settings
  getSettings: () => apiClient.get('/settings'),
  updateSettings: (data) => apiClient.put('/settings', data),
};
