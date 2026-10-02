import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filtrarCapacitacionesPublicas,
  buscarEnCatalogoPublico,
  validarConsultaPublica
} from '../src/lib/catalogo-publico.ts';

// ---------------------------------------------------------------------------
// Fixture de datos de prueba simulando la colección de MongoDB Atlas
// ---------------------------------------------------------------------------
const COLECCION_CAPACITACIONES_MOCK = [
  {
    id: 'cap_001_ciip_pub',
    titulo: 'Inducción General a la Investigación CIIP 2026',
    descripcion: 'Pautas metodológicas para proyectos de investigación e innovación tecnológica.',
    unidad: 'CIIP',
    ambito: 'PUBLICO',
    estado: 'PUBLICADA',
    categoria: 'Estudiantes',
    duracionMin: 45,
    icono: 'book-open',
    slidesCount: 5
  },
  {
    id: 'cap_002_geomina_pub',
    titulo: 'Seguridad en Operaciones Mineras y Geotécnicas',
    descripcion: 'Protocolos de prevención de riesgos en campo y geología aplicada.',
    unidad: 'GEOMINA',
    ambito: 'PUBLICO',
    estado: 'PUBLICADA',
    categoria: 'Estudiantes',
    duracionMin: 60,
    icono: 'shield',
    slidesCount: 8
  },
  {
    id: 'cap_003_biomedic_pub',
    titulo: 'Guía Docente de Tecnologías en Salud',
    descripcion: 'Manual de orientación para catedráticos en bioinstrumentación y telemedicina.',
    unidad: 'BIOMEDIC',
    ambito: 'PUBLICO',
    estado: 'PUBLICADA',
    categoria: 'Docentes',
    duracionMin: 30,
    icono: 'activity',
    slidesCount: 4
  },
  {
    id: 'cap_004_borrador_no_visible',
    titulo: 'Borrador en Construcción - Minería Avanzada',
    descripcion: 'Contenido preliminar no listo para publicación.',
    unidad: 'GEOMINA',
    ambito: 'PUBLICO',
    estado: 'BORRADOR', // NO DEBE APARECER EN EL CATÁLOGO PÚBLICO (CA-01)
    categoria: 'Estudiantes',
    duracionMin: 20,
    icono: 'book-open',
    slidesCount: 1
  },
  {
    id: 'cap_005_interno_no_visible',
    titulo: 'Onboarding Confidencial de Nuevos Empleados CGB',
    descripcion: 'Procesos de nómina, RRHH y directivas internas exclusivas para colaboradores.',
    unidad: 'GENERAL',
    ambito: 'INTERNO', // NO DEBE APARECER EN EL CATÁLOGO PÚBLICO (CA-01)
    estado: 'PUBLICADA',
    categoria: 'Inducción',
    duracionMin: 90,
    icono: 'lock',
    slidesCount: 12
  }
];

// ---------------------------------------------------------------------------
// HU-005: T1 - RED / Pruebas de Aceptación y Reglas de Negocio
// ---------------------------------------------------------------------------
test('HU-005: T1 - Criterio CA-01: Filtro de Visibilidad y Acceso Público Abierto', async (t) => {
  await t.test('CA-01: Debe retornar únicamente capacitaciones en estado PUBLICADA y ámbito PUBLICO', () => {
    const resultado = filtrarCapacitacionesPublicas(COLECCION_CAPACITACIONES_MOCK);

    assert.equal(resultado.length, 3);
    assert.ok(resultado.every((c) => c.estado === 'PUBLICADA'));
    assert.ok(resultado.every((c) => c.ambito === 'PUBLICO'));
  });

  await t.test('CA-01: Debe excluir estrictamente capacitaciones en BORRADOR o de ámbito INTERNO', () => {
    const resultado = filtrarCapacitacionesPublicas(COLECCION_CAPACITACIONES_MOCK);
    const ids = resultado.map((c) => c.id);

    assert.equal(ids.includes('cap_004_borrador_no_visible'), false);
    assert.equal(ids.includes('cap_005_interno_no_visible'), false);
  });
});

