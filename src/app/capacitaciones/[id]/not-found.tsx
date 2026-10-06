import Link from 'next/link';
import { MarcoCapacitacion } from '@/components/capacitaciones/MarcoCapacitacion';

export default function CapacitacionNoEncontrada() {
  return (
    <MarcoCapacitacion>
      <section className="capacitacion-no-disponible">
        <p className="kicker-cgb">
          Contenido no disponible
        </p>
        <h1>
          Capacitación no encontrada o no disponible
        </h1>
        <p>
          Es posible que el enlace no exista o que el contenido ya no sea público.
        </p>
        <Link href="/capacitaciones" className="boton-primario">
          Volver al catálogo
        </Link>
      </section>
    </MarcoCapacitacion>
  );
}
