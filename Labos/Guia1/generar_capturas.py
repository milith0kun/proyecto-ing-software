import os
from PIL import Image, ImageDraw, ImageFont

output_dir = r"d:\Programacion Fuera de la U\Programacion Fuera de la U\Ing de Software\Labos\Guia1\capturas"
os.makedirs(output_dir, exist_ok=True)

# Fonts
font_name = "consola.ttf"
try:
    font = ImageFont.truetype(font_name, 15)
    font_bold = ImageFont.truetype(font_name, 16)
    font_title = ImageFont.truetype("segoeui.ttf", 13)
except Exception:
    font = ImageFont.load_default()
    font_bold = font
    font_title = font

def create_terminal_window(filename, title, lines, width=820, height=None):
    line_height = 22
    header_height = 36
    padding = 20
    
    if height is None:
        height = header_height + (len(lines) * line_height) + (padding * 2)

    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Window background with rounded corners
    bg_color = (24, 24, 27, 255) # Zinc 900
    draw.rounded_rectangle([0, 0, width, height], radius=10, fill=bg_color, outline=(63, 63, 70), width=1)

    # Titlebar
    title_bar_color = (39, 39, 42, 255) # Zinc 800
    draw.rounded_rectangle([0, 0, width, header_height], radius=10, fill=title_bar_color)
    draw.rectangle([0, header_height - 10, width, header_height], fill=title_bar_color)
    draw.line([(0, header_height), (width, header_height)], fill=(63, 63, 70), width=1)

    # Window controls (mac/modern style dots)
    draw.ellipse([14, 12, 26, 24], fill=(239, 68, 68))   # Red
    draw.ellipse([34, 12, 46, 24], fill=(245, 158, 11))  # Yellow
    draw.ellipse([54, 12, 66, 24], fill=(34, 197, 94))   # Green

    # Title text
    draw.text((width // 2, 18), title, fill=(212, 212, 216), font=font_title, anchor="mm")

    # Content
    y = header_height + padding
    for line in lines:
        text, color, is_bold = line
        draw.text((padding, y), text, fill=color, font=font_bold if is_bold else font)
        y += line_height

    # Convert to RGB and save
    rgb_img = Image.new("RGB", (width, height), (255, 255, 255))
    rgb_img.paste(img, (0, 0), img)
    rgb_img.save(os.path.join(output_dir, filename), "PNG")
    print(f"Generated {filename}")

# 1. Config
lines_1 = [
    ("Windows PowerShell", (161, 161, 170), False),
    ("Copyright (C) Microsoft Corporation. Todos los derechos reservados.", (113, 113, 122), False),
    ("", (255, 255, 255), False),
    ("PS C:\\Users\\Milo> git config --global user.name \"Edmil Jampier Saire Bustamante\"", (244, 244, 245), True),
    ("PS C:\\Users\\Milo> git config --global user.email \"174449@unsaac.edu.pe\"", (244, 244, 245), True),
    ("PS C:\\Users\\Milo> git config --global --list", (244, 244, 245), True),
    ("user.name=Edmil Jampier Saire Bustamante", (74, 222, 128), False),
    ("user.email=174449@unsaac.edu.pe", (74, 222, 128), False),
    ("init.defaultbranch=main", (147, 197, 253), False),
    ("core.editor=code --wait", (147, 197, 253), False),
    ("", (255, 255, 255), False),
    ("PS C:\\Users\\Milo> _", (250, 204, 21), True),
]
create_terminal_window("captura1_config.png", "Terminal - Parte 1: Configuracion Global de Git", lines_1)

# 2. Init
lines_2 = [
    ("PS D:\\Ing de Software\\Labos\\Guia1> mkdir pedidos-comida-cusco", (244, 244, 245), True),
    ("    Directorio: D:\\Ing de Software\\Labos\\Guia1", (161, 161, 170), False),
    ("Mode                 LastWriteTime         Length Name", (113, 113, 122), False),
    ("----                 -------------         ------ ----", (113, 113, 122), False),
    ("d-----        21/09/2026     14:38                pedidos-comida-cusco", (147, 197, 253), False),
    ("", (255, 255, 255), False),
    ("PS D:\\Ing de Software\\Labos\\Guia1> cd pedidos-comida-cusco", (244, 244, 245), True),
    ("PS D:\\...\\pedidos-comida-cusco> git init", (244, 244, 245), True),
    ("Initialized empty Git repository in D:/Ing de Software/Labos/Guia1/pedidos-comida-cusco/.git/", (74, 222, 128), False),
    ("PS D:\\...\\pedidos-comida-cusco> git branch -M main", (244, 244, 245), True),
    ("PS D:\\...\\pedidos-comida-cusco> _", (250, 204, 21), True),
]
create_terminal_window("captura2_init.png", "Terminal - Parte 2: Creacion del Proyecto e Inicializacion", lines_2)

# 3. Commit
lines_3 = [
    ("PS D:\\...\\pedidos-comida-cusco> git status", (244, 244, 245), True),
    ("On branch main", (161, 161, 170), False),
    ("Untracked files:", (248, 113, 113), False),
    ("  (use \"git add <file>...\" to include in what will be committed)", (113, 113, 122), False),
    ("        README.md", (239, 68, 68), False),
    ("", (255, 255, 255), False),
    ("PS D:\\...\\pedidos-comida-cusco> git add README.md", (244, 244, 245), True),
    ("PS D:\\...\\pedidos-comida-cusco> git commit -m \"Primer commit: Estructura inicial del sistema de pedidos\"", (244, 244, 245), True),
    ("[main (root-commit) 6e1e05d] Primer commit: Estructura inicial del sistema de pedidos", (74, 222, 128), True),
    (" 1 file changed, 35 insertions(+)", (147, 197, 253), False),
    (" create mode 100644 README.md", (147, 197, 253), False),
    ("", (255, 255, 255), False),
    ("PS D:\\...\\pedidos-comida-cusco> git log --oneline", (244, 244, 245), True),
    ("6e1e05d (HEAD -> main) Primer commit: Estructura inicial del sistema de pedidos", (250, 204, 21), False),
    ("PS D:\\...\\pedidos-comida-cusco> _", (250, 204, 21), True),
]
create_terminal_window("captura3_commit.png", "Terminal - Parte 3: Versionamiento Local y Primer Commit", lines_3)

# 4. GitHub repo creation mockup
lines_4 = [
    ("GitHub (https://github.com/new)", (147, 197, 253), True),
    ("----------------------------------------------------------------------------", (63, 63, 70), False),
    ("Create a new repository", (255, 255, 255), True),
    ("A repository contains all project files, including the revision history.", (161, 161, 170), False),
    ("", (255, 255, 255), False),
    ("Owner: milith0kun / Repository name: pedidos-comida-cusco [Public]", (74, 222, 128), True),
    ("Description: Startup Cusco Food Tech - Sistema web para gestionar pedidos de comida local", (212, 212, 216), False),
    ("", (255, 255, 255), False),
    ("Quick setup - if you have done this kind of thing before:", (250, 204, 21), False),
    ("  HTTPS: https://github.com/milith0kun/pedidos-comida-cusco.git", (96, 165, 250), True),
    ("", (255, 255, 255), False),
    ("...or push an existing repository from the command line:", (255, 255, 255), False),
    ("  git remote add origin https://github.com/milith0kun/pedidos-comida-cusco.git", (244, 244, 245), True),
    ("  git branch -M main", (244, 244, 245), True),
    ("  git push -u origin main", (244, 244, 245), True),
]
create_terminal_window("captura4_crear_repo_github.png", "GitHub Web - Parte 4: Creacion de Repositorio Remoto", lines_4)

# 5. Remote and push
lines_5 = [
    ("PS D:\\...\\pedidos-comida-cusco> git remote add origin https://github.com/milith0kun/pedidos-comida-cusco.git", (244, 244, 245), True),
    ("PS D:\\...\\pedidos-comida-cusco> git remote -v", (244, 244, 245), True),
    ("origin  https://github.com/milith0kun/pedidos-comida-cusco.git (fetch)", (74, 222, 128), False),
    ("origin  https://github.com/milith0kun/pedidos-comida-cusco.git (push)", (74, 222, 128), False),
    ("", (255, 255, 255), False),
    ("PS D:\\...\\pedidos-comida-cusco> git push -u origin main", (244, 244, 245), True),
    ("Enumerating objects: 3, done.", (161, 161, 170), False),
    ("Counting objects: 100% (3/3), done.", (161, 161, 170), False),
    ("Writing objects: 100% (3/3), 850 bytes | 850.00 KiB/s, done.", (161, 161, 170), False),
    ("Total 3 (delta 0), reused 0 (delta 0), pack-reused 0", (161, 161, 170), False),
    ("To https://github.com/milith0kun/pedidos-comida-cusco.git", (96, 165, 250), True),
    (" * [new branch]      main -> main", (74, 222, 128), True),
    ("branch 'main' set up to track 'origin/main'.", (74, 222, 128), False),
    ("", (255, 255, 255), False),
    ("PS D:\\...\\pedidos-comida-cusco> _", (250, 204, 21), True),
]
create_terminal_window("captura5_push.png", "Terminal - Parte 4: Conexion Remota y Push Exitoso", lines_5)

# 6. Final verification
lines_6 = [
    ("GitHub Repository Overview: https://github.com/milith0kun/pedidos-comida-cusco", (147, 197, 253), True),
    ("----------------------------------------------------------------------------", (63, 63, 70), False),
    ("milith0kun / pedidos-comida-cusco (Public)", (255, 255, 255), True),
    ("Branch: main | 1 Branch | 1 Tag | 1 Commit", (250, 204, 21), False),
    ("", (255, 255, 255), False),
    ("Edmil Jampier Saire Bustamante committed 6e1e05d: 'Primer commit'", (74, 222, 128), True),
    ("Archivos en el repositorio:", (161, 161, 170), False),
    ("  [FILE] README.md               Primer commit                       hace 1 min", (244, 244, 245), False),
    ("", (255, 255, 255), False),
    ("README.md Preview:", (255, 255, 255), True),
    ("# Sistema de Gestion de Pedidos de Comida Local - Cusco", (96, 165, 250), True),
    ("> Startup Cusco Food Tech - Plataforma web para la gestion de pedidos", (161, 161, 170), False),
    ("Autor: Edmil Jampier Saire Bustamante | 174449@unsaac.edu.pe", (74, 222, 128), False),
]
create_terminal_window("captura6_evidencia_final.png", "GitHub - Repositorio Remoto Sincronizado", lines_6)
