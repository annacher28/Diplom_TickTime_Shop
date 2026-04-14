from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import CartItem
from .serializers import CartItemSerializer
from apps.products.models import Product

class CartView(generics.ListCreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        product_id = self.request.data.get('product')
        quantity = int(self.request.data.get('quantity', 1))
        product = Product.objects.get(id=product_id)
        # Если товар уже в корзине – увеличиваем количество
        cart_item, created = CartItem.objects.get_or_create(
            user=self.request.user,
            product=product,
            defaults={'quantity': quantity}
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        return Response(CartItemSerializer(cart_item).data, status=status.HTTP_200_OK)

class CartItemUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)