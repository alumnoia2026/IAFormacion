import React, { useEffect, useState } from "react";
import Clientes from "./components/Clientes";
import AtencionCliente from "./components/AtencionCliente";
import "./App.css";

const paginas = ["Inicio", "Productos", "Contacto", "Administración"];

const productos = [
  { categoria: "Electrodomésticos", imagen: "frigo-nube-400.webp", marca: "Nubelia", modelo: "Frigo Nube 400", precio: 799, descuento: 15, especificaciones: ["400 L · No Frost", "Motor silencioso", "Clase energética C"] },
  { categoria: "Electrodomésticos", imagen: "lavadora-brisa-9.webp", marca: "CasaVolta", modelo: "Lavadora Brisa 9", precio: 429, descuento: 20, especificaciones: ["9 kg · 1.400 rpm", "Vapor inteligente", "Clase energética A"] },
  { categoria: "Electrodomésticos", imagen: "air-fry-65.webp", marca: "Chispa", modelo: "Air Fry 6.5", precio: 89, descuento: 15, especificaciones: ["Capacidad de 6,5 L", "8 programas", "Cesta antiadherente"] },
  { categoria: "Móviles", imagen: "lumina-nova-x5.webp", marca: "Lúmina", modelo: "Nova X5", precio: 389, descuento: 12, especificaciones: ["Pantalla OLED de 6,6”", "256 GB · 5G", "Cámara triple de 50 MP"] },
  { categoria: "Móviles", imagen: "bravik-mini-orbit.webp", marca: "Bravik", modelo: "Mini Orbit", precio: 249, descuento: 18, especificaciones: ["Pantalla de 6,1”", "128 GB · 5G", "Batería de 4.800 mAh"] },
  { categoria: "Móviles", imagen: "nebora-folio-flip.webp", marca: "Nébora", modelo: "Folio Flip", precio: 699, descuento: 10, especificaciones: ["Plegable AMOLED", "256 GB · 5G", "Cámara dual de 48 MP"] },
  { categoria: "Ordenadores", imagen: "bytebuho-air-14-pro.webp", marca: "ByteBúho", modelo: "Aire 14 Pro", precio: 899, descuento: 15, especificaciones: ["Intel Core i7 · 16 GB RAM", "SSD de 1 TB", "Pantalla IPS de 14”"] },
  { categoria: "Ordenadores", imagen: "pixelnorte-atlas-g.webp", marca: "PixelNorte", modelo: "Torre Atlas G", precio: 1199, descuento: 12, especificaciones: ["Ryzen 7 · 32 GB RAM", "SSD de 1 TB", "Gráfica dedicada 12 GB"] },
  { categoria: "Ordenadores", imagen: "bytebuho-estudio-16.webp", marca: "ByteBúho", modelo: "Estudio 16", precio: 1049, descuento: 14, especificaciones: ["Intel Core Ultra 7", "16 GB RAM · SSD 1 TB", "Pantalla QHD de 16”"] },
];

const formatoPrecio = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const precioRebajado = (producto) => Math.round(producto.precio * (1 - producto.descuento / 100));

function TarjetaProducto({ producto, compacta = false, onAdd }) {
  return (
    <article className={`product-card sale-product-card${compacta ? " compact" : ""}`}>
      <div className="product-image-wrap">
        <img className="product-photo" src={`/images/productos/${producto.imagen}`} alt={`${producto.categoria}: ${producto.marca} ${producto.modelo}`} loading="lazy" />
        <span className="discount-badge">-{producto.descuento}%</span>
      </div>
      <p className="product-category">{producto.categoria}</p>
      <p className="product-brand">{producto.marca}</p>
      <h3>{producto.modelo}</h3>
      {!compacta && <ul>{producto.especificaciones.map((spec) => <li key={spec}>{spec}</li>)}</ul>}
      <div className="sale-prices"><del>{formatoPrecio.format(producto.precio)}</del><strong>{formatoPrecio.format(precioRebajado(producto))}</strong></div>
      <button className="add-cart-button" type="button" onClick={() => onAdd(producto)}><span>＋</span> Añadir al carrito</button>
    </article>
  );
}

