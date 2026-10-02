import test from 'node:test';
import assert from 'node:assert/strict';
import { hash } from 'bcryptjs';
import { autenticar, crearToken, verificarToken, destinoPorRol, opcionesCookie, solicitudMismoOrigen, resolverSesion } from '../src/lib/autenticacion.ts';

const secreto = 'secreto-de-pruebas-de-al-menos-32-caracteres';
const clave = 'ClaveDePrueba2026!';
const hashClave = await hash(clave, 10);
const usuario = { id: 'usuario-1', email: 'alex@ejemplo.com', name: 'Alex', role: 'COLABORADOR', activo: true, passwordHash: hashClave };

test('CA-01: credenciales válidas permiten acceder según el rol, sin devolver la contraseña', async () => {
  const resultado = await autenticar({ correo: ' Alex@Ejemplo.com ', contrasena: clave }, async correo => correo === usuario.email ? usuario : null);
  assert.equal(resultado.id, usuario.id);
  assert.equal(destinoPorRol(resultado.role), '/colaborador');
  assert.equal(destinoPorRol('ADMINISTRADOR'), '/admin/capacitaciones');
  assert.equal('passwordHash' in resultado, false);
});

test('CA-02: usuario inexistente, contraseña incorrecta y cuenta inactiva producen el mismo error', async () => {
  for (const [datos, cuenta] of [
    [{ correo: usuario.email, contrasena: 'incorrecta' }, usuario],
    [{ correo: usuario.email, contrasena: clave }, null],
    [{ correo: usuario.email, contrasena: clave }, { ...usuario, activo: false }],
    [{ correo: usuario.email, contrasena: clave }, { ...usuario, role: 'ESTUDIANTE' }],
    [{ correo: 'invalido', contrasena: clave }, usuario],
  ]) await assert.rejects(() => autenticar(datos, async () => cuenta), /Credenciales inválidas/);
});

test('CA-01/CA-03: el JWT firmado se verifica; alterado, expirado o con otra clave se rechaza', async () => {
  const token = await crearToken(usuario, 'sesion-1', secreto);
  assert.equal((await verificarToken(token, secreto)).sub, usuario.id);
  assert.equal((await verificarToken(token, secreto)).sid, 'sesion-1');
  assert.equal(await verificarToken(token + 'x', secreto), null);
  assert.equal(await verificarToken(token, secreto + 'otra'), null);
  const expirado = await crearToken(usuario, 'sesion-1', secreto, -1);
  assert.equal(await verificarToken(expirado, secreto), null);
  await assert.rejects(() => crearToken(usuario, 'sesion-1', 'corta'), /32/);
});

test('CA-04: la cookie es HttpOnly y su eliminación conserva nombre/ruta de sesión', () => {
  assert.equal(opcionesCookie(false).httpOnly, true);
  assert.equal(opcionesCookie(true).secure, true);
  assert.equal(opcionesCookie(false, true).maxAge, 0);
  assert.equal(opcionesCookie(false).path, '/');
});

test('las escrituras con cookie rechazan otro origen', () => {
  assert.equal(solicitudMismoOrigen('https://cgb.example', 'https://cgb.example/api/auth/logout'), true);
  assert.equal(solicitudMismoOrigen('https://otro.example', 'https://cgb.example/api/auth/logout'), false);
  assert.equal(solicitudMismoOrigen('http://127.0.0.1:3000', 'http://localhost:3000/api/auth/login', '127.0.0.1:3000'), true);
  assert.equal(solicitudMismoOrigen(null, 'https://cgb.example'), false);
});

test('CA-04: una sesión revocada rechaza incluso el JWT todavía firmado y vigente', async () => {
  const token = await crearToken(usuario, 'sesion-revocable', secreto);
  let registro = { usuarioId: usuario.id, expiraEn: new Date(Date.now() + 60000), usuario };
  const buscar = async id => id === 'sesion-revocable' ? registro : null;
  assert.equal((await resolverSesion(token, secreto, buscar)).id, usuario.id);
  registro = null;
  assert.equal(await resolverSesion(token, secreto, buscar), null);
});

test('CA-03: una sesión vencida, ajena o de una cuenta deshabilitada no autoriza', async () => {
  const token = await crearToken(usuario, 'sesion-1', secreto);
  const vigente = { usuarioId: usuario.id, expiraEn: new Date(Date.now() + 60000), usuario };
  for (const registro of [
    { ...vigente, expiraEn: new Date(0) },
    { ...vigente, usuarioId: 'otro-usuario' },
    { ...vigente, usuario: { ...usuario, activo: false } },
    { ...vigente, usuario: { ...usuario, role: 'ESTUDIANTE' } },
  ]) assert.equal(await resolverSesion(token, secreto, async () => registro), null);
  let consultas = 0;
  assert.equal(await resolverSesion(undefined, secreto, async () => { consultas++; return vigente; }), null);
  assert.equal(consultas, 0);
});

test('no acepta contraseñas cuyo sufijo sería truncado por bcrypt', async () => {
  await assert.rejects(() => autenticar({ correo: usuario.email, contrasena: 'a'.repeat(73) }, async () => usuario), /Credenciales inválidas/);
});
