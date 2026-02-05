# 📍 Структура маршрутов (Routes)

Все маршруты находятся в папке `src/routes/`

## 📁 Файлы маршрутов

### 1. `authRoutes.js` - Аутентификация
**Путь:** `src/routes/authRoutes.js`

```
POST   /auth/register      - Регистрация нового пользователя
POST   /auth/login         - Вход в систему
```

### 2. `userRoutes.js` - Пользователи
**Путь:** `src/routes/userRoutes.js`

```
GET    /users/:id                 - Получить пользователя по ID
POST   /users                     - Создать нового пользователя
PUT    /users/:id                 - Обновить пользователя
DELETE /users/:id                 - Удалить пользователя
PUT    /users/change-password     - Изменить пароль (требует токен)
```

### 3. `productRoutes.js` - Продукты
**Путь:** `src/routes/productRoutes.js`

```
GET    /products           - Получить все продукты
GET    /products/:id       - Получить продукт по ID
POST   /products           - Создать новый продукт
PUT    /products/:id       - Обновить продукт
DELETE /products/:id       - Удалить продукт
```

### 4. `messagingRoutes.js` - Сообщения
**Путь:** `src/routes/messagingRoutes.js`

```
POST   /messaging/email    - Отправить email (требует токен)
POST   /messaging/sms      - Отправить SMS (требует токен)
```

### 5. `paymentRoutes.js` - Платежи
**Путь:** `src/routes/paymentRoutes.js`

```
POST   /payments/intent    - Создать платежное намерение (требует токен)
```

## 🔗 Как используются маршруты

В `index.js` все маршруты подключаются следующим образом:

```javascript
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const messagingRoutes = require('./src/routes/messagingRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');

// Подключение маршрутов
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/messaging', messagingRoutes);
app.use('/payments', paymentRoutes);
```

## 📋 Полный список endpoints

### Аутентификация
- `POST /auth/register` - Регистрация
- `POST /auth/login` - Вход

### Пользователи
- `GET /users/:id` - Получить
- `POST /users` - Создать
- `PUT /users/:id` - Обновить
- `DELETE /users/:id` - Удалить
- `PUT /users/change-password` - Смена пароля 🔐

### Продукты
- `GET /products` - Все
- `GET /products/:id` - Один
- `POST /products` - Создать
- `PUT /products/:id` - Обновить
- `DELETE /products/:id` - Удалить

### Сообщения
- `POST /messaging/email` - Email 🔐
- `POST /messaging/sms` - SMS 🔐

### Платежи
- `POST /payments/intent` - Платеж 🔐

## 🔐 Защищенные маршруты

Маршруты отмеченные 🔐 требуют аутентификацию.

Передайте токен в заголовке:
```
Authorization: Bearer YOUR_TOKEN
```

## 📝 Примеры использования

### Регистрация
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "password": "pass123"
  }'
```

### Получить пользователя
```bash
curl http://localhost:3000/users/USER_ID
```

### Создать продукт
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 999.99
  }'
```

### Защищенный запрос (с токеном)
```bash
curl -X PUT http://localhost:3000/users/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "oldPassword": "pass123",
    "newPassword": "pass456"
  }'
```

## 🧪 Тестирование

Используйте Swagger документацию:
```
http://localhost:3000/api-docs
```

Или импортируйте коллекцию в Postman:
```
Leaar_API_Postman.json
```
