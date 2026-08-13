import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function FotoPersona() {
    const { id } = useParams();

    // Importamos dinámicamente la imagen desde la carpeta Gallery usando el ID de la persona
    // Nota: Asegúrate de que el nombre del archivo coincida con el ID (ej. 1.jpg, 2.png, etc.)
    const rutaFoto = require(`../Gallery/${id}.jpg`); 

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Foto de Perfil</h2>
            <img 
                src={rutaFoto} 
                alt={`Foto de la persona ${id}`} 
                style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }} 
            />
            <br /><br />
            <Link to={`/persona/${id}`}>Volver al perfil</Link>
        </div>
    );
}