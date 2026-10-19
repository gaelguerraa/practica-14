interface EncabezadoProps {
  piezas: number; // cuántas piezas hay en el carrito
}

export default function Encabezado({ piezas }: EncabezadoProps) {
  return (
    <header className="encabezado">
      <div className="encabezado__marca">
        <img src="/img/ufc.svg" alt="" height="32" />
        Tienda
      </div>
      <span className="encabezado__carrito">
        Carrito: <strong>{piezas}</strong>
      </span>
    </header>
  );
}
