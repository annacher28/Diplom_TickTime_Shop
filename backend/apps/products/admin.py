from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'stock', 'created_at')
    list_display_links = ('id', 'name')
    list_editable = ('price', 'stock')   # можно менять цену и остаток прямо из списка
    search_fields = ('name', 'description')
    list_filter = ('created_at',)
    fields = ('name', 'description', 'price', 'stock', 'image')
    readonly_fields = ('created_at', 'updated_at')