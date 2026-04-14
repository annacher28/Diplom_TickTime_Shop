from django.db import models
from apps.users.models import User
from apps.products.models import Product

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')   # один пользователь – один товар в избранном

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"