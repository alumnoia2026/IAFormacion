import React from "react";
import Clientes from "./components/Clientes";
import AtencionCliente from "./components/AtencionCliente";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header>
        <h1>Gestión de clientes</h1>
        <p>React + Node.js + Express + MySQL</p>
      </header>

      <main>
        <Clientes />

        <hr />

        <AtencionCliente />
      </main>
    </div>
  );
}

export default App;