from django.db import models
from django.contrib.auth.models import AbstractUser

# AbstractUser – это готовая "заготовка" пользователя с логином, паролем, email.
# Мы её расширяем, добавляя поле role (роль) и телефон с адресом.
class User(AbstractUser):
    # Выбор ролей: первый элемент в кортеже – значение в БД, второй – человеческое имя
    ROLE_CHOICES = (
        ('user', 'Обычный пользователь'),
        ('admin', 'Администратор'),
    )
    # Поле role: по умолчанию 'user'
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    # Дополнительные поля для личного кабинета
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    # Это свойство (удобно проверять, админ ли пользователь)
    @property
    def is_admin(self):
        return self.role == 'admin' or self.is_superuser

    def __str__(self):
        return self.username