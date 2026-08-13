import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TablaPersonas from './components/TablaPersonas';
import DetallePersona from './components/DetallePersonas';
import FotoPersona from './components/FotoPersona'; // Nueva importación

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TablaPersonas />} />
                <Route path="/persona/:id" element={<DetallePersona />} />
                <Route path="/persona/:id/foto" element={<FotoPersona />} /> {/* Nueva ruta */}
            </Routes>
        </Router>
    );
}