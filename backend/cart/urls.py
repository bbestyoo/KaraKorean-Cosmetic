from django.urls import path
from .views import OrderAPIView, CheckoutAPIView, OrderDetailAPIView
from . import views

urlpatterns = [ 
    # Checkout endpoint
    path('api/checkout/', CheckoutAPIView.as_view(), name='checkout'),
    # Order detail endpoint
    # URL for listing and creating orders (GET and POST)
    path('api/', OrderAPIView.as_view(), name='order-list'),
    path('api/delivery/', views.DeliveryView.as_view(), name="delivery"),
    path('api/cart/', views.CartView.as_view(), name="cart"),
    path('api/cart/update/', views.CartView.as_view(), name="cart-update"),
    path('api/cart/merge/', views.MergeCartView.as_view(), name="cart-merge"),
    path('api/order/', views.OrderAPIView.as_view(), name="order"),
    # path('api/order/<str:order_id>/', views.OrderDetailAPIView.as_view(), name="order-detail"),
    path('api/coupon/', views.CouponView.as_view(), name="coupon"),
    path('api/<str:order_id>/', OrderDetailAPIView.as_view(), name='order-detail'),
]
