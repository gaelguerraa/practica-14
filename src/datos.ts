
export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
  existencia: number;
}

// Formato de dinero: 1299 → "$1,299.00". Se crea una vez y se reusa.
export const pesos = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });
