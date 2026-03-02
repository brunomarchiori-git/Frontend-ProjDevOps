import React from 'react';
import './EventCard.css';

const EventCard = ({ event, isPast, onClick, onEdit, onDelete }) => {
    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(event);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(event);
    };

    return (
        <article 
            className="event-card" 
            onClick={() => onClick(event)}
            tabIndex={0}
            role="button"
            aria-label={`Ver detalhes do evento ${event.title}`}
            onKeyPress={(e) => e.key === 'Enter' && onClick(event)}
        >
            <div className="event-card-image-container">
                <img 
                    src={event.image} 
                    alt={event.title} 
                    className="event-card-image"
                    loading="lazy"
                />
                <div className="event-card-actions">
                    <button 
                        className="event-card-action" 
                        onClick={handleEdit}
                        aria-label={`Editar evento ${event.title}`}
                        title="Editar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button 
                        className="event-card-action event-card-action-delete" 
                        onClick={handleDelete}
                        aria-label={`Excluir evento ${event.title}`}
                        title="Excluir"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div className="event-card-content">
                <div className="event-card-title-row">
                    <h3 className="event-card-title">{event.title}</h3>
                    {isPast && (
                        <span className="event-tag-past">
                            Evento realizado em {event.date ? event.date.substring(0, 5) : ''}
                        </span>
                    )}
                </div>
                <p className="event-card-location">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {event.location}
                </p>
                <p className="event-card-date">{event.date}</p>
            </div>
        </article>
    );
};

export default EventCard;
