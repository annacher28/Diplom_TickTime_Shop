from rest_framework import viewsets, permissions, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer
from apps.cart.models import CartItem
from apps.products.models import Product

# Разрешение: админ может всё, обычный пользователь – только свои заказы
class IsAdminOrOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_admin or obj.user == request.user

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOwner]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')

    def perform_create(self, serializer):
        # Создаём заказ из содержимого корзины текущего пользователя
        cart_items = CartItem.objects.filter(user=self.request.user)
        if not cart_items.exists():
            raise serializers.ValidationError("Корзина пуста") 
        total = sum(item.total_price() for item in cart_items)
        order = serializer.save(user=self.request.user, total_price=total)
        # Переносим товары из корзины в OrderItem
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product_name=item.product.name,
                product_price=item.product.price,
                quantity=item.quantity,
                total=item.total_price()
            )
            # Уменьшаем остаток товара на складе
            product = item.product
            product.stock -= item.quantity
            product.save()
        # Очищаем корзину
        cart_items.delete()

    # Дополнительное действие для админа: обновить статус заказа
    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({'error': 'Неверный статус'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = new_status
        order.save()
        return Response({'status': order.get_status_display()})