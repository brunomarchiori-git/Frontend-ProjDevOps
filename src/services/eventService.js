import api from '../api/config';

const eventService = {
  listar: async () => {
    const response = await api.get('/eventos');
    return response.data;
  },

  criar: async (eventoDTO) => {
    const response = await api.post('/eventos', eventoDTO);
    return response.data;
  },

  atualizar: async (id, eventoDTO) => {
    const response = await api.put(`/eventos/${id}`, eventoDTO);
    return response.data;
  },

  excluir: async (id) => {
    await api.delete(`/eventos/${id}`);
  },
};

export default eventService;
