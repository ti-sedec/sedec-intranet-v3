import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ['plugin::upload.file'],
      beforeCreate(event) {
        const { mime, size } = event.params.data;

        // Limites baseados no tipo de arquivo
        if (mime.startsWith('image/')) {
          if (size > 5 * 1024) {
            throw new Error('O tamanho da imagem não pode exceder 5MB.');
          }
        } else if (mime.startsWith('video/')) {
          if (size > 500 * 1024) {
            throw new Error('O tamanho do vídeo não pode exceder 500MB.');
          }
        } else {
          if (size > 50 * 1024) {
            throw new Error('O tamanho do documento não pode exceder 50MB.');
          }
        }
      },
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
