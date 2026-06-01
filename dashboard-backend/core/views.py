from rest_framework import viewsets, status
from rest_framework.response import Response


class BaseViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        qs = super().get_queryset()  # ambil queryset bawaan dari child class
        return qs.filter(_is_active=True)

    def perform_destroy(self, instance):
        instance.soft_delete()

    def handle_exception(self, exc):
        return super().handle_exception(exc)
