import React from 'react';
import { Link } from 'react-router-dom';
import { personas } from '../data/personas';

export default function TablaPersonas() {
    return (
        <div>
            <h1>Listado de Personas</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                    </tr>
                </thead>
                <tbody>
                    {personas.map((p) => (
                        <tr key={p.id}>
                            <td>
                                <Link to={`/persona/${p.id}`}>{p.nombre}</Link>
                            </td>
                            <td>
                                <Link to={`/persona/${p.id}`}>{p.apellidos}</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