test('HU-005: T1 - Criterio CA-02: Segmentación por Unidad Institucional y Categorías', async (t) => {
  await t.test('CA-02: Debe filtrar por unidad institucional (CIIP, GEOMINA, BIOMEDIC)', () => {
    const resultadoCIIP = filtrarCapacitacionesPublicas(COLECCION_CAPACITACIONES_MOCK, { unidad: 'CIIP' });
    assert.equal(resultadoCIIP.length, 1);
    assert.equal(resultadoCIIP[0].unidad, 'CIIP');

    const resultadoGEOMINA = filtrarCapacitacionesPublicas(COLECCION_CAPACITACIONES_MOCK, { unidad: 'GEOMINA' });
    assert.equal(resultadoGEOMINA.length, 1);
    assert.equal(resultadoGEOMINA[0].unidad, 'GEOMINA');
  });

  await t.test('CA-02: Debe filtrar por categoría destinataria (Estudiantes vs Docentes)', () => {
    const soloEstudiantes = filtrarCapacitacionesPublicas(COLECCION_CAPACITACIONES_MOCK, { categoria: 'Estudiantes' });
    assert.equal(soloEstudiantes.length, 2);
    assert.ok(soloEstudiantes.every((c) => c.categoria === 'Estudiantes'));

    const soloDocentes = filtrarCapacitacionesPublicas(COLECCION_CAPACITACIONES_MOCK, { categoria: 'Docentes' });
    assert.equal(soloDocentes.length, 1);
    assert.equal(soloDocentes[0].categoria, 'Docentes');
  });

  await t.test('CA-02: Búsqueda dinámica por texto coincidente en título o descripción (insensible a mayúsculas)', () => {
    const busquedaGeologia = buscarEnCatalogoPublico(COLECCION_CAPACITACIONES_MOCK, 'geotécnicas');
    assert.equal(busquedaGeologia.length, 1);
    assert.equal(busquedaGeologia[0].id, 'cap_002_geomina_pub');

    const busquedaDocente = buscarEnCatalogoPublico(COLECCION_CAPACITACIONES_MOCK, 'DOCENTE');
    assert.equal(busquedaDocente.length, 1);
    assert.equal(busquedaDocente[0].id, 'cap_003_biomedic_pub');
  });
});

test('HU-005: T1 - Criterio CA-03: Consulta Pública e Independencia de Onboarding', async (t) => {
  await t.test('CA-03: No requiere parámetros de autenticación ni altera sesiones de colaboradores', () => {
    const consultaAnonima = validarConsultaPublica({});
    assert.equal(consultaAnonima.valido, true);
    assert.equal(consultaAnonima.requiereAutenticacion, false);
    assert.equal(consultaAnonima.alteraProgresoOnboarding, false);
  });
});

test('HU-005: T1 - Escenarios BDD Formato Dado/Cuando/Entonces', async (t) => {
  await t.test('Escenario BDD 1: Visitante anónimo accede al catálogo público abierto', () => {
    // DADO que un estudiante o visitante ingresa al Centro de Capacitación CGB Academy
    const catalogo = COLECCION_CAPACITACIONES_MOCK;

    // CUANDO solicita la lista de capacitaciones públicas disponibles
    const disponibles = filtrarCapacitacionesPublicas(catalogo);

    // ENTONCES visualiza únicamente las capacitaciones con visibilidad abierta
    assert.equal(disponibles.length, 3);
    assert.equal(disponibles[0].estado, 'PUBLICADA');
  });

  await t.test('Escenario BDD 2: Usuario filtra capacitaciones públicas de GEOMINA para Estudiantes', () => {
    // DADO que existen múltiples capacitaciones públicas
    const catalogo = COLECCION_CAPACITACIONES_MOCK;

    // CUANDO selecciona el filtro unidad="GEOMINA" y categoria="Estudiantes"
    const filtradas = filtrarCapacitacionesPublicas(catalogo, {
      unidad: 'GEOMINA',
      categoria: 'Estudiantes'
    });

    // ENTONCES el sistema entrega exactamente los contenidos que cumplen ambos criterios
    assert.equal(filtradas.length, 1);
    assert.equal(filtradas[0].unidad, 'GEOMINA');
    assert.equal(filtradas[0].categoria, 'Estudiantes');
  });
});
