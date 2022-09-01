import { GupshupPartnerApi } from './partner';

export * from './client';
export * from './partner';
export * from './types';

(async () => {
  try {
    const app = new GupshupPartnerApi('lb-solutions@yandex.ru', 'C8D4AcC^vQg2eF26wtpAfZN#kTA');
    console.log(
      'app',
      await app.applyForTemplates(
        'sk_3369715d19f142dd948384684aba5424',
        '4e83dc9d-aa5d-485f-8607-31d2db029489',
        {
          buttons: [
            {
              type: 'QUICK_REPLY',
              text: 'Ок',
            },
          ],
          templateType: 'TEXT',
          category: 'TRANSACTIONAL',
          content: '{{1}}, ваш заказ {{2}} готов к выдаче.',
          elementName: 'deliveryupdatev4',
          enableSample: true,
          example: 'Дмитрий, ваш заказ 5039781571557957 готов к выдаче.',
          languageCode: 'ru',
          vertical: 'delivery',
        },
      ),
    );
  } catch (e) {
    console.log(e.response.status, e.response?.data ?? e);
  }
})();
