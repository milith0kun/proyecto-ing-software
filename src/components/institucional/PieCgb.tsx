import Image from 'next/image';
import Link from 'next/link';

export function PieCgb() {
  return (
    <footer className="footer-cgb px-6 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="footer-cgb__contenido">
          <div className="footer-cgb__marca-bloque">
            <Link href="/" className="footer-cgb__marca" aria-label="CGB Academy, inicio">
              <span className="footer-cgb__logo">
                <Image src="/logos/recortados/cgb-logo-footer.png" alt="" fill sizes="220px" className="object-contain" />
              </span>
              <strong className="footer-cgb__academy">Academy</strong>
            </Link>
            <p>
              FormaciÃ³n profesional a travÃ©s de CIIP, GEOMINA y BIOMEDIC. Explora nuevas Ã¡reas y encuentra capacitaciones para seguir creciendo.
            </p>
          </div>

          <nav className="footer-cgb__enlaces" aria-label="Enlaces del pie de pÃ¡gina">
            <h2>Explora</h2>
            <Link href="/capacitaciones">CatÃ¡logo de capacitaciones</Link>
            <Link href="/#unidades">Nuestras escuelas</Link>
            <Link href="/login">Acceso interno</Link>
            <a href="https://cgbacademy.com/" target="_blank" rel="noreferrer">
              Sitio web de CGB Academy
              <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </a>
          </nav>
        </div>
        <div className="footer-cgb__base">
          <span>Â© CGB Academy</span>
          <span>CIIP LATAM Â· GEOMINA LATAM Â· BIOMEDIC LATAM</span>
        </div>
      </div>
    </footer>
  );
}
