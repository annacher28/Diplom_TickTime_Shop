from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Favorite
from .serializers import FavoriteSerializer
from apps.products.models import Product

class FavoriteListCreateView(generics.ListCreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        product_id = self.request.data.get('product')
        product = Product.objects.get(id=product_id)
        serializer.save(user=self.request.user, product=product)

class FavoriteDestroyView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    # Удаляем по product_id (в URL передаём id товара)
    def delete(self, request, *args, **kwargs):
        product_id = kwargs.get('product_id')
        try:
            favorite = Favorite.objects.get(user=request.user, product_id=product_id)
            favorite.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Favorite.DoesNotExist:
            return Response({'error': 'Товар не в избранном'}, status=status.HTTP_404_NOT_FOUND)