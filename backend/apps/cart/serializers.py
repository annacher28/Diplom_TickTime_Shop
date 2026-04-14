from rest_framework import serializers
from .models import CartItem
from apps.products.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source='product', read_only=True)
    total = serializers.DecimalField(source='total_price', read_only=True, max_digits=10, decimal_places=2)

    class Meta:
        model = CartItem
        fields = ('id', 'product', 'product_detail', 'quantity', 'total', 'added_at')
        read_only_fields = ('user',)