import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function DetallePersona() {
    const { id } = useParams();

    // Aquí deberías tener tu lógica para obtener los datos de la persona usando el id
    // Ejemplo ficticio de objeto persona:
    const personas = [
    { id: 1, nombre: "Bob", apellidos: "Johnson", edad: 35, profesion: "cocinero" },
    { id: 2, nombre: "Donald", apellidos: "Jordan", edad: 27, profesion: "politico" },
    { id: 3, nombre: "Javier", apellidos: "Troncos", edad: 27, profesion: "leñador" }
];

    return (
        <div>
            <h2>Perfil de Usuario</h2>
            {/* El nombre ahora es un enlace que lleva a la ruta de la foto */}
            <p>Nombre: <Link to={`/persona/${id}/foto`}>{personas.find(p => p.id === parseInt(id))?.nombre}</Link></p>
            <p>Apellidos: {personas.find(p => p.id === parseInt(id))?.apellidos}</p>
            <p>Edad: {personas.find(p => p.id === parseInt(id))?.edad}</p>
            <p>Profesión: {personas.find(p => p.id === parseInt(id))?.profesion}</p>
            {/* Resto de tus detalles... */}
        </div>
    );
}