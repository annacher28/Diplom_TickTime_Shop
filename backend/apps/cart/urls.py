from django.urls import path
from .views import CartView, CartItemUpdateDeleteView

urlpatterns = [
    path('', CartView.as_view(), name='cart'),
    path('<int:pk>/', CartItemUpdateDeleteView.as_view(), name='cart-item'),
]