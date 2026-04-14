from rest_framework import serializers
from .models import Favorite
from apps.products.serializers import ProductSerializer

class FavoriteSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source='product', read_only=True)  # вложенный товар

    class Meta:
        model = Favorite
        fields = ('id', 'user', 'product', 'product_detail', 'created_at')
        read_only_fields = ('user',)