import test from 'node:test';
import assert from 'node:assert/strict';
import { enviarCorreoInvitacion } from '../src/lib/correo-invitacion.ts';

const configuracionOriginal = {
  apiKey: process.env.RESEND_API_KEY,
  remitente: process.env.EMAIL_FROM,
};

test.after(() => {
  if (configuracionOriginal.apiKey === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = configuracionOriginal.apiKey;
  if (configuracionOriginal.remitente === undefined) delete process.env.EMAIL_FROM;
  else process.env.EMAIL_FROM = configuracionOriginal.remitente;
});

test('el servicio envía la invitación al correo configurado y escapa contenido HTML', async () => {
  process.env.RESEND_API_KEY = 'test-key';
  process.env.EMAIL_FROM = 'CGB Academy <noreply@example.com>';
  let solicitud;

  await enviarCorreoInvitacion({
    nombre: '<Ana>',
    email: 'ana@example.com',
    enlaceActivacion: 'https://academy.example/activar?token=abc',
  }, async (url, opciones) => {
    solicitud = { url, opciones };
    return new Response(null, { status: 200 });
  });

  assert.equal(solicitud.url, 'https://api.resend.com/emails');
  assert.equal(solicitud.opciones.method, 'POST');
  assert.equal(solicitud.opciones.headers.Authorization, 'Bearer test-key');
  const cuerpo = JSON.parse(solicitud.opciones.body);
  assert.deepEqual(cuerpo.to, ['ana@example.com']);
  assert.match(cuerpo.html, /&lt;Ana&gt;/);
});

test('no simula envío cuando falta configuración o el proveedor rechaza la solicitud', async () => {
  delete process.env.RESEND_API_KEY;
  delete process.env.EMAIL_FROM;
  await assert.rejects(() => enviarCorreoInvitacion({
    nombre: 'Ana', email: 'ana@example.com', enlaceActivacion: 'https://academy.example/activar',
  }, async () => new Response(null, { status: 200 })), /no está configurado/);

  process.env.RESEND_API_KEY = 'test-key';
  process.env.EMAIL_FROM = 'noreply@example.com';
  await assert.rejects(() => enviarCorreoInvitacion({
    nombre: 'Ana', email: 'ana@example.com', enlaceActivacion: 'https://academy.example/activar',
  }, async () => new Response(null, { status: 503 })), /no pudo enviar/);
});