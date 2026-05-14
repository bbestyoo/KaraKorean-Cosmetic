from django.contrib import admin
from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'color', views.ColorViewSet)
router.register(r'size', views.SizeViewSet)
router.register(r'size-color-stock', views.SizeColorStockViewSet)
router.register(r'product-image', views.ProductImageViewSet)
router.register(r'category', views.CategoryViewSet)
router.register(r'brand', views.BrandViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api/', views.GetProduct.as_view(), name='api'),
    path('api/admin/search/', views.AdminProductSearch.as_view(), name='admin_product_search'),
    path('api/tagged/', views.TaggedProductsView.as_view(), name='tagged_products'),
    path('api/deals/', views.GetDealProduct.as_view(), name='api'),
    path('api/navsearch/', views.NavSearchView.as_view(), name='search'),
    path('api/navcat/', views.NavCatView.as_view(), name='navcat'),
    path('api/search/', views.ApiSearch.as_view(), name='search'),
    path('api/recommendations/', views.RecommendationsView.as_view(), name='recommendations'),
    path('api/<slug:id>/', views.ProductSearch.as_view(), name='about_product'),
    path('api/catsearch/<str:name>/', views.CatSearch.as_view(), name='catsearch'),
    path('api/catsearch/<str:catname>/brand/<str:brandname>/', views.CatBrandSearch.as_view(), name='catbrandsearch'),
    path('api/catsearch/<str:name>/<str:series>/', views.CatSearch.as_view(), name='catsearch'),
    path('api/subcatsearch/<str:name>/', views.SubcatSearch.as_view(), name='subcatsearch'),
    path('api/comments/<str:product_id>/', views.CommentView.as_view(), name='comment'),
    path('api/replies/<int:comment_id>/', views.ReplyView.as_view(), name='comment'),
    path('api/brandsearch',views.BrandSearch.as_view(),name='brandsearch'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/rating/<str:product_id>/',views.RatingView.as_view(), name="rating"),
]
