from django.shortcuts import render
from .models import Product, Comment, Color, Size, SizeColorStock, ProductImage, Category, Brand
from math import ceil
from .serializers import ProductSerializer, CommentSerializer, ReplySerializer, RatingSerializer, GetProductSerializer, ColorSerializer, SizeSerializer, SizeColorStockSerializer, ProductImageSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import filters, viewsets
from rest_framework import generics
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.pagination import PageNumberPagination
from django.db.models import Avg, Count, Q
from django.conf import settings
from rest_framework.permissions import IsAuthenticated


# @api_view(['GET'])
# def getProduct(request):
#     prods = Product.objects.all()
#     serializer = ProductSerializer(prods, many=True)
#     return Response(serializer.data)                  
#function based view ma image ko right path janna only relative path like / media/shop/images bata janxa so class based use grya

class CustomPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'results': data
        })


class GetProduct(APIView):
    def get(self, request, format=None):
        # Retrieve query parameters for filtering
        min_rating = request.query_params.get('min_rating')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        # Instead of a single 'ordering' value, expect multiple ordering parameters
        ordering_fields = request.query_params.getlist('ordering')
        brand = request.query_params.get('brand')
        category = request.query_params.get('category')
        # Base queryset annotated with average rating and rating count
        queryset = Product.objects.all().annotate(
            rating=Avg('ratings__rating'),
            ratings_count=Count('ratings')
        ).order_by('-product_id')
        
        # Apply filtering based on min_rating, min_price, and max_price if provided
        if min_rating:
            try:
                queryset = queryset.filter(rating__gte=float(min_rating))
            except (ValueError, TypeError):
                pass
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except (ValueError, TypeError):
                pass
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except (ValueError, TypeError):
                pass
        if brand:
            try:
                queryset = queryset.filter(brand__name__icontains=brand)
            except (ValueError, TypeError,):
                pass
        if category:
            try:
                print(category)
                queryset = queryset.filter(category__name__icontains=category)
                print(queryset)
            except (ValueError, TypeError,):
                pass
        # Apply ordering based on multiple parameters
        if ordering_fields:
            # If there's only one ordering field and it contains spaces, split it into parts.
            if len(ordering_fields) == 1 and " " in ordering_fields[0]:
                ordering_fields = ordering_fields[0].split()
            queryset = queryset.order_by(*ordering_fields)
        
        # Paginate the queryset using the custom pagination class
        paginator = CustomPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request, view=self)
        serializer = ProductSerializer(paginated_queryset, many=True, context={'request': request})
        
        # Return a paginated response
        return paginator.get_paginated_response(serializer.data)

    def post(self, request, format=None):
        # Require authentication and staff/superuser status for POST requests
        if not request.user or not request.user.is_authenticated:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({'detail': 'Only staff or admin users can create products.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ProductSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminProductSearch(APIView):
    """Search and list products with pagination for admin panel"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        # Check if user is staff/admin
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({'detail': 'Only staff or admin users can access this.'}, status=status.HTTP_403_FORBIDDEN)
        
        # Get search query parameter
        search_query = request.query_params.get('search', '').strip()
        
        # Base queryset
        queryset = Product.objects.all().order_by('-product_id')
        
        # Filter by search query if provided
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(category__name__icontains=search_query) |
                Q(brand__name__icontains=search_query)
            )
        
        # Paginate the queryset
        paginator = CustomPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request, view=self)
        serializer = ProductSerializer(paginated_queryset, many=True, context={'request': request})
        
        return paginator.get_paginated_response(serializer.data)


class GetDealProduct(APIView):

    def get(self, request, format=None):
        # Retrieve query parameters for filtering
        min_rating = request.query_params.get('min_rating')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        # Instead of a single 'ordering' value, expect multiple ordering parameters
        ordering_fields = request.query_params.getlist('ordering')
        brand = request.query_params.get('brand')
        # Base queryset annotated with average rating and rating count
        queryset = Product.objects.filter(deal=True).annotate(
            rating=Avg('ratings__rating'),
            ratings_count=Count('ratings'),
        )
        
        # Apply filtering based on min_rating, min_price, and max_price if provided
        if min_rating:
            try:
                queryset = queryset.filter(rating__gte=float(min_rating))
            except (ValueError, TypeError):
                pass
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except (ValueError, TypeError):
                pass
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except (ValueError, TypeError):
                pass
        if brand:
            try:
                queryset = queryset.filter(brand__name__icontains=brand)
            except (ValueError, TypeError,):
                pass
        # Apply ordering based on multiple parameters
        if ordering_fields:
            # If there's only one ordering field and it contains spaces, split it into parts.
            if len(ordering_fields) == 1 and " " in ordering_fields[0]:
                ordering_fields = ordering_fields[0].split()
            queryset = queryset.order_by(*ordering_fields)
        
        # Paginate the queryset using the custom pagination class
        paginator = CustomPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request, view=self)
        serializer = ProductSerializer(paginated_queryset, many=True, context={'request': request})
        
        # Return a paginated response
        return paginator.get_paginated_response(serializer.data)



class ApiSearch(generics.ListAPIView):
    serializer_class = GetProductSerializer 
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['product_id','name', 'description','brand__name','category__name','sub_category__name']
    ordering_fields = ['price']  # Add more ordering fields if needed
    pagination_class = CustomPagination

    def get_queryset(self):
        # Base queryset annotated with average rating and ratings count
        queryset = Product.objects.all().annotate(
            rating=Avg('ratings__rating'),
            ratings_count=Count('ratings')
        )   
        
        request = self.request
        # Retrieve query parameters for filtering
        min_rating = request.query_params.get('min_rating')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        brand = request.query_params.get('brand')
        ordering_fields = request.query_params.getlist('ordering')
        
        # Filter by minimum rating
        if min_rating:
            try:
                queryset = queryset.filter(rating__gte=float(min_rating))
            except (ValueError, TypeError):
                pass

        # Filter by minimum and maximum price
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except (ValueError, TypeError):
                pass
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except (ValueError, TypeError):
                pass

        # Filter by brand (case-insensitive partial match)
        if brand:
            try:
                queryset = queryset.filter(brand__name__icontains=brand)
            except (ValueError, TypeError):
                pass

        # Apply ordering if provided. If a single ordering parameter contains spaces,
        # split it into multiple fields.
        if ordering_fields:
            if len(ordering_fields) == 1 and " " in ordering_fields[0]:
                ordering_fields = ordering_fields[0].split()
            queryset = queryset.order_by(*ordering_fields)
        
        return queryset


class BrandSearch(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['brandName']
    ordering_fields = ['price']

class ProductSearch(APIView):
    
    def get(self,request,id):
        try:
            product = Product.objects.get(pk=id)
        except Product.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product,context={"request": request})
        return Response(serializer.data)

    def patch(self, request, id):
        # Require authentication and staff/superuser status
        if not request.user or not request.user.is_authenticated:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({'detail': 'Only staff or admin users can update products.'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            product = Product.objects.get(pk=id)
        except Product.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        print(request.data)
        serializer = ProductSerializer(product, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            print("ETA HAI TA")
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id):
        # Require authentication and staff/superuser status
        if not request.user or not request.user.is_authenticated:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({'detail': 'Only staff or admin users can update products.'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            product = Product.objects.get(pk=id)
        except Product.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = ProductSerializer(product, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        # Require authentication and staff/superuser status
        if not request.user or not request.user.is_authenticated:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({'detail': 'Only staff or admin users can delete products.'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            product = Product.objects.get(pk=id)
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        product.delete()
        return Response({'detail': 'Product deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


        

class CatSearch(generics.ListAPIView):
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = ['price', 'min_rating','rating','min_price','max_price']
    pagination_class = CustomPagination

    def get_queryset(self):
        cat = self.kwargs.get('name')

        min_rating = self.request.query_params.get('min_rating')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        queryset = Product.objects.filter(category__name__iexact=cat)
        queryset = queryset.annotate(
            rating=Avg('ratings__rating'),
            ratings_count=Count('ratings')
        )

        if min_rating:
            try:
                min_rating = float(min_rating)
                queryset = queryset.filter(rating__gte=min_rating)
            except (ValueError, TypeError):
                pass
        
        if min_price:
            try:
                min_price = float(min_price)
                queryset = queryset.filter(price__gte=min_price)
            except (ValueError, TypeError):
                pass
        if max_price:
            try:
                max_price = float(max_price)
                queryset = queryset.filter(price__lte=max_price)
            except (ValueError, TypeError):
                pass

        return queryset

    
class SubcatSearch(generics.ListAPIView):
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = ['price', 'min_rating','rating','min_price','max_price']
    pagination_class = CustomPagination
    
    def get_queryset(self):
        sub_cat = self.kwargs.get('name')
        min_rating = self.request.query_params.get('min_rating')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        queryset = Product.objects.filter(sub_category__iexact=sub_cat)

        queryset = queryset.annotate(
            rating=Avg('ratings__rating'),
            ratings_count=Count('ratings')
        )
        
        # Filter by minimum rating if provided
        if min_rating:
            try:
                min_rating = float(min_rating)
                queryset = queryset.filter(rating__gte=min_rating)
            except (ValueError, TypeError):
                pass
        
        if min_price:
            try:
                min_price = float(min_price)
                queryset = queryset.filter(price__gte=min_price)
            except (ValueError, TypeError):
                pass
        if max_price:
            try:
                max_price = float(max_price)
                queryset = queryset.filter(price__lte=max_price)
            except (ValueError, TypeError):
                pass

        return queryset
    
class CatBrandSearch(generics.ListAPIView):
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = ['price', 'min_rating','rating','min_price','max_price']
    pagination_class = CustomPagination

    def get_queryset(self):
        cat = self.kwargs.get('catname')
        brand = self.kwargs.get('brandname')

        
        min_rating = self.request.query_params.get('min_rating')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        if brand:
            queryset = Product.objects.filter(category__name__iexact=cat, brand__name__iexact = brand)

        else:
            queryset = Product.objects.filter(category__iexact=cat)
        queryset = queryset.annotate(
            rating=Avg('ratings__rating'),
            ratings_count=Count('ratings')
        )

        if min_rating:
            try:
                min_rating = float(min_rating)
                queryset = queryset.filter(rating__gte=min_rating)
            except (ValueError, TypeError):
                pass
        
        if min_price:
            try:
                min_price = float(min_price)
                queryset = queryset.filter(price__gte=min_price)
            except (ValueError, TypeError):
                pass
        if max_price:
            try:
                max_price = float(max_price)
                queryset = queryset.filter(price__lte=max_price)
            except (ValueError, TypeError):
                pass

        return queryset
    
class CommentView(APIView):
    def post(self, request, product_id):
        data = request.data
        product = Product.objects.get(pk=product_id)
        user = request.user  # Get the user making the request
        serializer = CommentSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save(product=product, user = user)  
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReplyView(APIView):
    def post(self, request, comment_id):
        data = request.data
        comment = Comment.objects.get(pk=comment_id)
        user = request.user  # Get the user making the request
        serializer = ReplySerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save(comment=comment, user=user)  # Save the new comment
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RatingView(APIView):
    def post(self,request,product_id):
        data = request.data
        user = request.user
        product = Product.objects.get(pk=product_id)
        serializer = RatingSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=user, product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
            

class NavSearchView(APIView):   
    def get(self,request):
        search = request.query_params.get('search')
        #now get 10 products that match the search
        products = Product.objects.filter(name__icontains=search)[:10]
        list = []
        for p in products:
            list.append({"name":p.name,"id":p.product_id,"image":p.images.first().image.url, "price":p.price})
        return Response(list)

class NavCatView(APIView):
    def get(self,request):
        search = request.query_params.get('search')
        #now get brands that match the search
        #filter the products that match the search and then get brands that match the search
        products = Product.objects.filter(category__name__iexact=search)
        list = []
        brands = []
        for p in products:
            brand = p.brand.name
            if brand not in brands:
                brands.append(brand)
                list.append({"brand":brand})
        return Response(list)


class TaggedProductsView(APIView):
    def get(self,request):
        tag = request.query_params.get('tag')
        if tag == 'trending':
            products = Product.objects.filter(trending=True)
        elif tag == 'best_seller':
            products = Product.objects.filter(best_seller=True)
        elif tag == 'latest':
            products = Product.objects.all().order_by('-published_date')[:12]
        serializer = ProductSerializer(products,many=True,context={'request': request})
        return Response(serializer.data)


# ViewSets for Color, Size, Category, Brand, and ProductImage
class ColorViewSet(viewsets.ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
    permission_classes = [IsAuthenticated]

class SizeViewSet(viewsets.ModelViewSet):
    queryset = Size.objects.all()
    serializer_class = SizeSerializer
    permission_classes = [IsAuthenticated]

class SizeColorStockViewSet(viewsets.ModelViewSet):
    queryset = SizeColorStock.objects.all()
    serializer_class = SizeColorStockSerializer
    permission_classes = [IsAuthenticated]

class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = ProductImage.objects.all()
        
        # Filter by color if provided
        color = self.request.query_params.get('color')
        if color:
            queryset = queryset.filter(color_id=color)
        
        # Filter by product if provided
        product = self.request.query_params.get('product')
        if product:
            queryset = queryset.filter(product_id=product)
        
        return queryset

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = None
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        from rest_framework import serializers
        class CategorySerializer(serializers.ModelSerializer):
            class Meta:
                model = Category
                fields = ['id', 'name']
        return CategorySerializer

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = None
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        from rest_framework import serializers
        class BrandSerializer(serializers.ModelSerializer):
            class Meta:
                model = Brand
                fields = ['id', 'name']
        return BrandSerializer


class RecommendationsView(APIView):
    """
    Provides product recommendations based on the current product.
    Returns upsells, complementary products, and trending products.
    """
    
    # Complementary category mappings for cross-sells
    COMPLEMENTARY_CATEGORIES = {
        'moms': ['babies', 'kids', 'nursing'],
        'babies': ['moms', 'clothing', 'toys'],
    }
    
    def get(self, request):
        product_id = request.query_params.get('product_id')
        
        if not product_id:
            return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            current_product = Product.objects.get(product_id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        
        recommendations = {
            'same_category': [],
            'complementary': [],
            'trending': []
        }
        
        # Get category name for complementary products
        category_name = current_product.category.name.lower() if current_product.category else ''
        
        # 1. SAME CATEGORY: All products in same category, prioritize by score
        if current_product.category:
            same_cat_candidates = Product.objects.filter(
                category=current_product.category
            ).exclude(
                product_id=product_id
            )
            
            # Calculate priority score: trending=4, featured=3, best_seller=2, deal=1
            same_cat_products = []
            for product in same_cat_candidates:
                score = 0
                if product.trending:
                    score += 4
                if product.featured:
                    score += 3
                if product.best_seller:
                    score += 2
                if product.deal:
                    score += 1
                same_cat_products.append((product, score))
            
            # Sort by priority score (descending) and take top 12
            same_cat_products.sort(key=lambda x: x[1], reverse=True)
            recommendations['same_category'] = ProductSerializer(
                [p[0] for p in same_cat_products[:12]], 
                many=True, 
                context={'request': request}
            ).data
        
        # 2. COMPLEMENTARY PRODUCTS: Cross-category recommendations
        complementary_cats = []
        for key, values in self.COMPLEMENTARY_CATEGORIES.items():
            if key in category_name:
                complementary_cats = values
                break
        
        if complementary_cats:
            # Get categories that match complementary names
            matching_categories = Category.objects.filter(
                name__iregex=r'(' + '|'.join(complementary_cats) + ')'
            )
            
            if matching_categories.exists():
                complementary_products = Product.objects.filter(
                    category__in=matching_categories
                ).exclude(
                    product_id=product_id
                )
                
                # Calculate priority scores
                comps = []
                for product in complementary_products:
                    score = 0
                    if product.trending:
                        score += 4
                    if product.featured:
                        score += 3
                    if product.best_seller:
                        score += 2
                    if product.deal:
                        score += 1
                    comps.append((product, score))
                
                # Sort by priority and take top 12
                comps.sort(key=lambda x: x[1], reverse=True)
                recommendations['complementary'] = ProductSerializer(
                    [p[0] for p in comps[:12]], 
                    many=True, 
                    context={'request': request}
                ).data
        
        # 3. FALLBACK: Trending products if not enough recommendations
        total_recs = len(recommendations['same_category']) + len(recommendations['complementary'])
        if total_recs < 12:
            needed = 12 - total_recs
            trending_products = Product.objects.filter(
                trending=True
            ).exclude(
                product_id=product_id
            ).order_by('-published_date')[:needed]
            
            recommendations['trending'] = ProductSerializer(
                trending_products, 
                many=True, 
                context={'request': request}
            ).data
        
        return Response(recommendations)
