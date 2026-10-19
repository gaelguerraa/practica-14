# Tienda en línea (React + TypeScript + Vite)

```bash
npm install
npm run dev     # http://localhost:5173
```

## Estructura

```
src/
  App.tsx                  ← dueño del estado (filtro, carrito)
  datos.ts                 ← productos y formato de pesos (código base)
  index.css                ← estilos (código base)
  componentes/
    Layout.tsx             ← Ej. 1: marco con 3 huecos
    Encabezado.tsx         ← Ej. 1: marca + piezas
    PiePagina.tsx          ← Ej. 1: resumen + total
    TarjetaProducto.tsx    ← Ej. 2
    Catalogo.tsx           ← Ej. 2: .map + key
    Filtros.tsx            ← Ej. 3
```

## Respuestas

**1. ¿Por qué el Layout no necesita saber que es una tienda?**
Porque no decide qué se muestra, solo dónde. Recibe `encabezado`, `pie` y `children` como props y los coloca en su sitio.
Sus props son de tipo `ReactNode` (cualquier cosa que React sepa pintar), así que no hay ninguna referencia a productos, carrito ni pesos.
Por eso el mismo Layout serviría para un blog o un panel de administración: cambia lo que le pasas, no el Layout.
Es composición: el papá (`App`) decide el contenido y el Layout solo da la estructura.

**2. ¿Qué pasa con `onClick={onAgregar(producto)}` sin la flecha?**
`onAgregar(producto)` no entrega la función: la **ejecuta en ese instante**, durante el render, y lo que `onClick` recibe es lo que esa llamada devuelve (`undefined`).
Entonces, al pintar la tarjeta, ya se llamó a `onAgregar`, que llama a `setCarrito`; eso provoca otro render, que vuelve a llamar a `onAgregar`, y así se arma un ciclo.
React lo corta con el error «Too many re-renders».
Además, el clic real no hace nada, porque `onClick` quedó con `undefined`.
Con `() => onAgregar(producto)` se pasa una función, y esa función se ejecuta solo cuando alguien hace clic.

**3. ¿Por qué con `carrito.push(...)` el contador no se mueve y no sale error?**
`push` muta el mismo arreglo en memoria, y JavaScript no tiene nada de qué quejarse: es una operación válida.
Pero React solo vuelve a pintar cuando se llama a `setCarrito`, y cuando lo hace compara el valor nuevo con el anterior por referencia (`Object.is`).
Si le pasas el mismo arreglo mutado, la referencia es idéntica, React concluye que nada cambió y no repinta.
(Y si nunca llamas a `setCarrito`, ni siquiera se entera.)
Por eso se crea un arreglo nuevo: `setCarrito([...carrito, producto])`.

