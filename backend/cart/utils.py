import threading
import requests
from django.conf import settings
from datetime import datetime, timedelta
import logging

from .models import OrderItem

logger = logging.getLogger(__name__)


def send_brevo_email(to_email, subject, html_content):
    """Send email using Brevo API v3 instead of SMTP"""
    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json"
    }

    payload = {
        "sender": {"email": settings.DEFAULT_FROM_EMAIL_ADDRESS, "name": settings.DEFAULT_FROM_EMAIL_NAME},
        "to": [{"email": to_email}],
        "subject": subject,
        "htmlContent": html_content
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        if response.status_code not in (200, 201):
            logger.error("Brevo API error for %s: status=%s body=%s", to_email, response.status_code, response.text)
        else:
            logger.info("Email sent to %s (subject: %s)", to_email, subject)
        return response.status_code, response.text
    except requests.exceptions.RequestException as e:
        logger.error("Brevo API request failed for %s: %s", to_email, str(e))
        return None, str(e)


def send_order_confirmation(order):
    """Send order confirmation email to customer and admin"""
    def send_emails():
        try:
            delivery = getattr(order, 'delivery', None)
            if not delivery:
                logger.warning("No delivery found for order %s, skipping email", order.id)
                return

            order_items = OrderItem.objects.filter(order=order)

            item_rows = ""
            for item in order_items:
                product_name = item.product.name if item.product else "N/A"
                size_name = item.size.name if item.size else "N/A"
                item_rows += f"""
                <tr>
                    <td>{product_name}</td>
                    <td>{size_name}</td>
                    <td>{item.quantity}</td>
                    <td>Rs. {item.price}</td>
                    <td>Rs. {item.price * item.quantity}</td>
                </tr>
                """

            now = datetime.now()
            order_id_short = str(order.id)[:8]

            # Email to customer
            customer_subject = f"Order Confirmation - #{order_id_short}"
            customer_html = f"""
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>Order Confirmation</title>
              <style>
                body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f7f7; padding: 20px; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
                .header {{ background-color: #000; color: #ffffff; padding: 30px 20px; text-align: center; }}
                .header h1 {{ margin: 0; font-size: 24px; }}
                .content {{ padding: 30px 20px; line-height: 1.6; }}
                .content h2 {{ color: #000; font-size: 18px; margin-top: 0; }}
                .order-info {{ background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0; }}
                .order-info p {{ margin: 5px 0; }}
                table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                table th {{ background-color: #000; color: #fff; padding: 10px 8px; text-align: left; font-size: 13px; }}
                table td {{ padding: 10px 8px; border-bottom: 1px solid #eee; font-size: 14px; }}
                .totals {{ margin: 20px 0; }}
                .totals tr td {{ padding: 6px 0; border: none; }}
                .totals .label {{ text-align: right; font-weight: bold; }}
                .totals .value {{ text-align: right; padding-left: 20px; }}
                .grand-total {{ font-size: 18px; font-weight: bold; border-top: 2px solid #000; padding-top: 10px; }}
                .footer {{ background-color: #f0f0f0; color: #777; text-align: center; padding: 15px; font-size: 12px; }}
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Thank You for Your Order!</h1>
                </div>
                <div class="content">
                  <h2>Hi {delivery.full_name},</h2>
                  <p>Your order has been placed successfully. Here are your order details:</p>
                  <div class="order-info">
                    <p><strong>Order #:</strong> {order_id_short}</p>
                    <p><strong>Date:</strong> {now.strftime('%B %d, %Y')}</p>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Size</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item_rows}
                    </tbody>
                  </table>
                  <table class="totals">
                    <tr><td class="label">Subtotal</td><td class="value">Rs. {delivery.subtotal}</td></tr>
                    <tr><td class="label">Shipping</td><td class="value">Rs. {delivery.shipping_cost}</td></tr>
                    <tr><td class="label">Discount</td><td class="value">-Rs. {delivery.discount}</td></tr>
                    <tr class="grand-total"><td class="label">Total</td><td class="value">Rs. {delivery.payment_amount}</td></tr>
                  </table>
                  <h3>Shipping Address</h3>
                  <p>{delivery.full_name}<br>{delivery.shipping_address}<br>{delivery.phone_number}</p>
                  <p>We'll notify you once your order has been dispatched.</p>
                  <p>Best regards,<br><strong>Kara Korean Beauty Store</strong></p>
                </div>
                <div class="footer">
                  &copy; {now.year} Kara Korean Beauty Store. All rights reserved.
                </div>
              </div>
            </body>
            </html>
            """

            # Email to admin
            admin_subject = f"New Order Placed - #{order_id_short}"
            admin_html = f"""
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>New Order Notification</title>
              <style>
                body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f7f7; padding: 20px; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
                .header {{ background-color: #000; color: #ffffff; padding: 30px 20px; text-align: center; }}
                .header h1 {{ margin: 0; font-size: 24px; }}
                .content {{ padding: 30px 20px; line-height: 1.6; }}
                table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                table th {{ background-color: #000; color: #fff; padding: 10px 8px; text-align: left; font-size: 13px; }}
                table td {{ padding: 10px 8px; border-bottom: 1px solid #eee; font-size: 14px; }}
                .info-table td {{ border: none; padding: 6px 0; }}
                .info-table td:first-child {{ font-weight: bold; width: 120px; }}
                .footer {{ background-color: #f0f0f0; color: #777; text-align: center; padding: 15px; font-size: 12px; }}
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>New Order Received</h1>
                </div>
                <div class="content">
                  <p>A new order has been placed:</p>
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Size</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item_rows}
                    </tbody>
                  </table>
                  <table class="info-table">
                    <tr><td>Order #</td><td>{order_id_short}</td></tr>
                    <tr><td>Customer</td><td>{delivery.full_name}</td></tr>
                    <tr><td>Email</td><td>{delivery.email}</td></tr>
                    <tr><td>Phone</td><td>{delivery.phone_number}</td></tr>
                    <tr><td>Address</td><td>{delivery.shipping_address}</td></tr>
                    <tr><td>Payment</td><td>{delivery.payment_method}</td></tr>
                    <tr><td>Subtotal</td><td>Rs. {delivery.subtotal}</td></tr>
                    <tr><td>Shipping</td><td>Rs. {delivery.shipping_cost}</td></tr>
                    <tr><td>Discount</td><td>-Rs. {delivery.discount}</td></tr>
                    <tr><td>Total</td><td>Rs. {delivery.payment_amount}</td></tr>
                  </table>
                  <p>Please process this order and update the status accordingly.</p>
                </div>
                <div class="footer">
                  &copy; {now.year} Kara Korean Beauty Store
                </div>
              </div>
            </body>
            </html>
            """

            if delivery.email:
                status, resp = send_brevo_email(delivery.email, customer_subject, customer_html)
                logger.info("Customer email result: status=%s", status)
            else:
                logger.warning("No email on delivery for order %s, skipping customer email", order.id)

            status, resp = send_brevo_email("karakoreanstore@gmail.com", admin_subject, admin_html)
            logger.info("Admin email result: status=%s", status)

        except Exception as e:
            logger.exception("Error sending order confirmation for order %s: %s", order.id, str(e))

    thread = threading.Thread(target=send_emails, daemon=True)
    thread.start()


