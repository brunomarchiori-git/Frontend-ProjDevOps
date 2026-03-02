import api from '../api/config';

const authService = {
  login: async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    return response.data;
  },

  register: async (nome, email, senha) => {
    const response = await api.post('/auth/cadastro', { nome, email, senha });
    return response.data;
  },
};

export default authService;
