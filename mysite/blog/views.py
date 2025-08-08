from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import Post, Project, Comment
import json

def home(request):
    posts = Post.objects.all().order_by('-pub_date')
    projects = Project.objects.all()
    return render(request, 'blog/home.html', {'posts': posts, 'projects': projects})

@csrf_exempt
@require_POST
def add_comment(request, post_id):
    try:
        post = get_object_or_404(Post, id=post_id)
        data = json.loads(request.body)
        
        username = data.get('username', '').strip()
        content = data.get('content', '').strip()
        
        if not username or not content:
            return JsonResponse({'error': 'Nombre de usuario y comentario son requeridos'}, status=400)
        
        if len(username) > 100:
            return JsonResponse({'error': 'Nombre de usuario muy largo'}, status=400)
        
        if len(content) > 1000:
            return JsonResponse({'error': 'Comentario muy largo'}, status=400)
        
        comment = Comment.objects.create(
            post=post,
            username=username,
            content=content
        )
        
        return JsonResponse({
            'success': True,
            'comment': {
                'id': comment.id,
                'username': comment.username,
                'content': comment.content,
                'created_date': comment.created_date.strftime('%d/%m/%Y %H:%M')
            }
        })
    
    except Exception as e:
        return JsonResponse({'error': 'Error al agregar comentario'}, status=500)

def get_comments(request, post_id):
    try:
        post = get_object_or_404(Post, id=post_id)
        comments = post.comments.all()
        
        comments_data = [{
            'id': comment.id,
            'username': comment.username,
            'content': comment.content,
            'created_date': comment.created_date.strftime('%d/%m/%Y %H:%M')
        } for comment in comments]
        
        return JsonResponse({
            'success': True,
            'comments': comments_data
        })
    
    except Exception as e:
        return JsonResponse({'error': 'Error al obtener comentarios'}, status=500)