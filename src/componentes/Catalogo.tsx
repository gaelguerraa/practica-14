import type { Producto } from '../datos';
import TarjetaProducto from './TarjetaProducto';

interface CatalogoProps {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
}

export default function Catalogo({ productos, onAgregar }: CatalogoProps) {
  return (
    <section className="catalogo">
      {productos.map((p) => (
        // key: el id del producto, único y estable (no el índice)
        <TarjetaProducto key={p.id} producto={p} onAgregar={onAgregar} />
      ))}
    </section>
  );
}
