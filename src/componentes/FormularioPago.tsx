import { useState } from 'react';
import type { FormEvent } from 'react';
import { crearPedido } from '../servicios/tienda';
import { mensajeDeError } from '../api/cliente';

interface FormularioPagoProps {
  idsCarrito: string[];     // los ids de lo que hay en el carrito
  onPagado: () => void;     // el papá vacía el carrito y vuelve a pedir los productos
}

export default function FormularioPago({ idsCarrito, onPagado }: FormularioPagoProps) {
  // Formulario controlado: el valor de cada campo vive en el estado.
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [errorCorreo, setErrorCorreo] = useState('');
  const [errorTelefono, setErrorTelefono] = useState('');
  const [errorApi, setErrorApi] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [folio, setFolio] = useState('');

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // evita que el navegador recargue la página al enviar

    // Validar antes de enviar.
    const malCorreo = correo.includes('@') ? '' : 'El correo debe tener @';
    const malTelefono = /^\d{10}$/.test(telefono) ? '' : 'El teléfono debe tener 10 dígitos';
    setErrorCorreo(malCorreo);
    setErrorTelefono(malTelefono);
    setErrorApi('');
    if (malCorreo || malTelefono) return;

    setEnviando(true);
    try {
      const pedido = await crearPedido({ correo, telefono, productos: idsCarrito });
      setFolio(pedido.folio);
      setCorreo('');
      setTelefono('');
      onPagado();
    } catch (error) {
      setErrorApi(mensajeDeError(error)); // p. ej. el 409: "No hay suficientes piezas de…"
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      {folio && <p className="confirmacion">¡Pago realizado! Tu folio es {folio}</p>}

      <form className="pago" onSubmit={enviar} noValidate>
        <h2>Pago</h2>

        <label>
          Correo
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="tu@correo.com"
          />
        </label>
        {errorCorreo && <p className="pago__error">{errorCorreo}</p>}

        <label>
          Teléfono
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="6441234567"
          />
        </label>
        {errorTelefono && <p className="pago__error">{errorTelefono}</p>}

        {errorApi && <p className="pago__error">{errorApi}</p>}

        <button type="submit" disabled={enviando || idsCarrito.length === 0}>
          {enviando ? 'Procesando…' : 'Pagar'}
        </button>
        {idsCarrito.length === 0 && <p className="pago__error">Agrega productos al carrito para pagar.</p>}
      </form>
    </>
  );
}
