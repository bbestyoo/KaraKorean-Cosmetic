import sys
from django.db import models
from userauth.models import User
import uuid
from datetime import date
from django.conf import settings
from django.utils import timezone
from django.db.models import Avg
from django.utils.text import slugify
from ckeditor.fields import RichTextField


class Product(models.Model):
    # product_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product_id = models.SlugField(primary_key=True, unique=True,blank=True,editable=False)
    name = models.CharField(max_length=300)
    seo_friendly_name = models.CharField(max_length=200, blank=True, null=True)
    category = models.ForeignKey('Category', on_delete=models.CASCADE,null=True, related_name='products')
    sub_category = models.ForeignKey('SubCategory', on_delete=models.CASCADE,null=True,blank=True, related_name='products')
    brand = models.ForeignKey('Brand', on_delete=models.CASCADE,null=True, related_name='products')
    # series = models.ForeignKey('Series', on_delete=models.CASCADE,null=True,blank=True, related_name='products')   
    deal = models.BooleanField(default=False)
    old_price = models.FloatField(null=True,blank=True)
    before_deal_price = models.FloatField(null=True,blank=True)
    price = models.IntegerField(default=0)
    description= RichTextField()
    meta_description = models.TextField(blank=True)
    meta_keywords = models.TextField(blank=True)
    published_date = models.DateField(default=date.today)
    trending = models.BooleanField(default=False)
    best_seller = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    def save(self, *args, **kwargs):
        if not self.product_id:
            # Use seo_friendly_name if it exists, otherwise use name
            slug_source = self.seo_friendly_name if self.seo_friendly_name else self.name
            self.product_id = slugify(slug_source)
            original_id = self.product_id
            num = 1
            while Product.objects.filter(product_id=self.product_id).exists():
                self.product_id = f"{original_id}-{num}"
                num += 1
        super().save(*args, **kwargs)

class Color(models.Model):
    name = models.CharField(max_length=50)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='colors')
    hex = models.CharField(max_length=7, blank=True, null=True)  # e.g., #FFFFFF

    def __str__(self):
        return f"{self.product.name} - {self.name}"

class Variant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    name = models.CharField(max_length=100)
    additional_price = models.FloatField(default=0)

    def __str__(self):
        return f"{self.product.name} - {self.name}"

class Size(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='sizes')
    name = models.CharField(max_length=50)  # e.g., XS, S, M, L, XL, XXL
    price_adjustment = models.FloatField(default=0)  # Additional cost for this size, if any

    class Meta:
        unique_together = ['product', 'name']

    def __str__(self):
        return f"{self.product.name} - {self.name}"

class SizeColorStock(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='size_color_stocks')
    size = models.ForeignKey(Size, on_delete=models.CASCADE, related_name='color_stocks')
    color = models.ForeignKey(Color, on_delete=models.CASCADE, related_name='size_stocks', null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ['product', 'size', 'color']

    def __str__(self):
        color_name = self.color.name if self.color else 'No Color'
        return f"{self.product.name} - {self.size.name} - {color_name} ({self.stock})"

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to='shop/images', default='')
    color = models.ForeignKey(Color, on_delete=models.CASCADE, related_name='images', null=True, blank=True)
    
    def __str__(self):
        return f"Image for {self.product.name} and color {self.color.name if self.color else 'N/A'}"
    
class ProductAttribute(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='attributes')
    attribute = models.CharField(max_length=50, blank=True, null=True)
    value = models.TextField(max_length=200,blank=True, null=True)


class Rating(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(default=0, choices=[(i, str(i)) for i in range(1, 6)])
    comment = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='shop/images', blank=True, null=True)

    class Meta:
        unique_together = ('product', 'user')  # Ensure each user can only rate a product once

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='comments', on_delete=models.CASCADE)
    text = models.CharField(max_length=100)
    published_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.text


class Repliess(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, related_name='replies', on_delete=models.CASCADE)#very important is related name
    text = models.CharField(max_length=100)
    published_date = models.DateField(auto_now_add=True)

class Brand(models.Model):
    name = models.CharField(max_length=50)
    def __str__(self):
        return self.name
    
class Series(models.Model):
    name = models.CharField(max_length=50)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='series')
    category = models.ForeignKey('Category', on_delete=models.CASCADE, related_name='series')
    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=50)
    def __str__(self):
        return self.name
    
class SubCategory(models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    def __str__(self):
        return self.name
    
