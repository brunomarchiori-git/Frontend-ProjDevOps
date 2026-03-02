import React, { useState, useMemo, useEffect } from 'react';
import './HomeScreen.css';
import Header from '../../components/Header/Header';
import EventCard from '../../components/EventCard/EventCard';
import Modal from '../../components/Modal/Modal';
import BotaoCoral from '../../components/Botao/BotaoCoral';
import Alerta from '../../components/Alerta/Alerta';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import eventService from '../../services/eventService';

const HomeScreen = () => {
    const [events, setEvents] = useState([]);
    const [filters, setFilters] = useState({ location: '', date: '' });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [alerta, setAlerta] = useState({ show: false, message: '', type: 'success' });

    const [deleteModal, setDeleteModal] = useState({ show: false, event: null });

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        date: '',
        image: ''
    });

    const parseDateToISO = (dateStr) => {
        if (!dateStr) return '';
        if (dateStr.includes('-')) return dateStr;
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data = await eventService.listar();
            
            const parseDate = (dateStr) => {
                if (!dateStr) return new Date(0);
                const [day, month, year] = dateStr.split('/');
                return new Date(year, month - 1, day);
            };

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const mappedEvents = data.map(e => {
                const eventDate = parseDate(e.dataEvento);
                const isPast = eventDate < today;
                return {
                    id: e.id,
                    title: e.titulo,
                    location: e.localizacao,
                    date: e.dataEvento,
                    image: e.imagemUrl,
                    parsedDate: eventDate,
                    isPast: isPast
                };
            });

            const sortedEvents = mappedEvents.sort((a, b) => {
                if (a.isPast === b.isPast) {
                    if (a.isPast) { 
                       return b.parsedDate - a.parsedDate; // Passados: mais recente primeiro
                    } else {
                       return a.parsedDate - b.parsedDate; // Futuros: mais próximo primeiro
                    }
                }
                return (a.isPast ? 1 : -1); // Futuros antes de passados
            });

            setEvents(sortedEvents);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Falha ao carregar eventos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const normalizeText = (text) => {
        if (!text) return '';
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    };

    const formatDateForComparison = (isoDate) => {
        if (!isoDate) return '';
        const [year, month, day] = isoDate.split('-');
        return `${day}/${month}/${year}`;
    };

    const filteredEvents = useMemo(() => { // filtra somente quando mudado eventos ou filtros
        return events.filter(event => {
            const matchesLocation = !filters.location || 
                normalizeText(event.location).includes(normalizeText(filters.location));
            
            const filterDateFormatted = formatDateForComparison(filters.date);
            const matchesDate = !filters.date || event.date === filterDateFormatted;
            
            return matchesLocation && matchesDate;
        });
    }, [events, filters]);

    const handleSearch = ({ location, date }) => {
        setFilters({ location, date });
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsViewModalOpen(true);
    };

    const handleNewEvent = () => {
        setFormData({ title: '', location: '', date: '', image: '' });
        setIsEditMode(false);
        setIsCreateModalOpen(true);
    };

    const handleEdit = (event) => {
        setFormData({
            title: event.title,
            location: event.location,
            date: parseDateToISO(event.date),
            image: event.image
        });
        setSelectedEvent(event);
        setIsEditMode(true);
        setIsCreateModalOpen(true);
    };

    const handleDeleteClick = (event) => {
        setDeleteModal({ show: true, event });
    };
    const handleConfirmDelete = async () => {
        const eventToDelete = deleteModal.event;
        if (!eventToDelete) return;

        try {
            await eventService.excluir(eventToDelete.id);
            setEvents(events.filter(e => e.id !== eventToDelete.id));
            setAlerta({ show: true, message: 'Evento excluído com sucesso!', type: 'success' });
            setDeleteModal({ show: false, event: null });
        } catch (err) {
            console.error("Erro ao excluir:", err);
            setAlerta({ show: true, message: 'Erro ao excluir evento.', type: 'error' });
            setDeleteModal({ show: false, event: null });
        }
    };

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveEvent = async (e) => {
        e.preventDefault();
        
        try {
            if (isEditMode && selectedEvent) {
                const payload = {
                    dataEvento: formData.date,
                    localizacao: formData.location
                };

                await eventService.atualizar(selectedEvent.id, payload);
                await fetchEvents();
                setAlerta({ show: true, message: 'Evento atualizado com sucesso!', type: 'success' });
            } else {
                const payload = {
                    titulo: formData.title,
                    dataEvento: formData.date,
                    localizacao: formData.location,
                    imagemUrl: formData.image
                };

                await eventService.criar(payload);
                await fetchEvents();
                setAlerta({ show: true, message: 'Evento criado com sucesso!', type: 'success' });
            }
            setIsCreateModalOpen(false);
        } catch (err) {
            console.error(err);
            alert('Erro ao salvar evento: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="home-container">
            <Header onSearch={handleSearch} onNewEvent={handleNewEvent} />
            
            <main className="home-main">
                {loading && <p style={{textAlign: 'center', padding: '20px'}}>Carregando eventos...</p>}
                {error && <p style={{textAlign: 'center', color: 'red', padding: '20px'}}>{error}</p>}

                {!loading && !error && filteredEvents.length === 0 ? (
                    <div className="home-empty">
                        <p>Nenhum evento encontrado.</p>
                    </div>
                ) : (
                    <div className="events-grid">
                        {filteredEvents.map(event => (
                            <EventCard
                                key={event.id}
                                event={event} 
                                isPast={event.isPast}
                                onClick={handleEventClick}
                                onEdit={handleEdit}
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </div>
                )}
            </main>

            <Modal 
                isOpen={isViewModalOpen} 
                onClose={() => setIsViewModalOpen(false)}
                variant="showcase"
            >
                {selectedEvent && (
                    <div className="event-showcase" role="article" aria-label={`Detalhes do evento: ${selectedEvent.title}`}>
                        <div className="event-showcase-image-container">
                            <img 
                                src={selectedEvent.image} 
                                alt={selectedEvent.title}
                                className="event-showcase-image"
                            />
                            <div className="event-showcase-overlay">
                                <h2 id="modal-title" className="event-showcase-title">{selectedEvent.title}</h2>
                                <div className="event-showcase-info">
                                    <div className="event-showcase-info-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg>
                                        <span>{selectedEvent.date}</span>
                                    </div>
                                    <div className="event-showcase-info-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        <span>{selectedEvent.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)}
                title={isEditMode ? 'Editar Evento' : 'Novo Evento'}
            >
                <form className="event-form" onSubmit={handleSaveEvent}>
                    <div className="form-group">
                        <label htmlFor="event-title">Nome do Evento *</label>
                        <input
                            type="text"
                            id="event-title"
                            className="form-input"
                            value={formData.title}
                            onChange={(e) => handleFormChange('title', e.target.value)}
                            required
                            placeholder="Ex: Festival de Música"
                            disabled={isEditMode}
                            aria-describedby={isEditMode ? "title-hint" : undefined}
                        />
                        {isEditMode && (
                            <span id="title-hint" className="form-hint">
                                O título não pode ser alterado
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="event-location">Localização *</label>
                        <input
                            type="text"
                            id="event-location"
                            className="form-input"
                            value={formData.location}
                            onChange={(e) => handleFormChange('location', e.target.value)}
                            required
                            placeholder="Ex: São Paulo, Centro"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="event-date">Data *</label>
                        <input
                            type="date"
                            id="event-date"
                            className="form-input"
                            value={formData.date}
                            onChange={(e) => handleFormChange('date', e.target.value)}
                            required
                        />
                    </div>

                    {!isEditMode && (
                        <div className="form-group">
                            <label htmlFor="event-image">URL da Imagem</label>
                            <input
                                type="url"
                                id="event-image"
                                className="form-input"
                                value={formData.image}
                                onChange={(e) => handleFormChange('image', e.target.value)}
                                placeholder="https://exemplo.com/imagem.jpg"
                            />
                        </div>
                    )}

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="form-cancel"
                            onClick={() => setIsCreateModalOpen(false)}
                        >
                            Cancelar
                        </button>
                        <BotaoCoral text={isEditMode ? 'Salvar Alterações' : 'Criar Evento'} type="submit" />
                    </div>
                </form>
            </Modal>

            <Alerta 
                show={alerta.show}
                message={alerta.message}
                type={alerta.type}
                onClose={() => setAlerta(prev => ({ ...prev, show: false }))}
            />

            <ConfirmModal 
                isOpen={deleteModal.show}
                title="Confirmar exclusão"
                message={`Você tem certeza que gostaria de excluir "${deleteModal.event?.title}"?`}
                confirmText="Sim, excluir"
                cancelText="Cancelar"
                onClose={() => setDeleteModal({ show: false, event: null })}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default HomeScreen;


