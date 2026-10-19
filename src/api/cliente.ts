// cliente.ts — LA ÚNICA instancia de Axios de toda la tienda.
// Ningún componente importa Axios: sólo este archivo y los servicios lo conocen.
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000', // la API (tienda-backend)
  timeout: 5000,                    // si no responde en 5 s, la petición falla
});

// ¿La petición se canceló a propósito (AbortController)? No es un error real.
export const fueCancelada = (error: unknown): boolean => axios.isCancel(error);

// Convierte cualquier error en un texto que se pueda mostrar al usuario.
export function mensajeDeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // La API respondió con un error (400, 404, 409...): Nest manda { message }.
    // En un 400 de validación, message es un arreglo de textos.
    const mensaje = error.response?.data?.message;
    if (Array.isArray(mensaje)) return mensaje.join('. ');
    if (typeof mensaje === 'string') return mensaje;
    // Se acabó el tiempo límite.
    if (error.code === 'ECONNABORTED') return 'La API tardó demasiado en responder.';
    // Nunca hubo respuesta: la API está apagada o no hay red.
    if (!error.response) return 'No se pudo conectar con la API. ¿Está encendida?';
  }
  return 'Ocurrió un error inesperado.';
}
