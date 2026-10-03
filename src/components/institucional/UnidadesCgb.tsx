import Image from 'next/image';

const unidades = [
  { id: 'CIIP', nombre: 'CIIP LATAM', logo: '/logos/ciip-logo.png' },
  { id: 'GEOMINA', nombre: 'GEOMINA LATAM', logo: '/logos/geomina-logo.png' },
  { id: 'BIOMEDIC', nombre: 'BIOMEDIC LATAM', logo: '/logos/biomedic-logo.png' },
];

export function UnidadesCgb({ claro = false }: { claro?: boolean }) {
  return (
    <ul className={`unidades-cgb${claro ? ' unidades-cgb--claro' : ''}`} aria-label="Unidades institucionales">
      {unidades.map((unidad) => (
        <li key={unidad.id} className="unidades-cgb__item">
          <span className="unidades-cgb__logo">
            <Image src={unidad.logo} alt={unidad.nombre} fill sizes="120px" className="object-contain" />
          </span>
        </li>
      ))}
    </ul>
  );
}
