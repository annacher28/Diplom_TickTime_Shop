from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)   # автоматически создаст /products/, /products/<id>/

urlpatterns = [
    path('', include(router.urls)),
]