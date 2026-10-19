# Tienda en línea (React + TypeScript + Vite)

```bash
npm install
npm run dev     # http://localhost:5173
```

Necesita la API (`tienda-backend`) corriendo en `http://localhost:3000`.

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
    Cargando.tsx           ← P14 (código base)
    MensajeError.tsx       ← P14 (código base)
    FormularioPago.tsx     ← P14 Ej. 2: formulario controlado + POST /pedidos
  api/cliente.ts           ← P14 Ej. 1: la ÚNICA instancia de Axios (baseURL + timeout)
  servicios/tienda.ts      ← P14: obtenerProductos() y crearPedido() (sacan la lista del sobre)
  hooks/useProductos.ts    ← P14 Ej. 1: efecto + { productos, cargando, error, recargar }
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

---

# Práctica 14 · Conexión con la API

## Respuestas

**¿Por qué en la pestaña Red salen dos peticiones al cargar?**
Porque `main.tsx` envuelve la app en `<StrictMode>`. En desarrollo, StrictMode monta cada componente, ejecuta sus efectos, corre la limpieza y vuelve a ejecutar los efectos, para detectar efectos que no se limpian bien.
Por eso `useProductos` dispara `GET /productos` dos veces. La primera se cancela con `controlador.abort()` (la limpieza del efecto) y sale como *cancelled* en la pestaña Red; la segunda es la que llena el catálogo.
Sólo pasa en desarrollo: con `npm run build` + `npm run preview` sale una sola petición.

**¿Qué pasa si quitas el arreglo de dependencias del efecto?**
Sin el `[intento]` el efecto corre después de **cada** render. El efecto pide los productos y, al llegar, `setProductos(...)` guarda un arreglo nuevo, lo que provoca otro render, que vuelve a ejecutar el efecto, que vuelve a pedir… Es un ciclo infinito.
En la pestaña Red se ve una cascada interminable de peticiones `productos` (una tras otra, sin que el usuario haga nada), la pantalla parpadea entre «Cargando» y el catálogo, y la API se llena de tráfico.
Para mostrarlo: en `useProductos.ts` cambia `}, [intento]);` por `});`, abre Red (filtro Fetch/XHR), recarga y toma la captura. Después regrésalo.

**¿Qué hace `e.preventDefault()` y qué pasa si lo quitas?**
Cancela el comportamiento por defecto del navegador para el evento `submit`: enviar el formulario con una petición propia (GET a la misma URL con los campos en la barra de direcciones, o POST) y **recargar la página**.
Si lo quitas, al darle «Pagar» la página se recarga antes (o mientras) de que Axios haga su trabajo: se pierde todo el estado de React (carrito, folio, mensajes de error), no se alcanza a ver la respuesta, y la URL cambia a `/?` o similar.
Con `preventDefault()` el envío lo controla React: validamos, llamamos a la API con Axios y la página sigue viva.

## Comprobación con `git diff`

La Práctica 13 (12B) está como primer commit. Los componentes originales no cambiaron:

```bash
git diff -- src/componentes/Layout.tsx src/componentes/Encabezado.tsx src/componentes/PiePagina.tsx \
            src/componentes/Filtros.tsx src/componentes/Catalogo.tsx src/componentes/TarjetaProducto.tsx
# (sin salida: no hay cambios)
git status --short   # sólo aparecen archivos nuevos y App.tsx, datos.ts, package*.json
```

## Cambios respecto a la Práctica 13

- `App.tsx`: ya no importa `productos`; usa `useProductos()`, muestra Cargando / Error / catálogo y agrega `<FormularioPago>`. Las categorías del filtro se calculan de los datos de la API.
- `datos.ts`: se quitó el arreglo local de productos (se conserva `Producto` y `pesos`, que usan los componentes de 12B).
- `package.json`: se agregó `axios`.
