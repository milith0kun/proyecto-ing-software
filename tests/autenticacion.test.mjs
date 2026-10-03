import test from 'node:test';
import assert from 'node:assert/strict';
import { hash } from 'bcryptjs';
import {
  autenticar,
  crearToken,
  verificarToken,
  destinoPorRol,
  opcionesCookie,
  solicitudMismoOrigen,
  resolverSesion,
} from '../src/lib/autenticacion.ts';

const secreto = 'cgb_secret_65a8df241bc489e27304b5618fce1862d7c0e819b5c219f8541e24bc109f635a';
const claveAdmin = 'Admin2026!*';
const claveColaborador = 'Colab2026!*';
const hashAdmin = await hash(claveAdmin, 10);
const hashColaborador = await hash(claveColaborador, 10);

const usuarioAdmin = {
  id: 'usr_admin_001',
  email: 'admin@cgb.latam',
  name: 'Administrador Institucional',
  role: 'ADMINISTRADOR',
  activo: true,
  passwordHash: hashAdmin,
};

const usuarioColaborador = {
  id: 'usr_colab_001',
  email: 'colaborador@cgb.latam',
  name: 'Colaborador Académico',
  role: 'COLABORADOR',
  activo: true,
  passwordHash: hashColaborador,
};

test('HU-001: TDD Fase RED/GREEN - Validaciones de Acceso Interno y Autenticación (CGB-6)', async (t) => {
  await t.test('CA-01: Credenciales válidas permiten acceder según el rol y protegen el hash de contraseña', async () => {
    const resultado = await autenticar(
      { correo: ' Admin@CGB.latam ', contrasena: claveAdmin },
      async (correo) => (correo === usuarioAdmin.email ? usuarioAdmin : null)
    );

    assert.equal(resultado.id, usuarioAdmin.id);
    assert.equal(resultado.role, 'ADMINISTRADOR');
    assert.equal(destinoPorRol(resultado.role), '/admin/capacitaciones');
    assert.equal('passwordHash' in resultado, false, 'No debe filtrar el hash de la contraseña');
  });

  await t.test('CA-02: Usuario inexistente, contraseña errónea o cuenta inactiva responden con error idéntico', async () => {
    const casos = [
      [{ correo: usuarioAdmin.email, contrasena: 'clave-erronea-123' }, usuarioAdmin],
      [{ correo: 'desconocido@cgb.latam', contrasena: claveAdmin }, null],
      [{ correo: usuarioAdmin.email, contrasena: claveAdmin }, { ...usuarioAdmin, activo: false }],
      [{ correo: usuarioAdmin.email, contrasena: claveAdmin }, { ...usuarioAdmin, role: 'INVITADO_NO_VALIDO' }],
      [{ correo: 'formato-invalido', contrasena: claveAdmin }, usuarioAdmin],
    ];

    for (const [datos, cuenta] of casos) {
      await assert.rejects(
        () => autenticar(datos, async () => cuenta),
        /Credenciales inválidas/
      );
    }
  });

  await t.test('CA-03: Firma, integridad y expiración de tokens JWT', async () => {
    const token = await crearToken(usuarioAdmin, 'sesion_adm_1', secreto);
    const verificado = await verificarToken(token, secreto);

    assert.equal(verificado.sub, usuarioAdmin.id);
    assert.equal(verificado.sid, 'sesion_adm_1');
    assert.equal(verificado.rol, 'ADMINISTRADOR');

    // Rechazo ante manipulación de firma
    assert.equal(await verificarToken(token + 'tamper', secreto), null);
    assert.equal(await verificarToken(token, secreto + 'otro'), null);

    // Rechazo de token expirado
    const tokenExpirado = await crearToken(usuarioAdmin, 'sesion_adm_1', secreto, -1);
    assert.equal(await verificarToken(tokenExpirado, secreto), null);

    // Exigencia de secreto de al menos 32 bytes
    await assert.rejects(() => crearToken(usuarioAdmin, 'sesion_adm_1', 'clave_corta'), /32/);
  });

  await t.test('CA-04: Atributos de seguridad de cookies y revocación', () => {
    const cookieDev = opcionesCookie(false);
    assert.equal(cookieDev.httpOnly, true);
    assert.equal(cookieDev.sameSite, 'lax');
    assert.equal(cookieDev.secure, false);

    const cookieProd = opcionesCookie(true);
    assert.equal(cookieProd.secure, true);

    const cookieEliminada = opcionesCookie(false, true);
    assert.equal(cookieEliminada.maxAge, 0);
    assert.equal(cookieEliminada.path, '/');
  });

  await t.test('Seguridad: Prevención de truncamiento de bcrypt (>72 bytes)', async () => {
    await assert.rejects(
      () => autenticar({ correo: usuarioAdmin.email, contrasena: 'a'.repeat(73) }, async () => usuarioAdmin),
      /Credenciales inválidas/
    );
  });

  await t.test('Seguridad: Validación de mismo origen (Same-Origin) en mutaciones', () => {
    assert.equal(solicitudMismoOrigen('https://cgb.latam', 'https://cgb.latam/api/auth/logout'), true);
    assert.equal(solicitudMismoOrigen('https://sitio-malicioso.com', 'https://cgb.latam/api/auth/logout'), false);
    assert.equal(solicitudMismoOrigen(null, 'https://cgb.latam/api/auth/login'), false);
  });
});

