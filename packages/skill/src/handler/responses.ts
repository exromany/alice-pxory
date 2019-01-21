import { Response } from '../alice/types';
import { CustomResponse } from './customResponse';

export const serviceMessage: CustomResponse = {
  text: 'Тест',
  skip_log: true,
}

export const quitMessage: Response = {
  text: 'Пока.',
  end_session: true,
}

export const welcomeMessage: Response = {
  text: 'Привет! Этот навык помогает тестировать другие навыки, еще не опубликованные.\nТы знаешь номер навыка?',
  buttons: [{
    title: 'Регистрация навыка',
  }, {
    title: 'Как это работает?',
  }]
}

export const restoreWelcomeMessage: Response = {
  text: 'С возвращением!\nЧтобы продолжить работу с последним навыком - назови секретное слово.',
}

export const helpMessage: Response = {
  text: 'После авторизации все запросы будут пересылаться на указанный url.\nОтвет от твоего навыка будет передаваться обратно Алисе.\nПересылку запросов можно остановить коммандой "закрой навык".',
  buttons: [{
    title: 'Регистрация навыка',
  }]
}

export const askForSecretMessage: Response = {
  text: 'Теперь назови секретное слово.',
}

export const wrongSkillIdMessage: Response = {
  text: 'Не могу найти такой навык... Назови номер навыка снова.',
}

export const confirmBreakedMessage: Response = {
  text: 'Окей. Скажи номер навыка.',
}

export const missedSecretMessage: Response = {
  text: 'Секретное слово не совпало. Попробуй еще.',
}

export const missedSecretAndRestartMessage: Response = {
  text: 'Мимо. Вспомнишь - приходи.',
}

export const registrationHelpMessage: Response = {
  text: 'Чтобы добавить свой навык, просто напиши webhook URL.\nЕсли навык уже добавлен - скажи его номер.',
}

export const startRegistrationMessage: Response = {
  text: 'Укажи webhook URL - адрес, на который будут перенаправляться запросы.',
}

export const continueRegistrationMessage: Response = {
  text: 'Теперь придумай секретное слово для доступа к твоему навыку.',
}

// TODO: вывести пример того, как можно подключиться к навыку вследующий раз
export const finishRegistrationMessage = (skillId: string, secret: string): Response => {
  return {
    text: `Навык зарегистрирован.\nНомер навыка: "${skillId}".\nСекретное слово: "${secret}".\nХочешь начать пересылку запросов?`,
    buttons: [{
      title: 'Да'
    }, {
      title: 'Нет'
    }],
  }
}

export const proxyTestErrorMessage = (error: string): Response => {
  return {
    text: `Тестовый запрос к навыку вернул ошибку: "${error}"`,
  }
}

export const proxyErrorMessage = (error: string): Response => {
  return {
    text: `Запрос к навыку прервался с ошибкой: "${error}"`,
    buttons: [{
      title: 'Закрыть навык',
    }]
  }
}

export const stopProxyMessage: Response = {
  text: 'Пересылка запросов прекращена.',
}

export const getResposnse = (num: number): Response => {
  return [
    welcomeMessage,
    helpMessage,
    stopProxyMessage,
    confirmBreakedMessage,
    missedSecretMessage,
    missedSecretAndRestartMessage,
    askForSecretMessage,
    wrongSkillIdMessage,
    registrationHelpMessage,
    startRegistrationMessage,
    continueRegistrationMessage,
    quitMessage,
    finishRegistrationMessage('123', 'секрет'),
    proxyErrorMessage('Unknown error'),
    proxyTestErrorMessage('Timeout error'),
  ][num] || welcomeMessage;
}
