# 🔧 РЕШЕНИЕ ПРОБЛЕМЫ: Route not found

## Проблема
```json
{
    "error": "Route not found",
    "path": "/register%0A",
    "method": "POST"
}
```

## ✅ Решение

Маршрут `/register` должен быть `/auth/register`

### ПРАВИЛЬНЫЙ URL для регистрации:
```
POST /auth/register
```

### ПРАВИЛЬНЫЙ URL для входа:
```
POST /auth/login
```

---

## 📝 Примеры запросов

### curl - Регистрация:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### curl - Вход:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Postman:
1. Создайте новый **POST** запрос
2. URL: `http://localhost:3000/auth/register`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "age": 25
}
```

### JavaScript/Fetch:
```javascript
const response = await fetch('http://localhost:3000/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '+1234567890',
    age: 25
  })
});

const data = await response.json();
console.log(data);
```

---

## 📚 ВСЕ МАРШРУТЫ

### Аутентификация (под /auth):
```
POST   /auth/register       - Регистрация
POST   /auth/login          - Вход
```

### Пользователи (под /users):
```
GET    /users               - Все пользователи
GET    /users/:id           - Пользователь по ID
POST   /users               - Создать пользователя
PUT    /users/:id           - Обновить пользователя
DELETE /users/:id           - Удалить пользователя
PUT    /users/change-password - Смена пароля (защищено)
```

### Продукты (под /products):
```
GET    /products            - Все продукты
GET    /products/:id        - Продукт по ID
POST   /products            - Создать продукт
PUT    /products/:id        - Обновить продукт
DELETE /products/:id        - Удалить продукт
```

### Сообщения (под /messaging):
```
POST   /messaging/email     - Отправить email (защищено)
POST   /messaging/sms       - Отправить SMS (защищено)
```

### Платежи (под /payments):
```
POST   /payments/intent     - Платежное намерение (защищено)
```

---

## 🌐 Используйте Swagger

Откройте в браузере:
```
http://localhost:3000/api-docs
```

Там вы сможете протестировать все маршруты прямо из браузера, уже с правильными путями!

---

## 💡 Обратите внимание

- Все маршруты аутентификации находятся под префиксом `/auth`
- Все маршруты пользователей находятся под префиксом `/users`
- Все маршруты продуктов находятся под префиксом `/products`
- Маршруты с 🔐 требуют JWT токен в заголовке `Authorization: Bearer TOKEN`

Если вы используете `/register` без `/auth`, сервер вернет helpful сообщение с правильным путем.
