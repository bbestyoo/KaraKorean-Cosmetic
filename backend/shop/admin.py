from django.contrib import admin
from import_export.admin import ImportExportModelAdmin

from .models import (
    Product,
    Comment,
    Repliess,
    ProductImage,
    Rating,
    Brand,
    Series,
    Category,
    SubCategory,
    ProductAttribute,
    Color,
    Variant,
    Size,
    SizeColorStock,
)

from .resources import (
    ProductResource,
    ProductAttributeResource,
    ProductImageResource,
)


# =========================
# Inlines
# =========================

class ColorInline(admin.TabularInline):
    model = Color
    extra = 0


class VariantInline(admin.TabularInline):
    model = Variant
    extra = 0


class SizeInline(admin.TabularInline):
    model = Size
    extra = 1
    fields = ["name", "price_adjustment"]


class SizeColorStockInline(admin.TabularInline):
    model = SizeColorStock
    extra = 1
    fields = ["size", "color", "stock"]
    raw_id_fields = ["size", "color"]


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0


class RatingInline(admin.TabularInline):
    model = Rating
    extra = 0


class AttributeInline(admin.TabularInline):
    model = ProductAttribute
    extra = 0


# =========================
# Admin Classes
# =========================

@admin.register(Product)
class ProductsAdmin(ImportExportModelAdmin):
    resource_class = ProductResource

    inlines = [
        ColorInline,
        VariantInline,
        SizeInline,
        ProductImageInline,
        RatingInline,
        AttributeInline,
    ]

    list_display = [
        "name",
        "category",
        "brand",
        "price",
        "featured",
        "best_seller",
        "trending",
    ]

    search_fields = [
        "name",
        "seo_friendly_name",
        "product_id",
    ]

    list_filter = [
        "category",
        "brand",
        "featured",
        "best_seller",
        "trending",
    ]


@admin.register(Color)
class ColorAdmin(ImportExportModelAdmin):
    model = Color
    resource_class = ProductAttributeResource


@admin.register(Variant)
class VariantAdmin(ImportExportModelAdmin):
    model = Variant
    resource_class = ProductAttributeResource


@admin.register(Size)
class SizeAdmin(ImportExportModelAdmin):
    model = Size
    resource_class = ProductAttributeResource


@admin.register(SizeColorStock)
class SizeColorStockAdmin(ImportExportModelAdmin):
    model = SizeColorStock
    resource_class = ProductAttributeResource

    list_display = [
        "product",
        "size",
        "color",
        "stock",
    ]


@admin.register(ProductImage)
class ProductImageAdmin(ImportExportModelAdmin):
    model = ProductImage
    resource_class = ProductImageResource


@admin.register(Brand)
class BrandAdmin(ImportExportModelAdmin):
    model = Brand
    resource_class = ProductAttributeResource


@admin.register(Series)
class SeriesAdmin(ImportExportModelAdmin):
    model = Series
    resource_class = ProductAttributeResource


@admin.register(Category)
class CategoryAdmin(ImportExportModelAdmin):
    model = Category
    resource_class = ProductAttributeResource


@admin.register(SubCategory)
class SubCategoryAdmin(ImportExportModelAdmin):
    model = SubCategory
    resource_class = ProductAttributeResource


@admin.register(ProductAttribute)
class ProductAttributeAdmin(ImportExportModelAdmin):
    model = ProductAttribute
    resource_class = ProductAttributeResource


# =========================
# Simple Registrations
# =========================

admin.site.register(Comment)
admin.site.register(Repliess)