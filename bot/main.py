import logging
import os
from dotenv import load_dotenv
import requests
import json
import time

load_dotenv()

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
API_URL = f"https://api.telegram.org/bot{TOKEN}"

if not TOKEN:
    raise ValueError("TELEGRAM_BOT_TOKEN не установлен в .env файле")


def send_message(chat_id, text, parse_mode='HTML', reply_markup=None):
    """Отправить сообщение пользователю"""
    url = f"{API_URL}/sendMessage"
    payload = {
        'chat_id': chat_id,
        'text': text,
        'parse_mode': parse_mode
    }
    if reply_markup:
        payload['reply_markup'] = reply_markup
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        return response.json()
    except Exception as e:
        logger.error(f"Ошибка при отправке сообщения: {e}")
        return None


def handle_message(message):
    """Обработать входящее сообщение"""
    chat_id = message['chat']['id']
    text = message.get('text', '')
    user_name = message['from'].get('first_name', 'Друше')
    
    if text == '/start':
        reply_markup = {
            'keyboard': [
                [{'text': '📍 Моя позиция'}, {'text': '🔔 Уведомления'}],
                [{'text': 'ℹ️ Помощь'}, {'text': '⚙️ Настройки'}],
                [{'text': '🚀 Начать'}, {'text':'Отмена '}]
            ],
            'resize_keyboard': True,
            'one_time_keyboard': False
        }
        send_message(
            chat_id,
            f'Привет, {user_name}! 👋\n\nЯ Telegram бот. Выбери, что хочешь сделать:',
            reply_markup=json.dumps(reply_markup)
        )
    
    elif text == '/help':
        help_text = (
            '<b>Доступные команды:</b>\n\n'
            '/start - Начать работу с ботом\n'
            '/help - Показать эту справку\n'
            '/about - Информация о боте\n\n'
            '<b>Кнопки меню:</b>\n'
            '📍 Моя позиция - Отправить местоположение\n'
            '🔔 Уведомления - Управление уведомлениями\n'
            'ℹ️ Помощь - Получить справку\n'
            '⚙️ Настройки - Параметры бота'
        )
        send_message(chat_id, help_text)
    
    elif text == '/about':
        about_text = (
            '<b>О боте</b>\n\n'
            'Это многофункциональный Telegram бот на Python.\n\n'
            '<b>Функции:</b>\n'
            '✅ Обработка команд\n'
            '✅ Интерактивные кнопки\n'
            '✅ Обработка сообщений\n'
            '✅ Стабильная работа'
        )
        send_message(chat_id, about_text)
    
    elif text == '📍 Моя позиция':
        send_message(chat_id, 'Отправь мне свою локацию, нажав на скрепку 📎')
    
    elif text == '🔔 Уведомления':
        reply_markup = {
            'keyboard': [
                [{'text': '✅ Включить'}, {'text': '❌ Выключить'}]
            ],
            'resize_keyboard': True,
            'one_time_keyboard': True
        }
        send_message(
            chat_id,
            'Выбери статус уведомлений:',
            reply_markup=json.dumps(reply_markup)
        )
    
    elif text == 'ℹ️ Помощь':
        help_text = (
            '<b>Доступные команды:</b>\n\n'
            '/start - Начать работу с ботом\n'
            '/help - Показать эту справку\n'
            '/about - Информация о боте'
        )
        send_message(chat_id, help_text)
    
    elif text == '⚙️ Настройки':
        send_message(chat_id, '🔧 Настройки находятся в разработке')
    
    elif text == '🚀 Начать':
        send_message(chat_id, 'Отлично! Начнем работу 🎉')

    elif text == 'Отмена ':
        send_message(chat_id, 'Действие отменено ❌')
    
    elif text == '✅ Включить':
        send_message(chat_id, 'Уведомления включены ✅')
    
    elif text == '❌ Выключить':
        send_message(chat_id, 'Уведомления выключены ❌')
    
    else:
        send_message(chat_id, f'Ты написал: {text}\n\nИспользуй команды: /help')


def get_updates(offset=0):
    """Получить обновления от Telegram"""
    url = f"{API_URL}/getUpdates"
    payload = {
        'offset': offset,
        'timeout': 30
    }
    
    try:
        response = requests.post(url, json=payload, timeout=40)
        return response.json()
    except Exception as e:
        logger.error(f"Ошибка при получении обновлений: {e}")
        return {'ok': False}


def main():
    """Основной цикл бота"""
    logger.info("Бот запущен и готов к использованию...")
    
    offset = 0
    
    while True:
        try:
            result = get_updates(offset)
            
            if not result.get('ok'):
                logger.warning("Ошибка при получении обновлений")
                time.sleep(5)
                continue
            
            updates = result.get('result', [])
            
            for update in updates:
                try:
                    offset = update['update_id'] + 1
                    message = update.get('message')
                    
                    if not message:
                        continue
                    
                    if 'text' in message:
                        handle_message(message)
                    
                except Exception as e:
                    logger.error(f"Ошибка при обработке обновления: {e}")
            
            if not updates:
                time.sleep(1)
        
        except KeyboardInterrupt:
            logger.info("Бот остановлен пользователем")
            break
        except Exception as e:
            logger.error(f"Неожиданная ошибка: {e}")
            time.sleep(5)


if __name__ == '__main__':
    main()
