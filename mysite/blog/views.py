from django.shortcuts import render
from .models import Post, Project

def home(request):
    posts = Post.objects.all().order_by('-pub_date')
    projects = Project.objects.all()
    return render(request, 'blog/home.html', {'posts': posts, 'projects': projects})
