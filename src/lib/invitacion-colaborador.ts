import { createHash, randomBytes, randomUUID } from 'node:crypto';

export function crearIdentificadorColaborador(): string {
  return randomUUID();
}

export function crearInvitacionColaborador(
  colaborador: { id: string; email: string; nombre: string },
  baseUrl = 'https://app.cgb.latam',
) {
  const token = randomBytes(32).toString('base64url');
  const origen = String(baseUrl || 'https://app.cgb.latam').replace(/\/+$/, '');

  return {
    ...colaborador,
    token,
    tokenActivacion: token,
    tokenActivacionHash: createHash('sha256').update(token).digest('hex'),
    enlaceActivacion: `${origen}/login/activar?token=${encodeURIComponent(token)}`,
    expiraEn: new Date(Date.now() + 1000 * 60 * 60 * 48),
  };
}
