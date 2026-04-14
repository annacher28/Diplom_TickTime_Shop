from rest_framework import viewsets, permissions
from .models import Product
from .serializers import ProductSerializer

# Своё разрешение: безопасные методы (GET, HEAD, OPTIONS) доступны всем,
# а остальные – только админам.
class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.is_admin

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]