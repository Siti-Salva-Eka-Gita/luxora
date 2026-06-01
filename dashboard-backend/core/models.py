from django.db import models


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    _is_active = models.BooleanField(
        default=True,
        db_column="is_active",
        help_text="gunakan property dan soft_delete().",
    )

    # enkapsulasi
    class Meta:
        abstract = True
        ordering = ["-created_at"]

    @property
    def is_active(self):
        return self._is_active

    def soft_delete(self):
        self._is_active = False
        self.save(update_fields=["_is_active"])

    def restore(self):
        self._is_active = True
        self.save(update_fields=["_is_active"])

    # polymorphism
    def to_summary_dict(self):
        return {
            "id": self.pk,
            "created_at": str(self.created_at),
            "is_active": self.is_active,
        }

    def __str__(self):
        return f"{self.__class__.__name__}(id={self.pk})"
