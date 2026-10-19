import type { ReactNode } from 'react';

// Layout: el marco de la página. Tiene tres huecos y no sabe qué se pone en ellos.
interface LayoutProps {
  encabezado: ReactNode; // hueco 1: arriba
  pie: ReactNode;        // hueco 2: abajo
  children: ReactNode;   // hueco 3: lo que va entre <Layout> ... </Layout>
}

export default function Layout({ encabezado, pie, children }: LayoutProps) {
  return (
    <div className="tienda">
      {encabezado}
      <main className="contenido">{children}</main>
      {pie}
    </div>
  );
}
