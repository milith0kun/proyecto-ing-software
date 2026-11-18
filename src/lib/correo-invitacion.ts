export interface InvitacionCorreo {
  nombre: string;
  email: string;
  enlaceActivacion: string;
}

export async function enviarCorreoInvitacion(
  invitacion: InvitacionCorreo,
  enviar: typeof fetch = fetch,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const remitente = process.env.EMAIL_FROM?.trim();

  if (!apiKey || !remitente) {
    throw new Error('El servicio de correo no está configurado.');
  }

  const respuesta = await enviar('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: remitente,
      to: [invitacion.email],
      subject: 'Activa tu cuenta de CGB Academy',
      html: `<p>Hola ${escaparHtml(invitacion.nombre)},</p><p>Tu cuenta de CGB Academy está lista. Actívala antes de que venza el enlace:</p><p><a href="${escaparHtml(invitacion.enlaceActivacion)}">Activar cuenta</a></p>`,
    }),
    cache: 'no-store',
  });

  if (!respuesta.ok) {
    throw new Error('El proveedor no pudo enviar el correo de invitación.');
  }
}

function escaparHtml(valor: string): string {
  return valor.replace(/[&<>"']/g, caracter => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[caracter] ?? caracter);
}