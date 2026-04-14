from rest_framework import serializers
from .models import Order, OrderItem
from apps.users.serializers import UserSerializer  # импорт сериализатора пользователя

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('id', 'product_name', 'product_price', 'quantity', 'total')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)  # вложенный сериализатор

    class Meta:
        model = Order
        fields = ('id', 'user', 'created_at', 'updated_at', 'status', 'total_price', 'delivery_address', 'items')
        read_only_fields = ('user', 'created_at', 'total_price')