function App() {
  const [pagina, setPagina] = useState(() => window.location.hash.slice(1) || "Inicio");
  const [carrito, setCarrito] = useState({});
  const [estadoCarrito, setEstadoCarrito] = useState("carrito");
  const [referenciaPedido, setReferenciaPedido] = useState("");

  useEffect(() => {
    const sincronizar = () => setPagina(decodeURIComponent(window.location.hash.slice(1)) || "Inicio");
    window.addEventListener("hashchange", sincronizar);
    return () => window.removeEventListener("hashchange", sincronizar);
  }, []);

  const seccionValida = paginas.includes(pagina) || pagina === "Carrito" ? pagina : "Inicio";
  const articulosCarrito = productos.filter((producto) => carrito[producto.modelo]);
  const cantidadCarrito = articulosCarrito.reduce((total, producto) => total + carrito[producto.modelo], 0);
  const totalCarrito = articulosCarrito.reduce((total, producto) => total + precioRebajado(producto) * carrito[producto.modelo], 0);

  const agregarAlCarrito = (producto) => {
    setCarrito((actual) => ({ ...actual, [producto.modelo]: (actual[producto.modelo] || 0) + 1 }));
    setEstadoCarrito("carrito");
  };

  const cambiarCantidad = (modelo, cambio) => {
    setCarrito((actual) => {
      const nuevaCantidad = (actual[modelo] || 0) + cambio;
      if (nuevaCantidad <= 0) {
        const siguiente = { ...actual };
        delete siguiente[modelo];
        return siguiente;
      }
      return { ...actual, [modelo]: nuevaCantidad };
    });
  };

  const confirmarPedido = (evento) => {
    evento.preventDefault();
    setReferenciaPedido(`TM-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
    setCarrito({});
    setEstadoCarrito("confirmado");
    evento.currentTarget.reset();
  };

  return (
    <div className="app">
      <header className="store-banner">
        <div className="banner-copy">
          <a className="brand-mark" href="#Inicio" aria-label="TonyMarkt, inicio">TM</a>
          <p className="banner-eyebrow">TECNOLOGÍA PARA TODOS (CASI)</p>
          <h1>TONY<span>MARKT</span></h1>
          <p className="banner-slogan">¡Si compras, eres tonto!</p>
        </div>
        <img className="banner-photo" src="/images/tonymarkt-banner.webp" alt="Selección de electrodomésticos y tecnología" />
        <div className="banner-footer"><span>Electrónica · Informática · Hogar</span><span>La tienda de las decisiones impulsivas <b>✳</b></span></div>
      </header>

      <nav className="main-nav" aria-label="Navegación principal">
        {paginas.map((nombre, index) => (
          <a key={nombre} href={`#${nombre}`} className={seccionValida === nombre ? "active" : ""} aria-current={seccionValida === nombre ? "page" : undefined}>
            <span className="nav-index">0{index + 1}</span>{nombre}
          </a>
        ))}
        <a href="#Carrito" className={`cart-nav${seccionValida === "Carrito" ? " active" : ""}`} aria-current={seccionValida === "Carrito" ? "page" : undefined}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 1.9-1.4L22 8H6"/><circle cx="10" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/></svg>
          Carrito <span className="cart-count">{cantidadCarrito}</span>
        </a>
      </nav>

      <main className={seccionValida === "Administración" ? "admin-page" : seccionValida === "Contacto" ? "contact-page-wrap" : seccionValida === "Productos" ? "products-page" : seccionValida === "Carrito" ? "cart-page" : "sale-home-page"}>
        {seccionValida === "Inicio" && <section className="sale-home">
          <div className="sale-hero">
            <div className="sale-hero-copy">
              <span className="sale-eyebrow"><i /> HAN LLEGADO LAS REBAJAS</span>
              <h2>¡Rebajas a lo<br /><em>TONYMARKT!</em></h2>
              <p>Tus favoritos de tecnología y hogar, ahora con precios que sí dan gusto.</p>
              <a className="sale-cta" href="#Productos">Ver todas las ofertas <span>↗</span></a>
            </div>
            <div className="sale-hero-stamp" aria-label="Hasta un 20 por ciento de descuento"><small>HASTA</small><strong>20<sup>%</sup></strong><small>MENOS</small></div>
            <div className="sale-hero-orbit orbit-one" /><div className="sale-hero-orbit orbit-two" />
            <span className="sale-hero-note">TECNOLOGÍA · HOGAR · CAPRICHOS</span>
          </div>
          <div className="sale-section-heading">
            <div><p className="section-kicker">OFERTAS POR TIEMPO LIMITADO</p><h2>El capricho ahora cuesta menos</h2></div>
            <a href="#Productos">Ver los 9 productos <span>→</span></a>
          </div>
          <div className="product-grid sale-home-grid">
            {productos.map((producto) => <TarjetaProducto key={producto.modelo} producto={producto} compacta onAdd={agregarAlCarrito} />)}
          </div>
        </section>}
        {seccionValida === "Administración" && <>
          <div className="admin-intro">
            <div><p className="section-kicker">ZONA PRIVADA · TON YMARKT</p><h2>Panel de administración</h2>
              <p>Clientes, consultas y asistencia, todo bajo control.</p></div>
            <span className="admin-badge"><span/> SISTEMA ACTIVO</span>
          </div>
          <div className="admin-grid"><div className="admin-card customers-card"><Clientes /></div><div className="admin-card support-card"><AtencionCliente /></div></div>
        </>}
        {seccionValida === "Productos" && <section className="products-content">
          <div className="products-heading">
            <div><p className="section-kicker">TECNOLOGÍA CON NOMBRE INVENTADO</p><h2>Productos para cada capricho</h2></div>
            <p>Electrodomésticos, móviles y ordenadores.<br />Nueve excusas para actualizarte.</p>
          </div>
          <div className="product-grid">
            {productos.map((producto) => <TarjetaProducto key={producto.modelo} producto={producto} onAdd={agregarAlCarrito} />)}
          </div>
        </section>}
        {seccionValida === "Carrito" && <section className="cart-content">
          {estadoCarrito === "confirmado" ? <div className="order-success">
            <div className="success-check" aria-hidden="true">✓</div><p className="section-kicker">SIMULACIÓN DE COMPRA COMPLETADA</p><h2>¡Pedido tramitado!</h2>
            <p>Tu pedido de demostración se ha registrado correctamente. No se ha realizado ningún cobro.</p>
            <div className="order-reference"><span>Código de referencia</span><strong>{referenciaPedido}</strong></div>
            <a className="checkout-primary" href="#Inicio">Volver a la tienda</a>
          </div> : <>
            <div className="cart-heading"><div><p className="section-kicker">TONYMARKT · TU COMPRA</p><h2>{estadoCarrito === "checkout" ? "Tramitar pedido" : "Tu carrito"}</h2></div>
              {estadoCarrito === "checkout" ? <button className="checkout-back" type="button" onClick={() => setEstadoCarrito("carrito")}>← Volver al carrito</button> : <a href="#Productos">Seguir comprando <span>→</span></a>}
            </div>
            {estadoCarrito === "checkout" ? <div className="checkout-layout">
              <form className="checkout-form" onSubmit={confirmarPedido} autoComplete="off">
                <div className="demo-notice"><strong>Modo demostración</strong><span>No introduzcas datos reales. Los datos de tarjeta no se envían ni se guardan.</span></div>
                <fieldset><legend>Datos de pago ficticios</legend>
                  <label>Nombre del titular<input name="titular" type="text" autoComplete="off" required placeholder="Nombre que aparece en la tarjeta" /></label>
                  <label>Número de tarjeta<input name="tarjeta" type="text" inputMode="numeric" autoComplete="off" required minLength="13" maxLength="23" pattern="[0-9 ]{13,23}" placeholder="0000 0000 0000 0000" /></label>
                  <div className="checkout-fields-row"><label>Caducidad<input name="caducidad" type="text" autoComplete="off" required placeholder="MM/AA" pattern="(0[1-9]|1[0-2])/[0-9]{2}" /></label><label>CVV<input name="cvv" type="password" inputMode="numeric" autoComplete="off" required minLength="3" maxLength="4" pattern="[0-9]{3,4}" placeholder="•••" /></label></div>
                </fieldset>
                <fieldset><legend>Dirección de facturación</legend>
                  <label>Dirección<input name="direccion" type="text" autoComplete="off" required placeholder="Calle y número" /></label>
                  <div className="checkout-fields-row"><label>Ciudad<input name="ciudad" type="text" autoComplete="off" required /></label><label>Código postal<input name="cp" type="text" inputMode="numeric" autoComplete="off" required /></label></div>
                  <label>Provincia<input name="provincia" type="text" autoComplete="off" required /></label>
                </fieldset>
                <button className="checkout-primary" type="submit">Confirmar pedido de prueba</button>
              </form>
              <aside className="cart-summary"><h3>Resumen del pedido</h3>
                {articulosCarrito.map((producto) => <div className="summary-item" key={producto.modelo}><span>{producto.modelo} × {carrito[producto.modelo]}</span><strong>{formatoPrecio.format(precioRebajado(producto) * carrito[producto.modelo])}</strong></div>)}
                <div className="summary-total"><span>Total (precios rebajados)</span><strong>{formatoPrecio.format(totalCarrito)}</strong></div>
                <p>Esta demostración no realiza pagos ni envía pedidos reales.</p>
              </aside>
            </div> : articulosCarrito.length === 0 ? <div className="cart-empty"><span aria-hidden="true">🛒</span><h3>Tu carrito está esperando</h3><p>Añade algún producto y aquí aparecerá tu resumen.</p><a className="checkout-primary" href="#Productos">Explorar productos</a></div> : <div className="cart-layout">
              <div className="cart-items">{articulosCarrito.map((producto) => <article className="cart-item" key={producto.modelo}>
                <img src={`/images/productos/${producto.imagen}`} alt={`${producto.marca} ${producto.modelo}`} /><div className="cart-item-info"><p>{producto.categoria} · -{producto.descuento}%</p><h3>{producto.marca} {producto.modelo}</h3><strong>{formatoPrecio.format(precioRebajado(producto))}</strong></div>
                <div className="quantity-control" aria-label={`Cantidad de ${producto.modelo}`}><button type="button" onClick={() => cambiarCantidad(producto.modelo, -1)} aria-label="Restar una unidad">−</button><span>{carrito[producto.modelo]}</span><button type="button" onClick={() => cambiarCantidad(producto.modelo, 1)} aria-label="Añadir una unidad">+</button></div>
                <button className="remove-item" type="button" onClick={() => cambiarCantidad(producto.modelo, -carrito[producto.modelo])}>Quitar</button>
              </article>)}</div>
              <aside className="cart-summary"><h3>Resumen del pedido</h3>
                <div className="summary-item"><span>Productos ({cantidadCarrito})</span><strong>{formatoPrecio.format(totalCarrito)}</strong></div>
                <div className="summary-item"><span>Envío</span><strong>Gratis</strong></div>
                <div className="summary-total"><span>Total</span><strong>{formatoPrecio.format(totalCarrito)}</strong></div>
                <button className="checkout-primary" type="button" onClick={() => setEstadoCarrito("checkout")}>Tramitar pedido <span>→</span></button>
                <p>Compra de demostración. No se realizará ningún cargo.</p>
              </aside>
            </div>}
          </>}
        </section>}
        {seccionValida === "Contacto" && <section className="contact-page">
          <div className="contact-info">
            <p className="section-kicker">TONYMARKT · CANILES</p>
            <h2>¿Quiénes somos?</h2>
            <p>Somos una tienda de Caniles apasionada por la tecnología y por hacer más fácil la vida en casa. Reunimos electrodomésticos, móviles, ordenadores y accesorios para que encuentres lo que necesitas en un mismo lugar, con un equipo dispuesto a ayudarte a elegir.</p>
            <p>Desde renovar la cocina hasta estrenar móvil o montar tu espacio de trabajo, en TonyMarkt te atendemos con cercanía. Y prometemos no juzgar ese capricho tecnológico.</p>
            <div className="contact-details">
              <div><span>Teléfono</span><a href="tel:+34958000054">+34 958 00 00 54</a></div>
              <div><span>Fax</span><strong>+34 958 00 00 55</strong></div>
              <div><span>Dirección</span><address>Calle Fiñana, 54<br />Caniles</address></div>
            </div>
          </div>
          <div className="contact-map">
            <iframe title="Ubicación de TonyMarkt en Calle Fiñana, 54, Caniles" src="https://www.google.com/maps?q=Calle+Fi%C3%B1ana+54,+Caniles,+Granada,+Espa%C3%B1a&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            <a href="https://www.google.com/maps/search/?api=1&query=Calle+Fi%C3%B1ana+54,+Caniles,+Granada,+Espa%C3%B1a" target="_blank" rel="noreferrer">Abrir en Google Maps ↗</a>
          </div>
        </section>}
      </main>

      <footer className="site-footer"><span>TONYMARKT <span className="footer-dot">●</span> Tecnología con sentido del humor</span><span>© 2026 · Todos los caprichos reservados</span></footer>
    </div>
  );
}

export default App;
