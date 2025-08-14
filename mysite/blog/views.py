from .models import Comment

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.utils import timezone
from django.shortcuts import get_object_or_404

def get_comments(request, post_id):
    comments = Comment.objects.filter(post_id=post_id).order_by('-created_date')
    comments_data = [
        {
            'username': c.username,
            'content': c.content,
            'created_date': c.created_date.strftime('%d/%m/%Y %H:%M')
        } for c in comments
    ]
    return JsonResponse({'success': True, 'comments': comments_data})

@csrf_exempt
@require_POST
def add_comment(request, post_id):
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        content = data.get('content', '').strip()
        if not username or not content:
            return JsonResponse({'success': False, 'error': 'Por favor completa todos los campos'})
        post = get_object_or_404(Post, pk=post_id)
        Comment.objects.create(post=post, username=username, content=content, created_date=timezone.now())
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': 'Error al enviar comentario'})
def home(request):
    return portfolio_view(request)
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import json
from .models import Contact, Post, Project

def portfolio_view(request):
    posts = Post.objects.all()
    projects = Project.objects.all()
    return render(request, 'blog/portfolio.html', {'posts': posts, 'projects': projects})

@require_http_methods(["POST"])
def contact_form(request):
    try:
        if request.content_type == 'application/json':
            data = json.loads(request.body)
            name = data.get('name', '').strip()
            email = data.get('email', '').strip()
            message = data.get('message', '').strip()
        else:
            name = request.POST.get('name', '').strip()
            email = request.POST.get('email', '').strip()
            message = request.POST.get('message', '').strip()

        if not name or not email or not message:
            return JsonResponse({'success': False, 'error': 'Todos los campos son obligatorios'})
        if len(name) > 100:
            return JsonResponse({'success': False, 'error': 'El nombre es demasiado largo'})
        if len(message) > 1000:
            return JsonResponse({'success': False, 'error': 'El mensaje es demasiado largo'})

        contact = Contact.objects.create(name=name, email=email, message=message)
        return JsonResponse({'success': True, 'message': '¡Mensaje enviado correctamente! Te contactaré pronto.'})

    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'Datos inválidos'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': 'Error interno del servidor'})