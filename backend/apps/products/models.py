from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200)           # название
    description = models.TextField()                  # описание
    price = models.DecimalField(max_digits=10, decimal_places=2)  # цена
    stock = models.PositiveIntegerField(default=0)    # количество на складе
    image = models.ImageField(upload_to='products/', blank=True, null=True)  # картинка
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name