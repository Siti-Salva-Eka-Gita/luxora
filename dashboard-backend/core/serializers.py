from rest_framework import serializers


class BaseSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M")
    updated_at = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M")

    class Meta:
        model = None
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]
