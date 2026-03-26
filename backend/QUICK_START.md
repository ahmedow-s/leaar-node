# 🚀 Быстрый старт Leaar API

## ✅ Что было сделано:

1. **Исправлены все файлы:**
   - `index.js` - добавлена Swagger документация
   - `package.json` - добавлен swagger-ui-express
   - Все контроллеры (users.js, products.js) уже исправлены

2. **Добавлена Swagger документация:**
   - `swagger.json` - полная документация всех endpoints
   - Доступна на: `http://localhost:3000/api-docs`

3. **Создана Postman коллекция:**
   - `Leaar_API_Postman.json` - готовая к импорту в Postman

4. **Установлены зависимости:**
   - Все npm пакеты установлены ✅

## 📋 Подключение MongoDB

### Быстрый способ (локально):

```bash
# 1. Установите MongoDB Community
# https://www.mongodb.com/try/download/community

# 2. Запустите MongoDB (команда в терминале)
mongod

# 3. В файле .env используйте:
MONGODB_URI=mongodb://localhost:27017/myapp
```

### Облачный способ (MongoDB Atlas):

```bash
# 1. Создайте аккаунт: https://www.mongodb.com/cloud/atlas
# 2. Создайте бесплатный кластер (M0)
# 3. Получите строку подключения
# 4. В файле .env используйте:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myapp
```

## ▶️ Запуск сервера

```bash
cd backend
npm start
```

Вы увидите:
```
✅ Connected to MongoDB
🚀 Server is running at http://localhost:3000
📚 Swagger docs: http://localhost:3000/api-docs
```

## 🔗 Используйте API

**Swagger (в браузере):**
```
http://localhost:3000/api-docs
```

**Postman:**
1. Импортируйте `Leaar_API_Postman.json`
2. Используйте переменные `{{TOKEN}}`, `{{USER_ID}}`, `{{PRODUCT_ID}}`

**curl пример:**
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 📁 Все файлы готовы:

✅ `index.js` - исправлен с Swagger  
✅ `swagger.json` - создан  
✅ `Leaar_API_Postman.json` - обновлен  
✅ `package.json` - обновлен с swagger-ui-express  
✅ `SETUP_INSTRUCTIONS.md` - подробная инструкция  
✅ `users.js` - исправлен  
✅ `products.js` - исправлен  
✅ npm зависимости - установлены  

## 🔐 Примечание о переменных окружения

Убедитесь, что `.env` файл содержит:
- `JWT_SECRET` - секретный ключ для токенов
- `MONGODB_URI` - адрес MongoDB
- `EMAIL_USER`, `EMAIL_PASS` - для отправки email
- `TWILIO_*` - для SMS
- `STRIPE_SECRET_KEY` - для платежей
