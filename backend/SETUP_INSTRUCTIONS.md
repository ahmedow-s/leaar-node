# Leaar API - Инструкции по Настройке

## 1. Установка зависимостей

Перейдите в папку backend и установите зависимости:

```bash
cd backend
npm install
```

## 2. Подключение MongoDB

### Вариант А: Локальное подключение (Windows)

1. Установите MongoDB:
   - Скачайте с https://www.mongodb.com/try/download/community
   - Установите с опцией "Install MongoDB as a Service"

2. Запустите MongoDB:
```bash
# Если установлен как сервис, он запустится автоматически
# Или запустите вручную:
mongod
```

3. В файле `.env` используйте:
```
MONGODB_URI=mongodb://localhost:27017/myapp
```

### Вариант Б: MongoDB Atlas (облако)

1. Создайте аккаунт на https://www.mongodb.com/cloud/atlas

2. Создайте бесплатный кластер (M0)

3. Получите строку подключения вида:
```
mongodb+srv://username:password@cluster.mongodb.net/myapp
```

4. Обновите `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myapp
```

## 3. Настройка переменных окружения

Отредактируйте файл `.env`:

```env
# JWT секрет для токенов аутентификации
JWT_SECRET=your_super_secret_key_12345

# MongoDB URL
MONGODB_URI=mongodb://localhost:27017/myapp

# Email настройки (для nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Twilio для SMS
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Stripe для платежей
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

## 4. Запуск сервера

```bash
npm start
```

Вы должны увидеть:
```
✅ Connected to MongoDB
🚀 Server is running at http://localhost:3000
📚 Swagger docs: http://localhost:3000/api-docs
```

## 5. Swagger документация

Откройте в браузере:
```
http://localhost:3000/api-docs
```

Здесь вы можете протестировать все API endpoints прямо из браузера.

## 6. Использование Postman

### Импорт коллекции:

1. Откройте Postman
2. Нажмите "Import"
3. Выберите файл `Leaar_API_Postman.json`
4. Коллекция загрузится со всеми примерами

### Установка переменных в Postman:

1. Откройте коллекцию "Leaar API"
2. Перейдите на вкладку "Variables"
3. Заполните переменные:
   - `TOKEN` - токен из ответа /login
   - `USER_ID` - ID пользователя
   - `PRODUCT_ID` - ID продукта

### Рабочий процесс в Postman:

1. **Зарегистрируйтесь** (POST /register)
   - Отправьте данные пользователя
   - Получите токен в ответе
   - Скопируйте токен в переменную {{TOKEN}}

2. **Или войдите** (POST /login)
   - Используйте существующие email/пароль
   - Получите токен

3. **Создайте продукт** (POST /products)
   - Отправьте данные продукта
   - Скопируйте ID в переменную {{PRODUCT_ID}}

4. **Отправьте защищенный запрос** (например, PUT /users/change-password)
   - Автоматически подставится заголовок Authorization с {{TOKEN}}

## 7. Примеры запросов

### Регистрация:
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "age": 25
  }'
```

### Логин:
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Получить пользователя (замените ID):
```bash
curl -X GET http://localhost:3000/users/USER_ID_HERE
```

### Создать продукт:
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 999.99,
    "description": "High-performance laptop",
    "category": "Electronics"
  }'
```

### Защищенный запрос (с токеном):
```bash
curl -X PUT http://localhost:3000/users/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "oldPassword": "password123",
    "newPassword": "newPassword456"
  }'
```

## 8. Структура проекта

```
backend/
├── index.js              # Главный файл с маршрутами
├── swagger.json          # Swagger документация
├── package.json          # Зависимости
├── .env                  # Переменные окружения
├── src/
│   ├── config/
│   │   └── db.js        # Конфиг MongoDB
│   ├── models/
│   │   ├── userModel.js
│   │   └── productModel.js
│   ├── users/
│   │   ├── auth.js      # Аутентификация
│   │   ├── users.js     # Контроллеры пользователей
│   │   └── userModel.js
│   ├── products/
│   │   ├── products.js  # Контроллеры продуктов
│   │   └── productModel.js
│   └── utils/
│       ├── emailService.js
│       ├── smsService.js
│       ├── payment.js
│       └── validation.js
└── Leaar_API_Postman.json  # Коллекция Postman
```

## 9. Решение проблем

### MongoDB не подключается:
- Убедитесь, что mongod запущен
- Проверьте MONGODB_URI в .env
- Для MongoDB Atlas - добавьте IP адрес в whitelist

### Ошибка "JWT_SECRET is not defined":
- Проверьте, что .env файл существует
- Убедитесь, что JWT_SECRET задан

### Ошибка модуля не найден:
- Выполните `npm install` заново
- Удалите папку node_modules и package-lock.json
- Запустите `npm install` снова

## 10. Готово!

Теперь ваш API полностью настроен и готов к использованию:
- ✅ MongoDB подключена
- ✅ Swagger документация доступна
- ✅ Postman коллекция готова
- ✅ Все маршруты работают
