from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
# Importamos las vistas de la app blog
from blog import views as blog_views

urlpatterns = [
    path('admin/', admin.site.urls),
    # La ruta raíz ahora llama a nuestra nueva vista unificada
    path('', blog_views.portfolio_view, name='portfolio'),
    # Mantenemos las URLs del blog para la funcionalidad de comentarios
    path('blog/', include('blog.urls')),
]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)