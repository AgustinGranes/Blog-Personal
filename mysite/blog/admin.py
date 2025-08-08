from django.contrib import admin
from .models import Post, Project, Comment

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'pub_date']
    list_filter = ['pub_date']
    search_fields = ['title', 'content']

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'link']

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['username', 'post', 'created_date']
    list_filter = ['created_date', 'post']
    search_fields = ['username', 'content']
    readonly_fields = ['created_date']