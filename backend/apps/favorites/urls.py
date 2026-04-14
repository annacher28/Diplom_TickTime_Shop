from django.urls import path
from .views import FavoriteListCreateView, FavoriteDestroyView

urlpatterns = [
    path('', FavoriteListCreateView.as_view(), name='favorites'),
    path('<int:product_id>/', FavoriteDestroyView.as_view(), name='favorite-delete'),
]