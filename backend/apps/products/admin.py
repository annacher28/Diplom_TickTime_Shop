from django.contrib import admin
from .models import Product, ProductImage

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'order')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'stock', 'created_at')
    inlines = [ProductImageInline]
    list_display_links = ('id', 'name')
    list_editable = ('price', 'stock')   # можно менять цену и остаток прямо из списка
    search_fields = ('name', 'description')
    list_filter = ('created_at',)
    fields = ('name', 'description', 'price', 'stock', 'image', 'article', 'country', 'type_execution', 'collection', 'case_material', 'dial', 'bracelet')
    readonly_fields = ('created_at', 'updated_at')