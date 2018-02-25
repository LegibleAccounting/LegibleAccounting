from auditlog.models import LogEntry
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User, Group
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny, DjangoModelPermissions

from .permissions import LAAuthModelReadPermission
from .serializers import UserSerializer, GroupSerializer, LogEntrySerializer

@api_view(['POST'])
@permission_classes((AllowAny,))
@parser_classes((JSONParser,))
def login_view(request):
    username = request.data['username']
    password = request.data['password']

    user = authenticate(request._request, username=username, password=password)

    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    login(request._request, user)
    return Response(UserSerializer(user, context={ 'request': request }).data)

@api_view(['POST'])
def logout_view(request):
    logout(request._request)
    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
def current_view(request):
    return Response(UserSerializer(request.user, context={ 'request': request }).data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (DjangoModelPermissions, LAAuthModelReadPermission,)

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = (DjangoModelPermissions, LAAuthModelReadPermission,)

class LogEntryViewSet(viewsets.ModelViewSet):
    queryset = LogEntry.objects.filter(actor__is_staff=False)
    filter_backends = (SearchFilter,)
    search_fields = ('actor__username', 'object_repr', 'timestamp',)
    serializer_class = LogEntrySerializer
    permission_classes = (DjangoModelPermissions, LAAuthModelReadPermission,)
