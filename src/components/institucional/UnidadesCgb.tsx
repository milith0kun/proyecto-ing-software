import Image from 'next/image';

const unidades = [
  { id: 'CIIP', nombre: 'CIIP LATAM', logo: '/logos/recortados/ciip-logo.png', ancho: 550, alto: 700 },
  { id: 'GEOMINA', nombre: 'GEOMINA LATAM', logo: '/logos/recortados/geomina-logo.png', ancho: 700, alto: 698 },
  { id: 'BIOMEDIC', nombre: 'BIOMEDIC LATAM', logo: '/logos/recortados/biomedic-logo.png', ancho: 700, alto: 361 },
];

/** Logos de las unidades institucionales, sin tarjeta. `claro` los pinta en blanco para fondos azules. */
export function UnidadesCgb({ claro = false }: { claro?: boolean }) {
  return (
    <ul className={`unidades-cgb${claro ? ' unidades-cgb--claro' : ''}`} aria-label="Unidades institucionales">
      {unidades.map((unidad) => (
        <li key={unidad.id} className="unidades-cgb__item">
          <Image
            src={unidad.logo}
            alt={unidad.nombre}
            width={unidad.ancho}
            height={unidad.alto}
            sizes="160px"
            className="unidades-cgb__img"
          />
        </li>
      ))}
    </ul>
  );
}
