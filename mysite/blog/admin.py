from django.contrib import admin
from .models import Post, Project, Comment, Contact

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


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at', 'read', 'message_preview')
    list_filter = ('read', 'created_at')
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('created_at',)
    list_editable = ('read',)
    actions = ['mark_as_read', 'mark_as_unread']
    
    def message_preview(self, obj):
        return obj.message[:50] + "..." if len(obj.message) > 50 else obj.message
    message_preview.short_description = "Vista previa del mensaje"
    
    def mark_as_read(self, request, queryset):
        queryset.update(read=True)
        self.message_user(request, f"{queryset.count()} contactos marcados como leídos.")
    mark_as_read.short_description = "Marcar como leídos"
    
    def mark_as_unread(self, request, queryset):
        queryset.update(read=False)
        self.message_user(request, f"{queryset.count()} contactos marcados como no leídos.")
    mark_as_unread.short_description = "Marcar como no leídos"
    
    fieldsets = (
        ('Información del contacto', {
            'fields': ('name', 'email', 'created_at', 'read')
        }),
        ('Mensaje', {
            'fields': ('message',)
        }),
    )