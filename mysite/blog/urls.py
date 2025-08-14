from django.urls import path
from . import views

# El app_name ayuda a Django a diferenciar las URLs si tienes varias apps
app_name = 'blog'

urlpatterns = [
    # Esta ruta ahora es relativa a /blog/
    path('', views.home, name='home'),
    path('contact/', views.contact_form, name='contact_form'),
    path('post/<int:post_id>/comments/', views.get_comments, name='get_comments'),
    path('post/<int:post_id>/comment/add/', views.add_comment, name='add_comment'),
]
