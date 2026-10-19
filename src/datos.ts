// datos.ts — RECURSO: no se teclea, se copia del código base.
// Los mismos 12 productos del catálogo de la Práctica 11, ahora en memoria.

// La forma de un producto. Es el contrato de datos de toda la tienda.
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

export const productos: Producto[] = [
  { id: 'P-001', nombre: 'Guantes originales UFC', precio: 1299, categoria: 'guantes', imagen: '/img/producto-01.jpg', existencia: 8 },
  { id: 'P-002', nombre: 'Guantes de boxeo UFC', precio: 1549, categoria: 'guantes', imagen: '/img/producto-02.jpg', existencia: 25 },
  { id: 'P-003', nombre: 'Guantes de boxeo niño UFC', precio: 989, categoria: 'guantes', imagen: '/img/producto-03.jpg', existencia: 8 },
  { id: 'P-004', nombre: 'Guantes originales UFC Freedom 250', precio: 3799, categoria: 'guantes', imagen: '/img/producto-04.jpg', existencia: 25 },
  { id: 'P-005', nombre: 'Playera deportiva Ilia Topuria', precio: 1799, categoria: 'ropa', imagen: '/img/producto-05.jpg', existencia: 3 },
  { id: 'P-006', nombre: 'Playera deportiva UFC Freedom 250', precio: 2099, categoria: 'ropa', imagen: '/img/producto-06.jpg', existencia: 25 },
  { id: 'P-007', nombre: 'Sudadera con capucha', precio: 2799, categoria: 'ropa', imagen: '/img/producto-07.jpg', existencia: 8 },
  { id: 'P-008', nombre: 'Short de entrenamiento Ilia Topuria', precio: 4099, categoria: 'ropa', imagen: '/img/producto-08.jpg', existencia: 12 },
  { id: 'P-009', nombre: 'Short de entrenamiento Jon Jones', precio: 4099, categoria: 'ropa', imagen: '/img/producto-09.jpg', existencia: 0 },
  { id: 'P-010', nombre: 'Short de entrenamiento UFC generico', precio: 3499, categoria: 'ropa', imagen: '/img/producto-10.jpg', existencia: 5 },
  { id: 'P-011', nombre: 'Chamarra rompeviento', precio: 1499, categoria: 'ropa', imagen: '/img/producto-11.jpg', existencia: 0 },
  { id: 'P-012', nombre: 'Protector bucal UFC', precio: 179, categoria: 'accesorios', imagen: '/img/producto-12.jpg', existencia: 25 },
];
