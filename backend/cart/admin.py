from django.contrib import admin
from django.utils.html import format_html, format_html_join
from django.utils.safestring import mark_safe
from django.urls import reverse
from django.db.models import Count
from .models import OrderItem, Order, Delivery, Cart, Coupon


class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'short_id', 'customer_name', 'email', 'total',
        'colored_status', 'status',
        'payment_status_badge', 'item_count', 'created_short',
    ]
    list_editable = ['status']
    list_filter = [
        'status',
        'delivery__payment_status',
        'delivery__payment_method',
        'delivery__shipping_method',
        'created_at',
    ]
    search_fields = ['delivery__full_name', 'delivery__email', 'id']
    date_hierarchy = 'created_at'
    list_per_page = 25
    ordering = ['-created_at']

    fieldsets = [
        ('Order Status', {
            'fields': ['id', 'status', 'created_at', 'updated_at'],
            'classes': ['wide'],
        }),
        ('Customer Information', {
            'fields': ['customer_name_display', 'email_display', 'phone_display'],
            'classes': ['wide'],
        }),
        ('Shipping Address', {
            'fields': ['shipping_address_display'],
            'classes': ['wide'],
        }),
        ('Order Summary', {
            'fields': ['summary_display'],
            'classes': ['wide'],
        }),
        ('Payment Information', {
            'fields': ['payment_info_display'],
            'classes': ['wide'],
        }),
        ('Order Items', {
            'fields': ['order_items_display'],
            'classes': ['wide'],
        }),
    ]
    readonly_fields = [
        'id', 'created_at', 'updated_at',
        'customer_name_display', 'email_display', 'phone_display',
        'shipping_address_display', 'summary_display',
        'payment_info_display', 'order_items_display',
    ]
    actions = ['mark_dispatched', 'mark_cleared', 'mark_cancelled', 'mark_pending']

    # --- List display helpers ---

    def short_id(self, obj):
        return str(obj.id)[:8] + '...'
    short_id.short_description = 'Order ID'
    short_id.admin_order_field = 'id'

    def customer_name(self, obj):
        return obj.delivery.full_name if obj.delivery else '-'
    customer_name.short_description = 'Customer'
    customer_name.admin_order_field = 'delivery__full_name'

    def email(self, obj):
        return obj.delivery.email if obj.delivery else '-'
    email.short_description = 'Email'
    email.admin_order_field = 'delivery__email'

    def total(self, obj):
        return f"Rs. {obj.delivery.payment_amount:,.0f}" if obj.delivery else '-'
    total.short_description = 'Total'
    total.admin_order_field = 'delivery__payment_amount'

    def colored_status(self, obj):
        colors = {
            'Pending': '#f59e0b',
            'Dispatched': '#3b82f6',
            'Cleared': '#10b981',
            'Cancelled': '#ef4444',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="display:inline-block;padding:3px 12px;border-radius:999px;'
            'font-size:11px;font-weight:600;color:#fff;background:{};">{}</span>',
            color, obj.status
        )
    colored_status.short_description = 'Status'
    colored_status.admin_order_field = 'status'

    def payment_status_badge(self, obj):
        if not obj.delivery:
            return '-'
        status = obj.delivery.payment_status
        color = '#10b981' if status == 'Completed' else '#f59e0b'
        return format_html(
            '<span style="padding:2px 10px;border-radius:999px;font-size:11px;'
            'font-weight:600;color:#fff;background:{};">{}</span>',
            color, status
        )
    payment_status_badge.short_description = 'Payment'
    payment_status_badge.admin_order_field = 'delivery__payment_status'

    def item_count(self, obj):
        count = obj.order_items.count()
        return count
    item_count.short_description = 'Items'
    item_count.admin_order_field = 'order_items__count'

    def created_short(self, obj):
        return obj.created_at.strftime('%b %d, %Y')
    created_short.short_description = 'Date'
    created_short.admin_order_field = 'created_at'

    # --- Detail view display helpers ---

    def customer_name_display(self, obj):
        if not obj.delivery:
            return '-'
        return format_html(
            '<div style="font-size:15px;font-weight:600;">{}</div>',
            obj.delivery.full_name
        )
    customer_name_display.short_description = 'Full Name'

    def email_display(self, obj):
        if not obj.delivery:
            return '-'
        return format_html(
            '<a href="mailto:{}" style="color:#2563eb;text-decoration:none;">{}</a>',
            obj.delivery.email, obj.delivery.email
        )
    email_display.short_description = 'Email'

    def phone_display(self, obj):
        if not obj.delivery:
            return '-'
        return format_html(
            '<a href="tel:{}" style="color:#2563eb;text-decoration:none;">{}</a>',
            obj.delivery.phone_number, obj.delivery.phone_number
        )
    phone_display.short_description = 'Phone'

    def shipping_address_display(self, obj):
        if not obj.delivery:
            return '-'
        return format_html(
            '<div style="padding:8px 12px;background:#f9fafb;border-radius:6px;'
            'border:1px solid #e5e7eb;font-size:13px;line-height:1.6;">{}</div>',
            obj.delivery.shipping_address
        )
    shipping_address_display.short_description = 'Address'

    def summary_display(self, obj):
        if not obj.delivery:
            return '-'
        d = obj.delivery
        total_style = 'font-weight:700;font-size:15px;'
        rows = format_html_join(
            '',
            '<tr><td style="padding:4px 12px;color:#6b7280;font-size:13px;">{}</td>'
            '<td style="padding:4px 12px;text-align:right;font-size:13px;{}">{}</td></tr>',
            [
                ('Subtotal', '', f'Rs. {d.subtotal:,.0f}'),
                ('Shipping', '', f'Rs. {d.shipping_cost:,.0f}'),
            ] + (
                [('Shipping Method', '', d.shipping_method)] if d.shipping_method else []
            ) + (
                [('Discount', '', f'-Rs. {d.discount:,.0f}')] if d.discount else []
            ) + [
                ('Total', total_style, f'Rs. {d.payment_amount:,.0f}'),
            ] + (
                [('Coupon', '', d.coupon_code)] if d.coupon_code else []
            )
        )
        return format_html(
            '<table style="width:100%;max-width:350px;border-collapse:collapse;">{}</table>',
            rows
        )
    summary_display.short_description = 'Summary'

    def payment_info_display(self, obj):
        if not obj.delivery:
            return '-'
        d = obj.delivery
        pstatus = d.payment_status
        pcolor = '#10b981' if pstatus == 'Completed' else '#f59e0b'
        status_badge = format_html(
            '<span style="padding:1px 8px;border-radius:999px;font-size:11px;'
            'font-weight:600;color:#fff;background:{};">{}</span>',
            pcolor, pstatus
        )
        rows = format_html_join(
            '',
            '<tr><td style="padding:4px 12px;color:#6b7280;font-size:13px;">{}</td>'
            '<td style="padding:4px 12px;font-size:13px;">{}</td></tr>',
            [
                ('Method', d.payment_method),
                ('Status', status_badge),
            ] + ([('Transaction ID', d.transaction_id)] if d.transaction_id else [])
        )
        return format_html(
            '<table style="width:100%;max-width:400px;border-collapse:collapse;">{}</table>',
            rows
        )
    payment_info_display.short_description = 'Payment Info'

    def order_items_display(self, obj):
        items = obj.order_items.all()
        if not items:
            return 'No items in this order.'

        rows_list = []
        for i, item in enumerate(items):
            bg = '#f9fafb' if i % 2 == 0 else '#ffffff'
            product_link = reverse('admin:shop_product_change', args=[item.product.pk])
            size_name = item.size.name if item.size else '—'
            unit_price = f'Rs. {item.price:,}'
            line_total = f'Rs. {item.quantity * item.price:,}'
            rows_list.append(format_html(
                '<tr style="background:{};">'
                '<td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">'
                '<a href="{}" target="_blank" style="color:#2563eb;text-decoration:none;font-weight:500;">{}</a></td>'
                '<td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">{}</td>'
                '<td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">{}</td>'
                '<td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">{}</td>'
                '<td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;">{}</td>'
                '</tr>',
                bg, product_link, item.product.name,
                size_name, item.quantity,
                unit_price, line_total
            ))
        rows = format_html_join('', '{}', [(r,) for r in rows_list])

        header = mark_safe(
            '<thead><tr style="background:#f3f4f6;">'
            '<th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:0.5px;">Product</th>'
            '<th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:0.5px;">Size</th>'
            '<th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>'
            '<th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:0.5px;">Price</th>'
            '<th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:0.5px;">Total</th>'
            '</tr></thead>'
        )
        return format_html(
            '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:6px;">{}{}</table></div>',
            header, rows
        )
    order_items_display.short_description = 'Items'

    # --- Actions ---

    def mark_dispatched(self, request, queryset):
        updated = queryset.update(status='Dispatched')
        self.message_user(request, f'{updated} order(s) marked as Dispatched.')
    mark_dispatched.short_description = 'Mark selected orders as Dispatched'

    def mark_cleared(self, request, queryset):
        updated = queryset.update(status='Cleared')
        self.message_user(request, f'{updated} order(s) marked as Cleared.')
    mark_cleared.short_description = 'Mark selected orders as Cleared'

    def mark_cancelled(self, request, queryset):
        updated = queryset.update(status='Cancelled')
        self.message_user(request, f'{updated} order(s) marked as Cancelled.')
    mark_cancelled.short_description = 'Mark selected orders as Cancelled'

    def mark_pending(self, request, queryset):
        updated = queryset.update(status='Pending')
        self.message_user(request, f'{updated} order(s) marked as Pending.')
    mark_pending.short_description = 'Mark selected orders as Pending'

    # --- List view customization ---

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        base_qs = Order.objects.all()
        extra_context['stats'] = {
            'total': base_qs.count(),
            'pending': base_qs.filter(status='Pending').count(),
            'dispatched': base_qs.filter(status='Dispatched').count(),
            'cleared': base_qs.filter(status='Cleared').count(),
            'cancelled': base_qs.filter(status='Cancelled').count(),
        }
        return super().changelist_view(request, extra_context=extra_context)

    class Media:
        css = {
            'all': ('admin/css/order_admin.css',)
        }


admin.site.register(Order, OrderAdmin)
admin.site.register(Cart)
admin.site.register(Coupon)
admin.site.register(Delivery)