from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):   # чтобы товары заказа отображались внутри заказа
    model = OrderItem
    extra = 0
    readonly_fields = ('product_name', 'product_price', 'quantity', 'total')
    can_delete = False

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'total_price', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'delivery_address')
    readonly_fields = ('created_at', 'updated_at', 'total_price')
    list_editable = ('status',)   # можно менять статус прямо из списка заказов
    inlines = [OrderItemInline]
    fieldsets = (
        (None, {'fields': ('user', 'status', 'total_price', 'delivery_address')}),
        ('Даты', {'fields': ('created_at', 'updated_at')}),
    )