test('HU-001: T4 - Validación BDD e Integración de Criterios de Aceptación (CGB-6)', async (t) => {
  await t.test('Escenario BDD 1: Inicio de sesión exitoso como Administrador (Dado/Cuando/Entonces)', async () => {
    // DADO un usuario con rol ADMINISTRADOR y estado activo en la plataforma
    const credenciales = { correo: 'admin@cgb.latam', contrasena: claveAdmin };

    // CUANDO ingresa sus credenciales al sistema de autenticación
    const usuario = await autenticar(credenciales, async (correo) => (correo === usuarioAdmin.email ? usuarioAdmin : null));
    const token = await crearToken(usuario, 'sesion_bdd_admin', secreto);
    const sesionBD = { usuarioId: usuario.id, expiraEn: new Date(Date.now() + 60000), usuario: usuarioAdmin };
    const sesionResuelta = await resolverSesion(token, secreto, async () => sesionBD);

    // ENTONCES se le concede acceso a la ruta de administración y se expide el token correspondiente
    assert.equal(usuario.role, 'ADMINISTRADOR');
    assert.equal(destinoPorRol(usuario.role), '/admin/capacitaciones');
    assert.equal(sesionResuelta.id, usuarioAdmin.id);
  });

  await t.test('Escenario BDD 2: Inicio de sesión exitoso como Colaborador (Dado/Cuando/Entonces)', async () => {
    // DADO un usuario con rol COLABORADOR habilitado
    const credenciales = { correo: 'colaborador@cgb.latam', contrasena: claveColaborador };

    // CUANDO envía sus credenciales correctas
    const usuario = await autenticar(credenciales, async (correo) => (correo === usuarioColaborador.email ? usuarioColaborador : null));

    // ENTONCES el sistema lo direcciona al área de inducción/colaborador
    assert.equal(usuario.role, 'COLABORADOR');
    assert.equal(destinoPorRol(usuario.role), '/colaborador');
  });

  await t.test('Escenario BDD 3: Rechazo unificado ante credenciales incorrectas o cuenta inactiva (Dado/Cuando/Entonces)', async () => {
    // DADO un intento de inicio de sesión con clave incorrecta
    const credencialesErroneas = { correo: 'admin@cgb.latam', contrasena: 'PasswordIncorrecta!' };

    // CUANDO el sistema procesa la validación
    // ENTONCES rechaza la solicitud con mensaje genérico para evitar enumeración de usuarios
    await assert.rejects(
      () => autenticar(credencialesErroneas, async () => usuarioAdmin),
      /Credenciales inválidas/
    );
  });

  await t.test('Escenario BDD 4: Cierre de sesión y revocación inmediata de acceso persistido (Dado/Cuando/Entonces)', async () => {
    // DADO un usuario con sesión activa y token válido
    const token = await crearToken(usuarioAdmin, 'sesion_a_revocar', secreto);
    let registroSesionEnBD = { usuarioId: usuarioAdmin.id, expiraEn: new Date(Date.now() + 60000), usuario: usuarioAdmin };

    const sesionActiva = await resolverSesion(token, secreto, async (id) => (id === 'sesion_a_revocar' ? registroSesionEnBD : null));
    assert.ok(sesionActiva, 'La sesión inicial debe ser válida');

    // CUANDO el usuario cierra sesión y el registro es eliminado de la base de datos
    registroSesionEnBD = null; // Simula prisma.sesion.deleteMany()
    const sesionRevocada = await resolverSesion(token, secreto, async () => null);

    // ENTONCES el token JWT deja de autorizar peticiones aun estando en su periodo de vigencia
    assert.equal(sesionRevocada, null, 'Una sesión eliminada en BD no debe otorgar autorización');
  });
});
