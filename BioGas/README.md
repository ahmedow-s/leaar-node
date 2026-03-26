# BioGas Authentication Backend

Полнофункциональный бэкенд для аутентификации на Node.js с Express и MongoDB.

## 🚀 Функции

- ✅ Регистрация пользователей
- ✅ Аутентификация (Login/Logout)
- ✅ JWT токены (Access & Refresh)
- ✅ Защита маршрутов
- ✅ Смена пароля
- ✅ Обновление профиля
- ✅ Удаление аккаунта
- ✅ Валидация данных
- ✅ Хеширование паролей (bcryptjs)
- ✅ CORS поддержка

## 📋 Требования

- Node.js >= 14.0
- MongoDB >= 4.0
- npm или yarn

## 🔧 Установка

### 1. Клонирование проекта
```bash
cd BioGas
npm install
```

### 2. Переменные окружения
Создайте файл `.env` (или используйте существующий):

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/biogas
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=24h
REFRESH_TOKEN_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### 3. Запуск сервера
```bash
npm start
```

Сервер запустится на `http://localhost:5000`

## 🚀 Деплой на Vercel (Production-ready)

1. Установите Vercel CLI и авторизуйтесь:
```bash
npm i -g vercel
vercel login
```

2. Убедитесь, что в `./vercel.json` присутствует конфигурация (есть в проекте).

3. В Vercel добавьте переменные окружения (Project Settings → Environment Variables):
- `MONGODB_URI` (строка подключения к MongoDB Atlas)
- `JWT_SECRET`
- `ADMIN_SECRET`
- `CORS_ORIGIN` (ваш фронтенд URL)

4. Запустите деплой из корня проекта:
```bash
vercel --prod
```

После успешного деплоя ваша API будет доступна по адресу, который вернёт Vercel, и Swagger — по `<YOUR_URL>/api-docs`.

### Примечания по безопасности
- Никогда не коммитите `.env` в репозиторий. 

- Меняйте пароли по умолчанию и `ADMIN_SECRET` перед деплоем.
- Используйте MongoDB Atlas с IP whitelist и настроенными пользователями.

## 📡 API Endpoints

### Аутентификация
sd
#### Регистрация
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "phone": "+1234567890",
  "age": 25
}

Response: 201
{
  "success": true,
  "message": "User registered successfully",
  "user": {...},
  "accessToken": "...",
  "refreshToken": "..."
}
```

#### Вход
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200
{
  "success": true,
  "message": "Logged in successfully",
  "user": {...},
  "accessToken": "...",
  "refreshToken": "..."
}
```

#### Обновление токена
```
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "..."
}

Response: 200
{
  "success": true,
  "accessToken": "...",
  "expiresIn": "24h"
}
```

#### Выход
```
POST /api/auth/logout
Authorization: Bearer YOUR_TOKEN

Response: 200
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Профиль пользователя

#### Получить профиль
```
GET /api/users/me
Authorization: Bearer YOUR_TOKEN

Response: 200
{
  "success": true,
  "user": {...}
}
```

#### Обновить профиль
```
PUT /api/users/update-profile
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "+9876543210",
  "age": 26,
  "bio": "Bio text",
  "avatar": "avatar_url"
}

Response: 200
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {...}
}
```

#### Смена пароля
```
PUT /api/users/change-password
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "oldPassword": "password123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}

Response: 200
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Удаление аккаунта
```
DELETE /api/users/delete-account
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "password": "password123"
}

Response: 200
{
  "success": true,
  "message": "Account deleted successfully"
}
```

## 🔐 Использование токенов

Добавьте токен в заголовок Authorization:

```javascript
const token = localStorage.getItem('accessToken');

fetch('/api/users/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

## 📁 Структура проекта

```
BioGas/
├── src/
│   ├── config/
│   │   └── db.js              # Подключение к MongoDB
│   ├── models/
│   │   └── User.js            # Модель пользователя
│   ├── middleware/
│   │   └── auth.js            # Middleware аутентификации
│   ├── routes/
│   │   ├── authRoutes.js      # Маршруты аутентификации
│   │   └── userRoutes.js      # Маршруты профиля
│   └── utils/
│       ├── tokenService.js    # Сервис токенов
│       └── validation.js      # Валидация данных
├── index.js                    # Главный файл сервера
├── .env                        # Переменные окружения
├── package.json               # Зависимости
└── README.md                  # Документация
```

## 🛡️ Безопасность

- Пароли хешируются с помощью bcryptjs
- JWT токены с истечением 24 часа
- CORS настройка
- Helmet для защиты заголовков
- Валидация всех входных данных
- Защита от SQL инъекций (MongoDB)

## 🤝 Интеграция с фронтенд

### Пример с React

```javascript
// Register
const register = async (userData) => {
  const res = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await res.json();
  
  if (data.success) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  }
  return data;
};

// Login
const login = async (email, password) => {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  
  if (data.success) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  }
  return data;
};

// Get profile
const getProfile = async () => {
  const token = localStorage.getItem('accessToken');
  const res = await fetch('http://localhost:5000/api/users/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};
```

## 📝 Лицензия

ISC

## 👨‍💻 Автор

Your Name

---

**Помощь?** Создайте issue или свяжитесь с поддержкой.
#   B i o G a s - B a c k e n d 
 
 