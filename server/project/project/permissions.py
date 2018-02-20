from django.contrib.auth.models import Group
from rest_framework import permissions

# Custom Django REST Framework permission to check if the current User
# is in the "Administrator" Group.
class LAAuthModelReadPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method not in permissions.SAFE_METHODS:
            return True

        return request.user.is_authenticated and (request.user.is_staff or request.user.groups.filter(name='Administrator').exists())
