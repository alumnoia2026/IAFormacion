import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TablaPersonas from './components/TablaPersonas';
import DetallePersona from './components/DetallePersonas';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TablaPersonas />} />
                <Route path="/persona/:id" element={<DetallePersona />} />
            </Routes>
        </Router>
    );
}
