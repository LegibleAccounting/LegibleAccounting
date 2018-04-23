"""project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include

from rest_framework import routers

from . import views
from .admin import admin_site
from accounts.views import AccountViewSet, AccountTypeViewSet
from journalize.views import JournalEntryViewSet

router = routers.DefaultRouter()

router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'logs', views.LogEntryViewSet)
router.register(r'accounts', AccountViewSet)
router.register(r'account-types', AccountTypeViewSet)
router.register(r'journal-entries', JournalEntryViewSet)

urlpatterns = [
    url(r'^admin/', admin_site.urls),
    url(r'^api/', include(router.urls)),
    url(r'^auth/', include([
        url(r'^register/', views.register_view),
        url(r'^login/', views.login_view),
        url(r'^logout/', views.logout_view),
        url(r'^current/', views.current_view)
    ])),
]
