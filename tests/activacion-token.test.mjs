import test from 'node:test';
import assert from 'node:assert/strict';
import {
  crearServicioActivacionCuenta,
  ErrorActivacionCuenta,
  validarPoliticaContrasena,
  hashTokenActivacion,
  calcularExpiracion48h,
} from '../src/lib/activacion-cuenta.ts';

function crearRepositorioActivacionEnMemoria({
  ahora = new Date('2026-11-17T16:00:00Z'),
  tokenPlanoValido = 'token-secreto-colaborador-123',
  tokenExpirado = 'token-expirado-48h-999',
} = {}) {
  const registros = [
    {
      colaboradorId: 'col-1',
      userId: 'usr-1',
      nombre: 'Ana Torres',
      email: 'ana.torres@cgb.latam',
      estadoColaborador: 'PENDIENTE_ACTIVACION',
      puestoNombre: 'Backend Node.js',
      rutaNombre: 'Onboarding Backend Node.js',
      userActivo: false,
      passwordHash: null,
      tokenActivacionHash: hashTokenActivacion(tokenPlanoValido),
      tokenExpiraEn: new Date(ahora.getTime() + 1000 * 60 * 60 * 24), // +24h (vigente dentro de 48h)
    },
    {
      colaboradorId: 'col-2',
      userId: 'usr-2',
      nombre: 'Luis Vega',
      email: 'luis.vega@cgb.latam',
      estadoColaborador: 'PENDIENTE_ACTIVACION',
      puestoNombre: 'QA Engineer',
      rutaNombre: 'Onboarding QA',
      userActivo: false,
      passwordHash: null,
      tokenActivacionHash: hashTokenActivacion(tokenExpirado),
      tokenExpiraEn: new Date(ahora.getTime() - 1000 * 60), // vencido hace 1 min
    },
  ];

  return {
    registros,
    async buscarPorTokenHash(tokenHash) {
      const reg = registros.find(r => r.tokenActivacionHash === tokenHash);
      return reg ? structuredClone(reg) : null;
    },
    async buscarPorEmail(email) {
      const reg = registros.find(r => r.email === email);
      return reg ? structuredClone(reg) : null;
    },
    async consumirTokenYActivar({ colaboradorId, userId, tokenHash, passwordHash, ahora: fecha }) {
      const reg = registros.find(
        r =>
          r.colaboradorId === colaboradorId &&
          r.userId === userId &&
          r.tokenActivacionHash === tokenHash &&
          r.tokenExpiraEn !== null &&
          r.tokenExpiraEn.getTime() > fecha.getTime(),
      );
      if (!reg) return false;
      reg.estadoColaborador = 'ACTIVO';
      reg.userActivo = true;
      reg.passwordHash = passwordHash;
      reg.tokenActivacionHash = null;
      reg.tokenExpiraEn = null;
      return true;
    },
    async actualizarTokenReenvio({ colaboradorId, tokenHash, expiraEn }) {
      const reg = registros.find(r => r.colaboradorId === colaboradorId);
      if (!reg) return false;
      reg.tokenActivacionHash = tokenHash;
      reg.tokenExpiraEn = expiraEn;
      return true;
    },
  };
}

const hashearClaveFalso = async clave => `hash:${clave}`;

test('HU-010 CA-01: valida token vigente y devuelve datos pre-cargados del colaborador sin exponer secretos', async () => {
  const ahora = new Date('2026-11-17T16:00:00Z');
  const repo = crearRepositorioActivacionEnMemoria({ ahora });
  const servicio = crearServicioActivacionCuenta(repo, hashearClaveFalso);

  const info = await servicio.validarToken('token-secreto-colaborador-123', ahora);

  assert.equal(info.nombre, 'Ana Torres');
  assert.equal(info.email, 'ana.torres@cgb.latam');
  assert.equal(info.puestoNombre, 'Backend Node.js');
  assert.equal(info.rutaNombre, 'Onboarding Backend Node.js');
  assert.equal('passwordHash' in info, false);
  assert.equal('tokenActivacionHash' in info, false);
});

test('HU-010 CA-02: exige política segura de contraseña (mínimo 8 caracteres, número y símbolo)', () => {
  assert.equal(validarPoliticaContrasena('abc123!').valido, false); // < 8 chars
  assert.equal(validarPoliticaContrasena('SoloLetras!').valido, false); // sin número
  assert.equal(validarPoliticaContrasena('SinSimbolo123').valido, false); // sin símbolo
  assert.equal(validarPoliticaContrasena('ClaveSegura1!').valido, true);
});

test('HU-010 CA-02 & CA-04: activa la cuenta, consume el token (uso único) y retorna destino al onboarding', async () => {
  const ahora = new Date('2026-11-17T16:00:00Z');
  const repo = crearRepositorioActivacionEnMemoria({ ahora });
  const servicio = crearServicioActivacionCuenta(repo, hashearClaveFalso);

  const resultado = await servicio.activarCuenta(
    { token: 'token-secreto-colaborador-123', contrasena: 'MiClave2026!' },
    ahora,
  );

  assert.equal(resultado.activada, true);
  assert.equal(resultado.usuario.id, 'usr-1');
  assert.equal(resultado.usuario.role, 'COLABORADOR');
  assert.equal(resultado.redireccion, '/colaborador');
  assert.equal(repo.registros[0].estadoColaborador, 'ACTIVO');
  assert.equal(repo.registros[0].userActivo, true);
  assert.equal(repo.registros[0].tokenActivacionHash, null);

  // Reutilizar el mismo token debe fallar (uso único)
  await assert.rejects(
    () => servicio.activarCuenta({ token: 'token-secreto-colaborador-123', contrasena: 'OtraClave2026!' }, ahora),
    error => error instanceof ErrorActivacionCuenta && error.codigo === 'TOKEN_INVALIDO_O_EXPIRADO',
  );
});

test('HU-010 CA-03: rechaza tokens expirados (>48h) o alterados y permite solicitar nuevo enlace', async () => {
  const ahora = new Date('2026-11-17T16:00:00Z');
  const expira48 = calcularExpiracion48h(ahora);
  assert.equal(expira48.getTime() - ahora.getTime(), 1000 * 60 * 60 * 48);

  const repo = crearRepositorioActivacionEnMemoria({ ahora });
  const servicio = crearServicioActivacionCuenta(repo, hashearClaveFalso);

  await assert.rejects(
    () => servicio.validarToken('token-expirado-48h-999', ahora),
    error => error instanceof ErrorActivacionCuenta && error.codigo === 'TOKEN_INVALIDO_O_EXPIRADO',
  );

  await assert.rejects(
    () => servicio.validarToken('token-alterado-xyz', ahora),
    error => error instanceof ErrorActivacionCuenta && error.codigo === 'TOKEN_INVALIDO_O_EXPIRADO',
  );

  const reenvio = await servicio.solicitarNuevoEnlace('luis.vega@cgb.latam', ahora);
  assert.equal(reenvio.enviado, true);
  assert.ok(reenvio.tokenNuevo);
  assert.equal(repo.registros[1].tokenActivacionHash, hashTokenActivacion(reenvio.tokenNuevo));
  assert.equal(repo.registros[1].tokenExpiraEn?.getTime(), expira48.getTime());
});
