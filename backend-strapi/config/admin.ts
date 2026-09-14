import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  // Precisa incluir o prefixo de PUBLIC_URL (ex: /backend) — se for apenas
  // "/admin", o Strapi resolve a URL absoluta do admin a partir da raiz do
  // domínio e ignora o subpath, quebrando redirects como o de logout.
  url: env('PUBLIC_URL', '') ? `${env('PUBLIC_URL')}/admin` : '/admin',
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});

export default config;
