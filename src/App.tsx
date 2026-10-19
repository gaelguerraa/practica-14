import { useState } from 'react';
import { productos } from './datos';
import type { Producto } from './datos';
import Layout from './componentes/Layout';
import Encabezado from './componentes/Encabezado';
import PiePagina from './componentes/PiePagina';
import Filtros from './componentes/Filtros';
import Catalogo from './componentes/Catalogo';

const categorias = ['todas', 'guantes', 'ropa', 'accesorios'];

export default function App() {
  // Estado: SÓLO lo que cambia por una acción del usuario.
  const [filtro, setFiltro] = useState('todas');
  const [carrito, setCarrito] = useState<Producto[]>([]);

  // Derivados: se calculan en cada pintada, no se guardan en el estado.
  const visibles = filtro === 'todas' ? productos : productos.filter((p) => p.categoria === filtro);
  const total = carrito.reduce((suma, p) => suma + p.precio, 0);

  // Sin mutar: se crea un arreglo nuevo con lo anterior + el producto.
  const agregar = (producto: Producto) => {
    setCarrito([...carrito, producto]);
  };

  return (
    <Layout
      encabezado={<Encabezado piezas={carrito.length} />}
      pie={<PiePagina piezas={carrito.length} total={total} />}
    >
      <section className="portada">
        <h1>Catálogo de temporada</h1>
        <p>{visibles.length} productos</p>
      </section>
      <Filtros categorias={categorias} activa={filtro} onCambiar={setFiltro} />
      <Catalogo productos={visibles} onAgregar={agregar} />
    </Layout>
  );
}
