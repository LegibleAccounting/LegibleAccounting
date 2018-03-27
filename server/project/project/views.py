from auditlog.models import LogEntry
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User, Group
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny, DjangoModelPermissions

from .permissions import LAAuthModelReadPermission
from .serializers import UserSerializer, WriteUserSerializer, GroupSerializer, LogEntrySerializer

@api_view(['POST'])
@permission_classes((AllowAny,))
@parser_classes((JSONParser,))
def register_view(request):
    if request.data['password'] != request.data['password2']:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    instance = User.objects.create_user(
        request.data['username'],
        None,
        request.data['password'])

    instance.is_active = False
    instance.save()

    groups = request.data.get('groups', [])
    for group in groups:
        instance.groups.add(Group.objects.get(pk=group))

    return Response(UserSerializer(instance, context={ 'request': request }).data)

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
    permission_classes = (DjangoModelPermissions, LAAuthModelReadPermission,)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserSerializer

        return WriteUserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = (DjangoModelPermissions, LAAuthModelReadPermission,)


class LogEntryViewSet(viewsets.ModelViewSet):
    queryset = LogEntry.objects.filter(actor__is_staff=False)
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ('actor__username', 'object_repr', 'timestamp',)
    ordering_fields = ('actor__username', 'object_repr', 'timestamp',)
    serializer_class = LogEntrySerializer
    permission_classes = (DjangoModelPermissions, LAAuthModelReadPermission,)
