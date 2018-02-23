from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name="index"),
    url(r'^account/(?P<account_id>[0-9]+)/$', views.account, name='account'),
]