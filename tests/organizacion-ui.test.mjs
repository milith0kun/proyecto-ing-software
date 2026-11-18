import test from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';

const dom = new Window({ url: 'http://localhost/' });
for (const nombre of [
  'window',
  'self',
  'document',
  'navigator',
  'HTMLElement',
  'Node',
  'Event',
  'MouseEvent',
  'KeyboardEvent',
  'MutationObserver',
]) {
  Object.defineProperty(globalThis, nombre, {
    configurable: true,
    value: nombre === 'window' || nombre === 'self' ? dom : nombre === 'document' ? dom.document : dom[nombre],
  });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const React = await import('react');
const { render, screen, fireEvent, cleanup } = await import('@testing-library/react');
const { default: PanelOrganizacion } = await import('../src/app/admin/organizacion/PanelOrganizacion.tsx');

test.afterEach(() => cleanup());

const areasEjemplo = [
  {
    id: '507f1f77bcf86cd799439021',
    nombre: 'Ingeniería de Software',
    activa: true,
    puestos: [
      {
        id: '507f1f77bcf86cd799439031',
        nombre: 'Desarrollador Junior',
        areaId: '507f1f77bcf86cd799439021',
        colaboradores: 3,
      },
    ],
    totalColaboradores: 3,
  },
  {
    id: '507f1f77bcf86cd799439022',
    nombre: 'Recursos Humanos',
    activa: true,
    puestos: [
      {
        id: '507f1f77bcf86cd799439032',
        nombre: 'Analista de Talento',
        areaId: '507f1f77bcf86cd799439022',
        colaboradores: 1,
      },
    ],
    totalColaboradores: 1,
  },
];

test('HU-007 (CGB-31) UI: vista en acordeón de áreas, puestos y colaboradores', async (t) => {
  await t.test('CA-04: despliega y contrae cada área mostrando sus puestos y conteo de colaboradores', () => {
    render(React.createElement(PanelOrganizacion, { areasIniciales: areasEjemplo }));

    // La primera área inicia desplegada y muestra su puesto y conteo (en cabecera y fila de puesto).
    assert.ok(screen.getByText('Desarrollador Junior'));
    assert.equal(screen.getAllByText('3 colaboradores').length, 2);
    assert.equal(screen.queryByText('Analista de Talento'), null);

    // Al hacer clic en la segunda área, despliega sus puestos.
    const botonRh = screen.getByRole('button', { name: /Recursos Humanos/i });
    assert.equal(botonRh.getAttribute('aria-expanded'), 'false');
    fireEvent.click(botonRh);
    assert.equal(botonRh.getAttribute('aria-expanded'), 'true');
    assert.ok(screen.getByText('Analista de Talento'));
    assert.equal(screen.getAllByText('1 colaborador').length, 2);
  });

  await t.test('CA-03: el modal de nueva área bloquea duplicados sin distinguir tildes ni mayúsculas', () => {
    render(React.createElement(PanelOrganizacion, { areasIniciales: areasEjemplo }));

    fireEvent.click(screen.getByRole('button', { name: /Nueva área/i }));
    const input = screen.getByLabelText(/Nombre del área/i);
    fireEvent.change(input, { target: { value: 'ingenieria de software' } });
    fireEvent.click(screen.getByRole('button', { name: /Guardar área/i }));

    assert.ok(screen.getByText('El área o puesto ya existe en la organización'));
  });
});
