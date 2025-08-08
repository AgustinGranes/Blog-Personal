#!/bin/bash

# Instala las dependencias que están dentro de la carpeta /mysite
pip install -r mysite/requirements.txt

# Ejecuta collectstatic apuntando al manage.py correcto
python mysite/manage.py collectstatic --noinput
