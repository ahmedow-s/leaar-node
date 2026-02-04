# Backend API с пользователями, продуктами, аутентификацией, сообщениями и платежами

Этот проект - полный REST API на Node.js с Express, MongoDB, аутентификацией JWT, отправкой email/SMS и интеграцией Stripe для платежей.

## Установка

1. Установите Node.js, MongoDB, и запустите MongoDB (`mongod`).
2. Клонируйте репозиторий и перейдите в папку backend.
3. Установите зависимости: `npm install`
4. Настройте переменные в `.env` (скопируйте из примера ниже).
5. Запустите сервер: `npm start`

Сервер будет доступен на http://localhost:3000

## Переменные окружения (.env)

Создайте файл `.env` в корне backend:

```
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=mongodb://localhost:27017/myapp
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

## API Endpoints

### Аутентификация
- `POST /register` - Регистрация (body: {name, email, password, phone, age})
- `POST /login` - Логин (body: {email, password})

### Пользователи (требуют токена в заголовке Authorization: Bearer <token>)
- `GET /users/:id` - Получить пользователя по ID
- `PUT /users/:id` - Обновить пользователя
- `DELETE /users/:id` - Удалить пользователя
- `PUT /users/change-password` - Изменить пароль (body: {oldPassword, newPassword})

### Продукты
- `GET /products` - Получить все продукты
- `GET /products/:id` - Получить продукт по ID
- `POST /products` - Создать продукт
- `PUT /products/:id` - Обновить продукт
- `DELETE /products/:id` - Удалить продукт

### Сообщения (требуют токена)
- `POST /send-email` - Отправить email (body: {to, subject, text})
- `POST /send-sms` - Отправить SMS (body: {to, message})

### Платежи (требуют токена)
- `POST /create-payment-intent` - Создать платеж (body: {amount, currency})

## Структура проекта

- `index.js` - Главный сервер
- `users/` - Модели и контроллеры пользователей, аутентификация
- `products/` - Модели и контроллеры продуктов
- `utils/` - Сервисы для email, SMS, платежей
- `.env` - Переменные окружения

## Для изучения

- Изучите комментарии в коде.
- Попробуйте зарегистрироваться и получить токен.
- Используйте токен для защищенных маршрутов.
- Для платежей используйте Stripe Dashboard для тестирования.