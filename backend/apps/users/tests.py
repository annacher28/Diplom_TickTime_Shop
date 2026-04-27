from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.users.models import User

class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')  
        self.login_url = reverse('login')         

    def test_user_registration_success(self):
        """Тест успешной регистрации нового пользователя"""
        data = {
            'username': 'testuser',
            'password': 'StrongPass123',
            'password2': 'StrongPass123',
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_registration_password_mismatch(self):
        """Пароль и подтверждение не совпадают"""
        data = {
            'username': 'testuser',
            'password': 'Pass123',
            'password2': 'Pass456',
            'email': 'test@example.com'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_registration_duplicate_username(self):
        """Попытка зарегистрировать пользователя с уже существующим username"""
        User.objects.create_user(username='existing', password='pass')
        data = {
            'username': 'existing',
            'password': 'Pass123',
            'password2': 'Pass123',
            'email': 'dup@example.com'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_user_login_success(self):
        """Успешный вход с правильными учётными данными"""
        # Сначала создаём пользователя
        User.objects.create_user(username='logintest', password='secret123')
        data = {'username': 'logintest', 'password': 'secret123'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['username'], 'logintest')

    def test_login_invalid_credentials(self):
        """Вход с неверным паролем"""
        User.objects.create_user(username='logintest', password='correct')
        data = {'username': 'logintest', 'password': 'wrong'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', response.data)

    def test_login_nonexistent_user(self):
        """Вход с несуществующим username"""
        data = {'username': 'ghost', 'password': 'pass'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)