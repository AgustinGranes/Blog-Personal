#!/bin/bash

# Instala las dependencias
pip install -r requirements.txt

# Navega al directorio de tu proyecto Django y ejecuta collectstatic
python mysite/manage.py collectstatic --noinput
