from rest_framework import serializers
from .models import Order, OrderItem, Delivery, Cart
from shop.models import Product
from shop.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_id = serializers.CharField(source='product.product_id', read_only=True)
    color_name = serializers.CharField(source='color.name', read_only=True)
    size_name = serializers.CharField(source='size.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'product_id', 'quantity', 'price', 'color_name', 'size_name']


class DeliverySerializer(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField()
    
    class Meta:
        model = Delivery
        fields = ['id', 'order', 'phone_number', 'first_name', 'last_name', 'email', 
                  'shipping_address', 'payment_method', 'shipping_cost', 'subtotal', 
                  'discount', 'payment_amount', 'payment_status', 'order_items', 'created_at']
    
    def get_order_items(self, obj):
        if obj.order:
            items = obj.order.order_items.all()
            return OrderItemSerializer(items, many=True).data
        return []

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    delivery = DeliverySerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'status', 'order_items', 'delivery', 'created_at', 'updated_at']

    def create(self, validated_data):
        # User is optional, can be None for guest checkout
        order = Order.objects.create(**validated_data)
        return order

class CartSerializer(serializers.ModelSerializer):
    product_id = serializers.CharField(source='product.product_id', read_only=True)
    image = serializers.SerializerMethodField()
    name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = Cart
        fields = ['id','product_id', 'image', 'quantity','name','price','color']

    def get_image(self, obj):
        request = self.context.get('request')  # Get request from context
        first_image = obj.product.images.first()  # Get first product image
        
        if first_image and first_image.image:
            image_url = first_image.image.url
            
            # Ensure full URL is generated
            if request is not None:
                return request.build_absolute_uri(image_url)  # Generate absolute URL
        
        return None