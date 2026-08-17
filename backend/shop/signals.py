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


def _handle_product_signal(instance, action):
    if _skip_revalidation():
        return
    product_id = getattr(instance, 'product_id', None)
    print(f"[ISR] {action} for product={product_id}")
    revalidate_frontend(
        tags=['product'],
        paths=['/products'],
        product_ids=[product_id] if product_id else None,
    )


def _handle_global_signal(instance, action):
    if _skip_revalidation():
        return
    model_name = instance.__class__.__name__
    print(f"[ISR] {action} on {model_name} id={instance.pk} — revalidating all products")
    revalidate_frontend(tags=['product'], paths=['/products'])


# ── Product ──────────────────────────────────────────────────────────────────
@receiver(post_save, sender=Product)
def revalidate_product_save(sender, instance, **kwargs):
    _handle_product_signal(instance, 'product saved')

@receiver(post_delete, sender=Product)
def revalidate_product_delete(sender, instance, **kwargs):
    _handle_product_signal(instance, 'product deleted')


# ── Per-product child models (each registered individually) ───────────────────
_child_models = [Variant, Size, ProductImage, ProductAttribute, Rating]

def _make_child_save_handler(model):
    def handler(sender, instance, **kwargs):
        _handle_product_signal(instance, f'{model.__name__} saved')
    handler.__name__ = f'revalidate_{model.__name__.lower()}_save'
    return handler

def _make_child_delete_handler(model):
    def handler(sender, instance, **kwargs):
        _handle_product_signal(instance, f'{model.__name__} deleted')
    handler.__name__ = f'revalidate_{model.__name__.lower()}_delete'
    return handler

for _model in _child_models:
    post_save.connect(_make_child_save_handler(_model), sender=_model)
    post_delete.connect(_make_child_delete_handler(_model), sender=_model)


# ── Global models (affect every product listing) ─────────────────────────────
_global_models = [Category, SubCategory, Brand, UseCase, SkinType, Combo, Concern]

def _make_global_save_handler(model):
    def handler(sender, instance, **kwargs):
        _handle_global_signal(instance, f'{model.__name__} saved')
    handler.__name__ = f'revalidate_{model.__name__.lower()}_save'
    return handler

def _make_global_delete_handler(model):
    def handler(sender, instance, **kwargs):
        _handle_global_signal(instance, f'{model.__name__} deleted')
    handler.__name__ = f'revalidate_{model.__name__.lower()}_delete'
    return handler

for _model in _global_models:
    post_save.connect(_make_global_save_handler(_model), sender=_model)
    post_delete.connect(_make_global_delete_handler(_model), sender=_model)
