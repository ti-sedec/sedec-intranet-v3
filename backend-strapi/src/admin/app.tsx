import type { StrapiApp } from '@strapi/strapi/admin';
import logo from './extensions/logo.svg';
import favicon from '../../favicon.png';

// O Strapi lê o idioma do admin de localStorage e cai para "en" quando não há
// valor salvo, então definimos pt-BR como padrão para quem nunca escolheu.
try {
  if (!window.localStorage.getItem('strapi-admin-language')) {
    window.localStorage.setItem('strapi-admin-language', 'pt-BR');
  }
} catch {
  // localStorage indisponível (modo privado etc.): mantém o padrão do Strapi
}

export default {
  config: {
    locales: ['pt-BR'],
    // Logo da tela de login e do menu lateral
    auth: { logo },
    menu: { logo },
    head: { favicon },
    // Textos da tela de login (sobrescrevem as traduções padrão)
    translations: {
      'pt-BR': {
        'Auth.form.welcome.title': 'Bem-vindo ao SEDEC.NEWS',
        'Auth.form.welcome.subtitle': 'Acesse o painel administrativo com sua conta',
        'app.components.LeftMenu.navbrand.title': 'SEDEC.NEWS',
        'app.components.LeftMenu.navbrand.workplace': 'Painel administrativo',
      },
    },
    // Esconde as notificações de novidades da Strapi
    notifications: { releases: false },
    tutorials: false,
  },
  bootstrap(_app: StrapiApp) {},
};
