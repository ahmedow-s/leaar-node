#!/usr/bin/env node

// test-api.js - Скрипт для быстрого тестирования API

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Функция для отправки запроса
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body),
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Тесты
async function runTests() {
  console.log('\n🧪 ТЕСТИРОВАНИЕ API Leaar\n');
  console.log('='.repeat(50));

  try {
    // Тест 1: Получить информацию об API
    console.log('\n✅ Тест 1: GET /');
    const root = await makeRequest('GET', '/');
    console.log('Статус:', root.status);
    console.log('Сообщение:', root.data.message);

    // Тест 2: Регистрация
    console.log('\n✅ Тест 2: POST /auth/register');
    const register = await makeRequest('POST', '/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Статус:', register.status);
    if (register.status === 201) {
      console.log('✅ Пользователь создан:', register.data.user?.email);
      var token = register.data.token;
      console.log('✅ Получен токен:', token?.substring(0, 20) + '...');
    } else {
      console.log('Ошибка:', register.data?.error);
    }

    // Тест 3: Получить все пользователей
    console.log('\n✅ Тест 3: GET /users');
    const users = await makeRequest('GET', '/users');
    console.log('Статус:', users.status);
    console.log('Пользователей:', users.data?.length || 0);

    // Тест 4: Создать продукт
    console.log('\n✅ Тест 4: POST /products');
    const product = await makeRequest('POST', '/products', {
      name: 'Test Laptop',
      price: 999.99,
      description: 'A test laptop',
      category: 'Electronics'
    });
    console.log('Статус:', product.status);
    if (product.status === 201) {
      console.log('✅ Продукт создан:', product.data.name);
    } else {
      console.log('Ошибка:', product.data?.error);
    }

    // Тест 5: Получить все продукты
    console.log('\n✅ Тест 5: GET /products');
    const products = await makeRequest('GET', '/products');
    console.log('Статус:', products.status);
    console.log('Продуктов:', products.data?.length || 0);

    // Тест 6: Неправильный маршрут (должен быть helpful)
    console.log('\n✅ Тест 6: POST /register (неправильный путь)');
    const wrongRoute = await makeRequest('POST', '/register', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Статус:', wrongRoute.status);
    console.log('Подсказка:', wrongRoute.data?.error);

    console.log('\n' + '='.repeat(50));
    console.log('\n🎉 Все тесты завершены!\n');
    console.log('📚 Swagger: http://localhost:3000/api-docs');
    console.log('');

  } catch (error) {
    console.error('\n❌ Ошибка при тестировании:', error.message);
    console.error('\nУбедитесь, что сервер запущен:');
    console.error('  cd backend');
    console.error('  node index.js');
  }
}

runTests();
