// tienda.ts — funciones de servicio: hablan con la API y regresan datos limpios.
import { api } from '../api/cliente';
import type { Producto } from '../datos';

// La forma del sobre { data, meta } que la API pone a toda respuesta exitosa.
interface Sobre<T> {
  data: T;
  meta: { ruta: string; duracionMs: number; timestamp: string };
}

export interface DatosPedido {
  correo: string;
  telefono: string;
  productos: string[]; // ids; si un id se repite, son varias piezas
}

export interface PedidoCreado {
  folio: string;
  total: number;
}

// GET /productos → saca la lista del sobre.
export async function obtenerProductos(signal?: AbortSignal): Promise<Producto[]> {
  const respuesta = await api.get<Sobre<Producto[]>>('/productos', { signal });
  return respuesta.data.data; // 1.º data: de Axios · 2.º data: del sobre de la API
}

// POST /pedidos → regresa { folio, total }.
export async function crearPedido(pedido: DatosPedido): Promise<PedidoCreado> {
  const respuesta = await api.post<Sobre<PedidoCreado>>('/pedidos', pedido);
  return respuesta.data.data;
}
