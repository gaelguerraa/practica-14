import { useState } from 'react';
import type { Producto } from './datos';
import { useProductos } from './hooks/useProductos';
import Layout from './componentes/Layout';
import Encabezado from './componentes/Encabezado';
import PiePagina from './componentes/PiePagina';
import Filtros from './componentes/Filtros';
import Catalogo from './componentes/Catalogo';
import { Cargando } from './componentes/Cargando';
import { MensajeError } from './componentes/MensajeError';
import FormularioPago from './componentes/FormularioPago';

export default function App() {
  // Los productos vienen de la API: el hook regresa los tres estados.
  const { productos, cargando, error, recargar } = useProductos();

  // Estado: SÓLO lo que cambia por una acción del usuario.
  const [filtro, setFiltro] = useState('todas');
  const [carrito, setCarrito] = useState<Producto[]>([]);

  // Derivados: se calculan en cada pintada, no se guardan en el estado.
  const categorias = ['todas', ...new Set(productos.map((p) => p.categoria))];
  const visibles = filtro === 'todas' ? productos : productos.filter((p) => p.categoria === filtro);
  const total = carrito.reduce((suma, p) => suma + p.precio, 0);

  // Sin mutar: se crea un arreglo nuevo con lo anterior + el producto.
  const agregar = (producto: Producto) => {
    setCarrito([...carrito, producto]);
  };

  // Pago exitoso: vaciar el carrito y volver a pedir los productos (existencia actualizada).
  const alPagar = () => {
    setCarrito([]);
    recargar();
  };

  return (
    <Layout
      encabezado={<Encabezado piezas={carrito.length} />}
      pie={<PiePagina piezas={carrito.length} total={total} />}
    >
      <section className="portada">
        <h1>Catálogo de temporada</h1>
        {!cargando && !error && <p>{visibles.length} productos</p>}
      </section>

      {/* Los tres estados de toda petición: cargando, error o datos */}
      {cargando && <Cargando />}
      {error && <MensajeError mensaje={error} onReintentar={recargar} />}
      {!cargando && !error && (
        <>
          <Filtros categorias={categorias} activa={filtro} onCambiar={setFiltro} />
          <Catalogo productos={visibles} onAgregar={agregar} />
        </>
      )}

      <FormularioPago idsCarrito={carrito.map((p) => p.id)} onPagado={alPagar} />
    </Layout>
  );
}
