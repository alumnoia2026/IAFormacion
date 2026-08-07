import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { personas } from '../data/personas';

export default function DetallePersona() {
    const { id } = useParams();
    const persona = personas.find((p) => p.id === parseInt(id));

    if (!persona) {
        return (
            <div>
                <h1>Persona no encontrada</h1>
                <Link to="/">Volver al listado</Link>
            </div>
        );
    }

    return (
        <div className="card">
            <h1>Información Personal</h1>
            <p><strong>Nombre:</strong> {persona.nombre}</p>
            <p><strong>Apellidos:</strong> {persona.apellidos}</p>
            <p><strong>Edad:</strong> {persona.edad}</p>
            <p><strong>Dirección:</strong> {persona.direccion}</p>
            <br />
            <Link to="/">Volver al listado</Link>
        </div>
    );
}
