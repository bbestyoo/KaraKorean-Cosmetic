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
    Banner,
)
from .revalidation import revalidate_frontend, _log
import requests
from django.conf import settings
from django.db.models import Sum
import sys


@receiver(post_save, sender=Product)
def post_to_fb(sender, instance, created, **kwargs):
    if 'loaddata' in sys.argv or 'migrate' in sys.argv:
        return

    if created:
        _log("[ISR] post_to_fb triggered for new product")
        message = f"The wait is now over for {instance.name}. The product is now available on our website. Click below to check it out now!"
        page_access_token = settings.FACEBOOK_PAGE_ACCESS_TOKEN
        page_id = settings.FACEBOOK_PAGE_ID

        url = f"https://graph.facebook.com/{page_id}/feed"
        payload = {
            'message': message,
            'link': f'https://www.dgtech.com.np/product/{instance.product_id}/',
            'access_token': page_access_token
        }

        try:
            res = requests.post(url, data=payload)
            _log(f"[FB] Response: {res.json()}")
        except Exception as e:
            _log(f"[FB] Facebook API error: {e}")


def _skip_revalidation():
    return 'loaddata' in sys.argv or 'migrate' in sys.argv


def _handle_product_signal(instance, action):
    if _skip_revalidation():
        return
    product_id = getattr(instance, 'product_id', None)
    _log(f"[ISR] {action} for product={product_id}")
    revalidate_frontend(
        tags=['product'],
        paths=['/products'],
        product_ids=[product_id] if product_id else None,
    )


def _handle_global_signal(instance, action):
    if _skip_revalidation():
        return
    model_name = instance.__class__.__name__
    _log(f"[ISR] {action} on {model_name} id={instance.pk} — revalidating all products")
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


# ── Size stock → Product.stock_count ─────────────────────────────────────────
def _sync_product_stock_from_sizes(product):
    """Keep Product.stock_count equal to the sum of its sizes' stock.

    Makes per-size stock the single source of truth: the admin can no longer
    leave the product-level count drifting away from the sizes.
    """
    if product is None:
        return
    total = Size.objects.filter(product=product).aggregate(total=Sum('stock'))['total'] or 0
    if product.stock_count != total:
        Product.objects.filter(pk=product.pk).update(stock_count=total)
        product.stock_count = total


@receiver(post_save, sender=Size)
def sync_stock_on_size_save(sender, instance, **kwargs):
    if 'loaddata' in sys.argv or 'migrate' in sys.argv:
        return
    _sync_product_stock_from_sizes(instance.product)


@receiver(post_delete, sender=Size)
def sync_stock_on_size_delete(sender, instance, **kwargs):
    if 'loaddata' in sys.argv or 'migrate' in sys.argv:
        return
    _sync_product_stock_from_sizes(instance.product)


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


# ── Banner (affects every page's promo bar) ──────────────────────────────────
def _handle_banner_signal(instance, action):
    if _skip_revalidation():
        return
    _log(f"[ISR] {action} on Banner id={instance.pk} — revalidating home page")
    revalidate_frontend(tags=['banner'], paths=['/'])


@receiver(post_save, sender=Banner)
def revalidate_banner_save(sender, instance, **kwargs):
    _handle_banner_signal(instance, 'Banner saved')

@receiver(post_delete, sender=Banner)
def revalidate_banner_delete(sender, instance, **kwargs):
    _handle_banner_signal(instance, 'Banner deleted')
