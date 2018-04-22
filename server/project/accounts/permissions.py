from rest_framework import permissions

# Custom Django REST Framework permission to check if the current User
# is in the "Manager" group.
class LAAccountsClosingPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.groups.filter(name='Manager').exists()
