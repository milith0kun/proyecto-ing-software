import Image from 'next/image';
import Link from 'next/link';

export function MarcaCgb() {
  return (
    <Link href="/" className="marca-cgb" aria-label="CGB Academy, inicio">
      <span className="marca-cgb__isotipo">
        <Image
          src="/logos/cgb-logo.png"
          alt=""
          fill
          sizes="48px"
          className="object-contain"
          priority
        />
      </span>
      <span className="marca-cgb__separador" aria-hidden="true" />
      <span className="marca-cgb__texto">
        <span className="marca-cgb__nombre">CGB Academy</span>
        <span className="marca-cgb__subtitulo">Educación, investigación e innovación</span>
      </span>
    </Link>
  );
}
