// useProductos — pide los productos en un efecto y regresa los tres estados.
import { useCallback, useEffect, useState } from 'react';
import type { Producto } from '../datos';
import { obtenerProductos } from '../servicios/tienda';
import { fueCancelada, mensajeDeError } from '../api/cliente';

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Cambiar este número vuelve a disparar el efecto: así funcionan "Reintentar" y "recargar".
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    setCargando(true);
    setError(null);

    obtenerProductos(controlador.signal)
      .then(setProductos)
      .catch((e) => {
        if (fueCancelada(e)) return; // la cancelamos nosotros: no es un error
        setError(mensajeDeError(e));
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false);
      });

    // Limpieza: si el efecto se repite o el componente se va, se cancela la petición anterior.
    return () => controlador.abort();
  }, [intento]); // ← el arreglo de dependencias: el efecto sólo corre cuando "intento" cambia

  const recargar = useCallback(() => setIntento((n) => n + 1), []);

  return { productos, cargando, error, recargar };
}
