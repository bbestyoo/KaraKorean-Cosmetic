from django.core.management.base import BaseCommand
from shop.revalidation import revalidate_frontend


class Command(BaseCommand):
    help = 'Send an on-demand revalidation request to the Next.js frontend'

    def add_arguments(self, parser):
        parser.add_argument(
            '--tag',
            action='append',
            default=[],
            help='Cache tag to revalidate (repeatable)',
        )
        parser.add_argument(
            '--path',
            action='append',
            default=[],
            help='Route path to revalidate, e.g. /products (repeatable)',
        )
        parser.add_argument(
            '--product-id',
            action='append',
            default=[],
            help='Product slug to revalidate (repeatable)',
        )

    def handle(self, *args, **options):
        tags = options['tag'] or ['product']
        paths = options['path'] or ['/products']
        product_ids = options['product_id'] or None

        self.stdout.write(
            f"Sending revalidation: tags={tags}  paths={paths}  product_ids={product_ids}"
        )
        revalidate_frontend(tags=tags, paths=paths, product_ids=product_ids)
        self.stdout.write(self.style.SUCCESS("Done"))
