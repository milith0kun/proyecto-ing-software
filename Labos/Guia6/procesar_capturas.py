import os
from PIL import Image

dir_capturas = "/opt/data/proyecto-ing-software/Labos/Guia6/capturas"

img_left = Image.open(os.path.join(dir_capturas, "tablero_jira_todo_desarrollo_revision.jpg"))
img_right = Image.open(os.path.join(dir_capturas, "tablero_jira_revision_done.jpg"))

print("Left size:", img_left.size)
print("Right size:", img_right.size)

# Left: To Do 2, DESARROLLO 0, REVISIÓN 2
# Right: DESARROLLO 0, REVISIÓN 2, Done 4
# Vamos a recortar y componer un panorama limpio del tablero completo:
# En Left tomamos desde x=0 hasta el final de DESARROLLO o inicio de REVISION
# O mejor, presentamos ambas capturas complementarias en LaTeX como Subfigures:
# (a) Columnas To Do, Desarrollo y Revisión (Jira Cloud Cgb Academy)
# (b) Columnas Revisión y Done con subtareas 4/4 completadas
# y la tercera:
# (c) Backlog general de Sprints (Sprint 1, Sprint 2 Onboarding, Sprint 3 Microtests)
print("Imágenes listas para incrustar.")
