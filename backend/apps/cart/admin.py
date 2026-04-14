from django.contrib import admin
from .models import CartItem

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'quantity', 'total_price', 'added_at')
    list_filter = ('added_at',)
    search_fields = ('user__username', 'product__name')
    raw_id_fields = ('user', 'product')
    readonly_fields = ('added_at',)
    
    def total_price(self, obj):
        return obj.total_price()
    total_price.short_description = 'Общая цена'