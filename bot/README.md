# Telegram Bot на Python 🤖

Это простой и функциональный Telegram бот на Python с использованием библиотеки `python-telegram-bot`.

## Возможности

✅ Команды: `/start`, `/help`, `/about`  
✅ Интерактивные кнопки меню  
✅ Обработка сообщений  
✅ Поддержка геолокации  
✅ Обработка ошибок и логирование  
✅ Конфигурация через `.env` файл  

## Требования

- Python 3.9+
- pip (менеджер пакетов Python)

## Установка

### 1. Клонируй проект (или скачай файлы)

```bash
cd bot
```

### 2. Установи зависимости

```bash
pip install -r requirements.txt
```

### 3. Создай файл `.env`

Скопируй `.env.example` в `.env`:

```bash
cp .env.example .env
```

### 4. Добавь токен бота

Отредактируй файл `.env` и вставь свой Telegram Bot Token:

```
TELEGRAM_BOT_TOKEN=ваш_токен_здесь
```

## Как получить Bot Token?

1. Открой Telegram
2. Найди бота [@BotFather](https://t.me/botfather)
3. Отправь `/newbot`
4. Следуй инструкциям
5. Скопируй полученный токен в `.env`

## Запуск

```bash
python main.py
```

После запуска бот будет готов к использованию. Найди своего бота в Telegram и отправь команду `/start`.

## Структура проекта

```
bot/
├── main.py              # Основной файл бота
├── requirements.txt     # Зависимости
├── .env.example        # Пример переменных окружения
├── .env                # Переменные окружения (создаётся при установке)
└── README.md           # Этот файл
```

## Команды бота

| Команда | Описание |
|---------|---------|
| `/start` | Начать работу с ботом |
| `/help` | Показать справку |
| `/about` | Информация о боте |
| `/cancel` | Отменить текущее действие |

## Кнопки меню

- 📍 Моя позиция - Отправить местоположение
- 🔔 Уведомления - Управлять уведомлениями
- ℹ️ Помощь - Получить справку
- ⚙️ Настройки - Параметры бота
- 🚀 Начать - Начать работу

## Расширение функциональности

Чтобы добавить новую команду, добавь обработчик в функции `main()`:

```python
# Добавь в функцию main()
application.add_handler(CommandHandler("mycommand", my_command))

# И создай функцию обработчик:
async def my_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text("Ответ на /mycommand")
```

## Полезные ссылки

- [Документация python-telegram-bot](https://docs.python-telegram-bot.org/)
- [BotFather](https://t.me/botfather) - для создания ботов
- [Telegram Bot API](https://core.telegram.org/bots/api)

## Лицензия

MIT

## Поддержка

По вопросам и предложениям создавай Issue или Pull Request.
