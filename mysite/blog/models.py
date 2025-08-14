from django.db import models
from django.utils import timezone

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    pub_date = models.DateTimeField('date published')
    cover = models.ImageField(upload_to='covers/', blank=True, null=True)

    def __str__(self):
        return self.title

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    link = models.URLField(max_length=200)

    def __str__(self):
        return self.title

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    username = models.CharField(max_length=100)
    content = models.TextField()
    created_date = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_date']

    def __str__(self):
        return f'{self.username} - {self.post.title[:30]}'

# Clase Contact debe estar fuera de Comment
class Contact(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nombre")
    email = models.EmailField(verbose_name="Email")
    message = models.TextField(verbose_name="Mensaje")
    created_at = models.DateTimeField(default=timezone.now, verbose_name="Fecha de creación")
    read = models.BooleanField(default=False, verbose_name="Leído")

    class Meta:
        verbose_name = "Contacto"
        verbose_name_plural = "Contactos"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.email}"

    def mark_as_read(self):
        self.read = True
        self.save()