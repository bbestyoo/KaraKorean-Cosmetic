from rest_framework import serializers
from .models import Product, Comment, Repliess, ProductImage, Rating, ProductAttribute, Variant, Size, UseCase
from django.contrib.auth.models import User
from django.db.models import Sum

class ReplySerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField() #yo garexi i can define serializers for user by myself i.e. user ko kun attribute pathaune vanera
    comment = serializers.PrimaryKeyRelatedField(read_only=True)
    user_dp = serializers.SerializerMethodField()
    published_date = serializers.DateField(format='%Y-%m-%d', read_only=True)
    class Meta:
        model = Repliess
        fields = ['user', 'comment','text','published_date','user_dp']
    def get_user(self, obj):
        return obj.user.name
    
    def get_user_dp(self, obj):
        request = self.context.get('request')
        if obj.user.dp and request:
            return request.build_absolute_uri(f"/media/{obj.user.dp}")



class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField() #yo garexi i can define serializers for user by myself i.e. user ko kun attribute pathaune vanera
    product = serializers.PrimaryKeyRelatedField(read_only=True)
    replies = ReplySerializer(many=True, read_only=True)
    user_dp = serializers.SerializerMethodField()
    published_date = serializers.DateField(format='%Y-%m-%d', read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'

    def get_user(self, obj):
        return obj.user.name
    
    def get_user_dp(self, obj):
        request = self.context.get('request')
        if obj.user.dp:
            return request.build_absolute_uri(f"/media/{obj.user.dp}")
    
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'product']

class RatingSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only = True)
    product = serializers.PrimaryKeyRelatedField(read_only =True)
    image = serializers.SerializerMethodField()
    user_dp = serializers.SerializerMethodField(read_only = True)
    
    class Meta:
        model = Rating
        fields = '__all__'

    def get_user(self, obj):
        return obj.user.name
    
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None
    def get_user_dp(self, obj):
        request = self.context.get('request')
        if obj.user.dp:
            return request.build_absolute_uri(f"/media/{obj.user.dp}")
        
class ProductAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAttribute
        fields = ['attribute', 'value']

class VariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variant
        fields = ['id', 'name', 'additional_price']

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'name', 'price_adjustment',  'product']
    
class GetProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many = True, read_only = True)
    ratings = serializers.SerializerMethodField()
    category = serializers.StringRelatedField()
    usecases = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name')
    variants = VariantSerializer(many=True, read_only=True)
    sizes = SizeSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = ['product_id','name','category','usecases','price','old_price', 'before_deal_price','images','ratings','variants','sizes']

    def get_ratings(self,obj):
        request = self.context.get('request')
        stats = {}
        ratings = Rating.objects.filter(product=obj)
        if ratings.exists():
            total_ratings = ratings.count()
            #show how many stars ratings were rated acc to each star
            rating_dict = {1:0, 2:0, 3:0, 4:0, 5:0}
            for rating in ratings:
                rating_dict[rating.rating] += 1
            avg_rating = sum(rating.rating for rating in ratings) / len(ratings)
            avg_rating = round(avg_rating, 1)
            stats = {'total_ratings': total_ratings, 'rating_dict': rating_dict, 'avg_rating': avg_rating}
        else:
            stats = {'total_ratings': 0, 'rating_dict': {1:0, 2:0, 3:0, 4:0, 5:0}, 'avg_rating':0}
        serializer = RatingSerializer(ratings, many=True, context={'request': request})
        return {"stats":stats, "data":serializer.data}
    
    def get_brandName(self, obj):
        return obj.brand.name


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many = True, read_only = True)
    brandName = serializers.SerializerMethodField()
    ratings = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    sub_category_name = serializers.SerializerMethodField()
    usecases = serializers.SlugRelatedField(many=True, slug_field='name', queryset=UseCase.objects.all(), required=False)
    # stock = serializers.SerializerMethodField()
    attributes = ProductAttributeSerializer(many=True, read_only=True)
    variants = VariantSerializer(many=True, read_only=True)
    sizes = SizeSerializer(many=True, read_only=True)
    published_date = serializers.DateField(format='%Y-%m-%d', read_only=True)
    class Meta:
        model = Product
        fields = '__all__'

    def get_ratings(self,obj):
        request = self.context.get('request')
        stats = {}
        ratings = Rating.objects.filter(product=obj)
        if ratings.exists():
            total_ratings = ratings.count()
            #show how many stars ratings were rated acc to each star
            rating_dict = {1:0, 2:0, 3:0, 4:0, 5:0}
            for rating in ratings:
                rating_dict[rating.rating] += 1
            avg_rating = sum(rating.rating for rating in ratings) / len(ratings)
            avg_rating = round(avg_rating, 1)
            stats = {'total_ratings': total_ratings, 'rating_dict': rating_dict, 'avg_rating': avg_rating}
        else:
            stats = {'total_ratings': 0, 'rating_dict': {1:0, 2:0, 3:0, 4:0, 5:0}, 'avg_rating':0}
        serializer = RatingSerializer(ratings, many=True, context={'request': request})
        return {"stats":stats, "data":serializer.data}
    
    def get_brandName(self, obj):
        return obj.brand.name
    
    def get_category_name(self, obj):
        return obj.category.name if obj.category else None
    
    def get_sub_category_name(self, obj):
        return obj.sub_category.name if obj.sub_category else None
    
    def get_stock(self, obj):
        total_stock = Size.objects.filter(product_id=obj.product_id).aggregate(total=Sum('stock'))['total']
        return total_stock if total_stock is not None else 0
