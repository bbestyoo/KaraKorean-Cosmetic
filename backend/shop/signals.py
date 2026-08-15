from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import (
    Product,
    Variant,
    Size,
    ProductImage,
    ProductAttribute,
    Rating,
    Category,
    SubCategory,
    Brand,
    UseCase,
    SkinType,
    Combo,
    Concern,
)
from .revalidation import revalidate_frontend
import requests
from django.conf import settings
import sys

@receiver(post_save, sender=Product)
def post_to_fb(sender, instance, created, **kwargs):
    # --- FIX: skip this signal during loaddata / migrate ---
    if 'loaddata' in sys.argv or 'migrate' in sys.argv:
        return

    if created:
        print("HERE")
        message = f"The wait is now over for {instance.name}. The product is now available on our website. Click below to check it out now!"
        page_access_token = settings.FACEBOOK_PAGE_ACCESS_TOKEN
        print(page_access_token)
        page_id = settings.FACEBOOK_PAGE_ID
        print(page_id)

        url = f"https://graph.facebook.com/{page_id}/feed"
        payload = {
            'message': message,
            'link': f'https://www.dgtech.com.np/product/{instance.product_id}/',
            'access_token': page_access_token
        }

        try:
            res = requests.post(url, data=payload)
            print(res.json())
        except Exception as e:
            print("Facebook API error:", e)


def _skip_revalidation():
    return 'loaddata' in sys.argv or 'migrate' in sys.argv


# Every product page fetch is tagged `product`, so invalidating that single tag
# refreshes the listing page, the sitemap and every product detail page (lazily,
# on the next request). We also pass the affected product paths explicitly.
@receiver([post_save, post_delete], sender=Product)
def revalidate_product(sender, instance, **kwargs):
    if _skip_revalidation():
        return
    revalidate_frontend(
        tags=['product'],
        paths=['/products'],
        product_ids=[instance.product_id],
    )


# Models that belong to a single product. Their FK points at Product whose PK is
# product_id, so instance.product_id is the product's slug.
@receiver([post_save, post_delete], sender=[Variant, Size, ProductImage, ProductAttribute, Rating])
def revalidate_product_child(sender, instance, **kwargs):
    if _skip_revalidation():
        return
    revalidate_frontend(
        tags=['product'],
        paths=['/products'],
        product_ids=[instance.product_id],
    )


# Models that affect every product (renaming a category or brand changes the
# listing and all detail pages). A single tag invalidation handles it.
@receiver([post_save, post_delete], sender=[Category, SubCategory, Brand, UseCase, SkinType, Combo, Concern])
def revalidate_all_products(sender, instance, **kwargs):
    if _skip_revalidation():
        return
    revalidate_frontend(tags=['product'], paths=['/products'])
