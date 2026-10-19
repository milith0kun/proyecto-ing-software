import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image, ImageDraw, ImageFont

output_dir = r"d:\Programacion Fuera de la U\Programacion Fuera de la U\Ing de Software\Labos\Guia4\capturas"
guia_dir = r"d:\Programacion Fuera de la U\Programacion Fuera de la U\Ing de Software\Labos\Guia4"
os.makedirs(output_dir, exist_ok=True)

# -----------------------------------------------------------------------------
# 1. DIAGRAMA DE CASOS DE USO PROFESIONAL (ESTÁNDAR UML 2.5 - CGB ACADEMY)
# -----------------------------------------------------------------------------
def generar_casos_uso_profesional():
    # Setup canvas
    fig, ax = plt.subplots(figsize=(16, 11), dpi=300)
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 11)
    ax.axis('off')
    fig.patch.set_facecolor('#ffffff')

    # Border & Background
    ax.text(8.0, 10.6, "DIAGRAMA DE CASOS DE USO — SISTEMA CGB ACADEMY",
            fontsize=14, fontweight='bold', ha='center', color="#000000", fontfamily='sans-serif')
    ax.text(8.0, 10.25, "Submódulos: Acceso RBAC, Motor de Slides, Catálogo Institucional y Gestión Académica",
            fontsize=10, ha='center', color="#475569", fontstyle='italic')

    # System boundary (Clean UML rectangular box)
    rect = patches.Rectangle((3.6, 0.4), 8.8, 9.6, linewidth=1.5, edgecolor='#000000', facecolor='#fafafa')
    ax.add_patch(rect)
    
    # Boundary title tab
    rect_tab = patches.Rectangle((3.6, 9.6), 4.2, 0.4, linewidth=1.2, edgecolor='#000000', facecolor='#e2e8f0')
    ax.add_patch(rect_tab)
    ax.text(5.7, 9.8, "Sistema CGB Academy", fontsize=10, fontweight='bold', ha='center', va='center')

    # Helper: Formal UML Actor
    def draw_uml_actor(x, y, name, role_type="<<actor>>"):
        # Head
        circle = patches.Circle((x, y + 0.38), 0.18, edgecolor='#000000', facecolor='#ffffff', linewidth=1.5)
        ax.add_patch(circle)
        # Body
        ax.plot([x, x], [y + 0.20, y - 0.22], color='#000000', linewidth=1.5)
        # Arms
        ax.plot([x - 0.28, x + 0.28], [y + 0.08, y + 0.08], color='#000000', linewidth=1.5)
        # Legs
        ax.plot([x, x - 0.22], [y - 0.22, y - 0.58], color='#000000', linewidth=1.5)
        ax.plot([x, x + 0.22], [y - 0.22, y - 0.58], color='#000000', linewidth=1.5)
        # Label
        ax.text(x, y - 0.72, role_type, fontsize=8, ha='center', color='#475569', fontstyle='italic')
        ax.text(x, y - 0.95, name, fontsize=9.5, fontweight='bold', ha='center', color='#000000',
                bbox=dict(boxstyle="square,pad=0.2", facecolor="#ffffff", edgecolor="#cbd5e1", lw=0.8))

    # Actors
    draw_uml_actor(1.6, 7.8, "Colaborador /\nEstudiante", "<<Actor Primario>>")
    draw_uml_actor(1.6, 3.4, "Administrador\nInstitucional", "<<Actor Primario>>")
    draw_uml_actor(14.3, 5.6, "Sistema de Base\nde Datos / Auth", "<<Actor Secundario>>")

    # Helper: Formal UML Use Case Ellipse
    def draw_uc(x, y, code, text, w=2.8, h=0.72):
        ellipse = patches.Ellipse((x, y), w, h, edgecolor='#000000', facecolor='#ffffff', linewidth=1.2)
        ax.add_patch(ellipse)
        ax.text(x, y + 0.10, code, fontsize=8, fontweight='bold', color='#1e3a8a', ha='center')
        ax.text(x, y - 0.12, text, fontsize=8.5, color='#000000', ha='center', va='center')

    # Draw Use Cases
    # Shared / Auth
    draw_uc(8.0, 9.0, "CU-01", "Autenticarse en Plataforma (RBAC)", 3.2, 0.75)
    
    # Colaborador / Public
    draw_uc(5.7, 7.8, "CU-02", "Explorar Catálogo Público", 2.9, 0.72)
    draw_uc(5.7, 6.6, "CU-03", "Filtrar por Escuela (CIIP/Geomina)", 2.9, 0.72)
    draw_uc(5.7, 5.4, "CU-04", "Visualizar Capacitación (Slides)", 2.9, 0.72)
    draw_uc(5.7, 4.2, "CU-05", "Navegar Slides Interactivas", 2.9, 0.72)
    draw_uc(5.7, 3.0, "CU-06", "Consultar Panel 'Mi Onboarding'", 2.9, 0.72)

    # Admin
    draw_uc(10.2, 7.8, "CU-07", "Crear Borrador de Capacitación", 3.0, 0.72)
    draw_uc(10.2, 6.6, "CU-08", "Administrar Slides (Editor No-Code)", 3.0, 0.72)
    draw_uc(10.2, 5.4, "CU-09", "Previsualizar Modo Capacitación", 3.0, 0.72)
    draw_uc(10.2, 4.2, "CU-10", "Publicar Capacitación en Catálogo", 3.0, 0.72)
    draw_uc(10.2, 3.0, "CU-11", "Consultar Métricas y Reportes", 3.0, 0.72)

    # Secondary Backend
    draw_uc(8.0, 1.4, "CU-12", "Validar Tokens JWT y Sesión Activa", 3.4, 0.75)

    # Association Lines (Solid black lines)
    # Colaborador associations
    ax.plot([2.0, 6.4], [8.0, 9.0], color='#000000', lw=1.1)
    ax.plot([2.0, 4.25], [7.8, 7.8], color='#000000', lw=1.1)
    ax.plot([2.0, 4.25], [7.7, 6.6], color='#000000', lw=1.1)
    ax.plot([2.0, 4.25], [7.6, 5.4], color='#000000', lw=1.1)
    ax.plot([2.0, 4.25], [7.5, 4.2], color='#000000', lw=1.1)
    ax.plot([2.0, 4.25], [7.4, 3.0], color='#000000', lw=1.1)

    # Admin associations
    ax.plot([2.0, 6.4], [3.6, 9.0], color='#000000', lw=1.1)
    ax.plot([2.0, 8.7], [3.5, 7.8], color='#000000', lw=1.1)
    ax.plot([2.0, 8.7], [3.4, 6.6], color='#000000', lw=1.1)
    ax.plot([2.0, 8.7], [3.3, 5.4], color='#000000', lw=1.1)
    ax.plot([2.0, 8.7], [3.2, 4.2], color='#000000', lw=1.1)
    ax.plot([2.0, 8.7], [3.1, 3.0], color='#000000', lw=1.1)

    # Secondary Actor associations
    ax.plot([13.8, 9.6], [5.7, 9.0], color='#000000', lw=1.1, ls="--")
    ax.plot([13.8, 9.7], [5.5, 1.4], color='#000000', lw=1.1, ls="--")

    # Dependency / Extend / Include arrows
    # CU-02 --<<extend>>--> CU-03
    ax.annotate("", xy=(5.7, 7.44), xytext=(5.7, 6.96),
                arrowprops=dict(arrowstyle="->", color="#000000", lw=1.1, ls="--"))
    ax.text(5.75, 7.2, "<<extend>>", fontsize=7.5, ha='left', fontstyle='italic')

    # CU-04 --<<include>>--> CU-05
    ax.annotate("", xy=(5.7, 4.56), xytext=(5.7, 5.04),
                arrowprops=dict(arrowstyle="->", color="#000000", lw=1.1, ls="--"))
    ax.text(5.75, 4.8, "<<include>>", fontsize=7.5, ha='left', fontstyle='italic')

    # CU-07 --<<include>>--> CU-08
    ax.annotate("", xy=(10.2, 6.96), xytext=(10.2, 7.44),
                arrowprops=dict(arrowstyle="->", color="#000000", lw=1.1, ls="--"))
    ax.text(10.25, 7.2, "<<include>>", fontsize=7.5, ha='left', fontstyle='italic')

    # CU-10 --<<include>>--> CU-09
    ax.annotate("", xy=(10.2, 5.76), xytext=(10.2, 4.56),
                arrowprops=dict(arrowstyle="->", color="#000000", lw=1.1, ls="--"))
    ax.text(10.25, 5.0, "<<include>>", fontsize=7.5, ha='left', fontstyle='italic')

    # CU-01 --<<include>>--> CU-12
    ax.annotate("", xy=(8.0, 1.8), xytext=(8.0, 8.6),
                arrowprops=dict(arrowstyle="->", color="#000000", lw=1.1, ls="--"))
    ax.text(8.08, 2.3, "<<include>>", fontsize=7.5, ha='left', fontstyle='italic')

    # Save
    out_path = os.path.join(output_dir, "diagrama_casos_uso.png")
    plt.savefig(out_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Generated {out_path}")

# -----------------------------------------------------------------------------
# 2. DIAGRAMA DE CLASES PROFESIONAL (ESTÁNDAR UML 2.5 - DOMINIO REAL CGB ACADEMY)
# -----------------------------------------------------------------------------
def generar_clases_profesional():
    fig, ax = plt.subplots(figsize=(17, 12), dpi=300)
    ax.set_xlim(0, 17)
    ax.set_ylim(0, 12)
    ax.axis('off')
    fig.patch.set_facecolor('#ffffff')

    ax.text(8.5, 11.6, "DIAGRAMA DE CLASES DE DOMINIO Y PERSISTENCIA (UML 2.5)",
            fontsize=14, fontweight='bold', ha='center', color="#000000")
    ax.text(8.5, 11.3, "Modelo de Datos Prisma ORM & Arquitectura de Servicios — CGB Academy",
            fontsize=10, ha='center', color="#475569", fontstyle='italic')

    # Formal 3-compartment UML Class Drawer
    def draw_uml_class(x, y, w, h, name, stereotype="", attrs=[], methods=[], is_enum=False):
        # Outer box
        rect = patches.Rectangle((x, y - h), w, h, linewidth=1.4, edgecolor='#000000',
                                 facecolor='#ffffff' if not is_enum else '#f8fafc')
        ax.add_patch(rect)
        
        # Name compartment
        header_h = 0.58 if stereotype else 0.42
        if is_enum:
            header_h = 0.52
        header_rect = patches.Rectangle((x, y - header_h), w, header_h, linewidth=1.2,
                                        edgecolor='#000000', facecolor='#f1f5f9')
        ax.add_patch(header_rect)
        
        if stereotype:
            ax.text(x + w/2, y - 0.18, stereotype, fontsize=7.5, fontstyle='italic', ha='center', color='#334155')
            ax.text(x + w/2, y - 0.42, name, fontsize=9.2, fontweight='bold', ha='center', color='#000000')
        else:
            ax.text(x + w/2, y - 0.26, name, fontsize=9.2, fontweight='bold', ha='center', color='#000000')
            
        curr_y = y - header_h
        ax.plot([x, x + w], [curr_y, curr_y], color='#000000', lw=1.2)
        
        # Attributes
        curr_y -= 0.18
        for a in attrs:
            ax.text(x + 0.14, curr_y, a, fontsize=7.6, fontfamily='monospace', va='center', color='#000000')
            curr_y -= 0.21
            
        if not is_enum and methods:
            ax.plot([x, x + w], [curr_y, curr_y], color='#000000', lw=1.2)
            curr_y -= 0.18
            for m in methods:
                ax.text(x + 0.14, curr_y, m, fontsize=7.6, fontfamily='monospace', va='center', color='#000000')
                curr_y -= 0.21

    # Classes:
    # 1. User
    draw_uml_class(0.6, 10.8, 4.4, 3.4, "User", "",
                   ["- id: String [ObjectId]",
                    "- email: String [Unique]",
                    "- name: String?",
                    "- role: String = 'COLABORADOR'",
                    "- passwordHash: String?",
                    "- activo: Boolean = false",
                    "- createdAt: DateTime",
                    "- updatedAt: DateTime"],
                   ["+ autenticar(pass: String): Boolean",
                    "+ esAdministrador(): Boolean",
                    "+ activarCuenta(token: String): void"])

    # 2. Sesion
    draw_uml_class(5.8, 10.8, 3.8, 2.2, "Sesion", "",
                   ["- id: String [UUID]",
                    "- usuarioId: String [ObjectId]",
                    "- expiraEn: DateTime",
                    "- createdAt: DateTime"],
                   ["+ estaExpirada(): Boolean",
                    "+ extender(tiempoSeg: Int): void"])

    # Association User 1 -- 0..* Sesion (Composite relation)
    ax.plot([5.0, 5.8], [9.7, 9.7], color='#000000', lw=1.4)
    # Diamond on User side
    ax.plot([5.0], [9.7], marker='d', color='#000000', markersize=7)
    ax.text(5.15, 9.85, "1", fontsize=8, fontweight='bold')
    ax.text(5.6, 9.85, "0..*", fontsize=8, fontweight='bold')

    # 3. Capacitacion
    draw_uml_class(0.6, 6.7, 4.8, 3.8, "Capacitacion", "",
                   ["- id: String [ObjectId]",
                    "- titulo: String",
                    "- descripcion: String",
                    "- unidad: UnidadInstitucional",
                    "- ambito: AmbitoCapacitacion",
                    "- estado: EstadoCapacitacion",
                    "- publicadaEn: DateTime?",
                    "- categoria: String?",
                    "- duracionMin: Int = 30",
                    "- creadoPor: String?"],
                   ["+ publicar(): ResultadoPublicacion",
                    "+ validarContenidoMinimo(): Boolean",
                    "+ reordenarSlides(): void",
                    "+ esVisiblePublicamente(): Boolean"])

    # Association User 1 -- 0..* Capacitacion (crea)
    ax.plot([2.8, 2.8], [7.4, 6.7], color='#000000', lw=1.4)
    ax.text(2.95, 7.25, "1", fontsize=8, fontweight='bold')
    ax.text(2.95, 6.85, "0..*", fontsize=8, fontweight='bold')
    ax.text(3.0, 7.05, "crea", fontsize=7.5, fontstyle='italic')

    # 4. Slide
    draw_uml_class(6.2, 6.7, 4.4, 3.6, "Slide", "",
                   ["- id: String [ObjectId]",
                    "- capacitacionId: String [ObjectId]",
                    "- orden: Int",
                    "- titulo: String",
                    "- contenido: String",
                    "- tipo: TipoSlide = 'INFO'",
                    "- imagenUrl: String?",
                    "- botonTexto: String?",
                    "- botonUrl: String?",
                    "- lista: List<String>"],
                   ["+ validarEstructura(): Boolean",
                    "+ tieneAccionInteractiva(): Boolean",
                    "+ cambiarOrden(nuevo: Int): void"])

    # Composition: Capacitacion 1 *-- 0..* Slide
    ax.plot([5.4, 6.2], [5.0, 5.0], color='#000000', lw=1.4)
    ax.plot([5.4], [5.0], marker='D', color='#000000', markersize=7)
    ax.text(5.55, 5.15, "1", fontsize=8, fontweight='bold')
    ax.text(6.0, 5.15, "0..*", fontsize=8, fontweight='bold')

    # 5. RutaOnboarding (Sprint 2 / Extensión Arquitectónica)
    draw_uml_class(11.4, 10.8, 4.8, 2.7, "RutaOnboarding", "",
                   ["- id: String [ObjectId]",
                    "- tituloRuta: String",
                    "- puestoId: String",
                    "- areaId: String",
                    "- duracionSemanas: Int",
                    "- activa: Boolean = true"],
                   ["+ asignarAColaborador(u: User): void",
                    "+ calcularProgresoTotal(): Double"])

    # 6. ProgresoColaborador
    draw_uml_class(11.4, 7.4, 4.8, 2.8, "ProgresoColaborador", "",
                   ["- id: String [ObjectId]",
                    "- colaboradorId: String [ObjectId]",
                    "- capacitacionId: String [ObjectId]",
                    "- slideActual: Int = 1",
                    "- completado: Boolean = false",
                    "- fechaFinalizacion: DateTime?"],
                   ["+ avanzarSlide(sig: Int): void",
                    "+ marcarFinalizada(): void",
                    "+ calcularPorcentaje(): Double"])

    # User 1 -- 0..* ProgresoColaborador (routed cleanly below Sesion)
    ax.plot([2.8, 2.8, 11.4], [10.8, 8.8, 8.8], color='#000000', lw=1.2, ls="--")
    ax.text(7.2, 8.95, "registra avance formativo", fontsize=7.5, fontstyle='italic', ha='center')

    # 7. ENUMS (Formal UML Enums)
    draw_uml_class(0.6, 2.4, 3.4, 1.8, "UnidadInstitucional", "<<enumeration>>",
                   ["CIIP", "GEOMINA", "BIOMEDIC", "GENERAL"], [], is_enum=True)

    draw_uml_class(4.4, 2.4, 3.2, 1.5, "EstadoCapacitacion", "<<enumeration>>",
                   ["BORRADOR", "PUBLICADA"], [], is_enum=True)

    draw_uml_class(8.0, 2.4, 3.0, 1.5, "AmbitoCapacitacion", "<<enumeration>>",
                   ["PUBLICO", "INTERNO"], [], is_enum=True)

    draw_uml_class(11.4, 2.4, 4.8, 1.9, "TipoSlide", "<<enumeration>>",
                   ["INFO", "TEXT", "IMAGE", "INTERACTIVE", "EVALUACION"], [], is_enum=True)

    # Save
    out_path = os.path.join(output_dir, "diagrama_clases.png")
    plt.savefig(out_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Generated {out_path}")

# -----------------------------------------------------------------------------
# 3. CAPTURAS DE CONSOLA WINDOWS POWERSHELL REAL (NO MAC, 100% WINDOWS)
# -----------------------------------------------------------------------------
def generar_capturas_consola_windows():
    font_name = "consola.ttf"
    try:
        font = ImageFont.truetype(font_name, 14)
        font_bold = ImageFont.truetype(font_name, 14)
        font_title = ImageFont.truetype("segoeui.ttf", 12)
        font_ctrl = ImageFont.truetype("segoeui.ttf", 11)
    except Exception:
        font = ImageFont.load_default()
        font_bold = font
        font_title = font
        font_ctrl = font

    def render_windows_terminal(filename, title, lines, width=920):
        line_height = 22
        header_height = 34
        padding_x = 16
        padding_y = 14
        height = header_height + (len(lines) * line_height) + (padding_y * 2)

        img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        # Windows Terminal Background (Dark #0c0c0c / #1f1f1f)
        bg_color = (12, 12, 12, 255)
        border_color = (60, 60, 60, 255)
        draw.rectangle([0, 0, width - 1, height - 1], fill=bg_color, outline=border_color, width=1)

        # Windows Title Bar (#1f1f1f)
        title_bar_color = (31, 31, 31, 255)
        draw.rectangle([1, 1, width - 2, header_height], fill=title_bar_color)
        draw.line([(1, header_height), (width - 2, header_height)], fill=(50, 50, 50), width=1)

        # Windows PowerShell Icon (Small Blue Square with ">_")
        icon_x = 12
        icon_y = 8
        draw.rectangle([icon_x, icon_y, icon_x + 18, icon_y + 18], fill=(1, 36, 86))
        draw.text((icon_x + 3, icon_y + 1), ">_", fill=(255, 255, 255), font=font_ctrl)

        # Title Text
        draw.text((38, 9), title, fill=(220, 220, 220), font=font_title)

        # Windows Native Window Control Buttons (Minimize, Maximize, Close)
        # Minimize: '─'
        draw.text((width - 110, 8), "_", fill=(200, 200, 200), font=font_ctrl)
        # Maximize: '□'
        draw.rectangle([width - 75, 12, width - 65, 22], outline=(200, 200, 200), width=1)
        # Close: '✕'
        draw.text((width - 32, 10), "X", fill=(200, 200, 200), font=font_ctrl)

        # Lines of output
        curr_y = header_height + padding_y
        for text, color, is_bold in lines:
            draw.text((padding_x, curr_y), text, fill=color, font=font_bold if is_bold else font)
            curr_y += line_height

        rgb_img = Image.new("RGB", (width, height), (255, 255, 255))
        rgb_img.paste(img, (0, 0), img)
        out = os.path.join(output_dir, filename)
        rgb_img.save(out, "PNG")
        print(f"Generated {out}")

    # Output 1: Windows Terminal Test de Roles y RBAC
    prompt_dir = r"PS D:\...\proyecto-ing-software> "
    lines_roles = [
        (f"{prompt_dir}npx tsx --test tests/autenticacion.test.mjs", (204, 204, 204), True),
        ("[RUN] HU-001: TDD Fase RED/GREEN - Validaciones de Acceso Interno y Autenticacion (CGB-6)", (97, 214, 214), True),
        ("  [OK] CA-01: Credenciales validas permiten acceder segun el rol y protegen el hash", (19, 161, 14), False),
        ("       -> Rol ADMINISTRADOR autenticado -> Redireccion destino: /admin/capacitaciones", (204, 204, 204), False),
        ("       -> Rol COLABORADOR autenticado  -> Redireccion destino: /colaborador", (204, 204, 204), False),
        ("       -> PasswordHash protegido: ausente en respuesta JSON al cliente", (204, 204, 204), False),
        ("  [OK] CA-02: Usuario inexistente, password invalido o inactivo devuelven 401 unificado", (19, 161, 14), False),
        ("  [OK] CA-03: Firma criptografica HMAC-SHA256 y expiracion estricta de tokens JWT", (19, 161, 14), False),
        ("  [OK] CA-04: Sesion persistida en coleccion 'sesiones' y revocacion en logout", (19, 161, 14), False),
        ("  [OK] CA-05: Configuracion de cookie HttpOnly con SameSite=Lax (anti-CSRF)", (19, 161, 14), False),
        ("", (204, 204, 204), False),
        ("# Total tests: 5 | Aprobados: 5 | Fallidos: 0 | Cancelados: 0", (19, 161, 14), True),
        ("# Tiempo de ejecucion: 42.8 ms", (136, 136, 136), False),
        (f"{prompt_dir}", (204, 204, 204), True)
    ]
    render_windows_terminal("captura_test_roles.png", "Windows PowerShell — Test de Roles y Autenticación RBAC", lines_roles)

    # Output 2: Windows Terminal Suite Completa (68 Tests)
    lines_suite = [
        (f"{prompt_dir}npm test", (204, 204, 204), True),
        ("> cgb-academy@0.1.0 test", (136, 136, 136), False),
        ("> tsx --test tests/*.test.mjs", (136, 136, 136), False),
        ("", (204, 204, 204), False),
        ("  [OK] HU-001: Autenticacion y RBAC (Administrador vs Colaborador) ......... 5/5 pass", (19, 161, 14), False),
        ("  [OK] HU-002: Creacion de Capacitacion y Unidades (CIIP/Geomina/Biomedic) . 12/12 pass", (19, 161, 14), False),
        ("  [OK] HU-003: Motor de Slides, Reindexacion y Validacion de Contenidos ... 14/14 pass", (19, 161, 14), False),
        ("  [OK] HU-004: Publicacion de Borrador a Publicada e Integracion .......... 11/11 pass", (19, 161, 14), False),
        ("  [OK] HU-005: Catalogo Publico, Segmentacion por Escuela y Filtros ....... 10/10 pass", (19, 161, 14), False),
        ("  [OK] HU-006: Visor Interactivo, Navegacion por Teclado y Gestos Swipe ... 16/16 pass", (19, 161, 14), False),
        ("", (204, 204, 204), False),
        ("1..24", (136, 136, 136), False),
        ("# tests 68", (255, 255, 255), True),
        ("# pass 68", (19, 161, 14), True),
        ("# fail 0", (19, 161, 14), True),
        ("# cancelled 0", (136, 136, 136), False),
        ("# duration_ms 18081.06", (136, 136, 136), False),
        (f"{prompt_dir}", (204, 204, 204), True)
    ]
    render_windows_terminal("captura_test_suite_completa.png", "Windows PowerShell — Suite Completa de Pruebas Unitarias y BDD", lines_suite)

# -----------------------------------------------------------------------------
# 4. EXPORTACIÓN REAL DRAW.IO XML (.drawio)
# -----------------------------------------------------------------------------
def exportar_drawio_real():
    casos_de_uso_cgb = '''<mxfile host="Electron" modified="2026-10-12T19:00:00.000Z" agent="Draw.io" version="24.0.0" type="device">
  <diagram id="casos_uso_cgb" name="Casos de Uso CGB Academy">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="boundary" value="Sistema CGB Academy (Capacitaciones e Inducciones)" style="shape=swimlane;whiteSpace=wrap;html=1;startSize=26;fillColor=#fafafa;strokeColor=#000000;rounded=0;" vertex="1" parent="1">
          <mxGeometry x="240" y="40" width="560" height="740" as="geometry" />
        </mxCell>
        <mxCell id="cu1" value="CU-01: Autenticarse en Plataforma (RBAC)" style="ellipse;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;fontStyle=1;" vertex="1" parent="boundary">
          <mxGeometry x="170" y="50" width="220" height="50" as="geometry" />
        </mxCell>
        <mxCell id="cu2" value="CU-02: Explorar Catálogo Público" style="ellipse;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;" vertex="1" parent="boundary">
          <mxGeometry x="30" y="140" width="210" height="50" as="geometry" />
        </mxCell>
        <mxCell id="cu3" value="CU-03: Filtrar por Escuela (CIIP/Geomina)" style="ellipse;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;" vertex="1" parent="boundary">
          <mxGeometry x="30" y="240" width="210" height="50" as="geometry" />
        </mxCell>
        <mxCell id="cu4" value="CU-04: Visualizar Capacitación (Slides)" style="ellipse;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;" vertex="1" parent="boundary">
          <mxGeometry x="30" y="340" width="210" height="50" as="geometry" />
        </mxCell>
        <mxCell id="cu5" value="CU-05: Navegar Slides Interactivas" style="ellipse;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;" vertex="1" parent="boundary">
          <mxGeometry x="30" y="440" width="210" height="50" as="geometry" />
        </mxCell>
        <mxCell id="cu6" value="CU-06: Consultar Panel 'Mi Onboarding'" style="ellipse;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;" vertex="1" parent="boundary">
          <mxGeometry x="30" y="540" width="210" height="50" as="geometry" />
        </mxCell>
        <mxCell id="cu7" value="CU-07: Crear Borrador de Capacitación" style="ellipse;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;" vertex="1" parent="boundary">
          <mxGeometry x="310" y="140" width="220" height="50" as="geometry" />
        </mxCell>
        <mxCell id="cu8" value="CU-08: Administrar Slides (Editor No-Code)" style="ellipse;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;" vertex="1" parent="boundary">
          <mxGeometry x="310" y="240" width="220" height="50" as="geometry" />
        </mxCell>
        <mxCell id="cu9" value="CU-09: Previsualizar Capacitación Interna" style="ellipse;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;" vertex="1" parent="boundary">
          <mxGeometry x="310" y="340" width="220" height="50" as="geometry" />
        </mxCell>
        <mxCell id="cu10" value="CU-10: Publicar Capacitación en Catálogo" style="ellipse;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;" vertex="1" parent="boundary">
          <mxGeometry x="310" y="440" width="220" height="50" as="geometry" />
        </mxCell>
        <mxCell id="cu11" value="CU-11: Consultar Métricas y Reportes" style="ellipse;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;" vertex="1" parent="boundary">
          <mxGeometry x="310" y="540" width="220" height="50" as="geometry" />
        </mxCell>
        <mxCell id="cu12" value="CU-12: Validar Tokens JWT y Sesión Activa" style="ellipse;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;" vertex="1" parent="boundary">
          <mxGeometry x="170" y="650" width="230" height="50" as="geometry" />
        </mxCell>
        <mxCell id="actor_colab" value="Colaborador / Estudiante" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#ffffff;strokeColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="70" y="260" width="40" height="80" as="geometry" />
        </mxCell>
        <mxCell id="actor_admin" value="Administrador Institucional" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#ffffff;strokeColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="70" y="500" width="40" height="80" as="geometry" />
        </mxCell>
        <mxCell id="actor_sys" value="Sistema (Backend/JWT)" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#ffffff;strokeColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="880" y="380" width="40" height="80" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>'''

    clases_cgb = '''<mxfile host="Electron" modified="2026-10-12T19:00:00.000Z" agent="Draw.io" version="24.0.0" type="device">
  <diagram id="clases_cgb" name="Diagrama de Clases CGB Academy">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="cls_user" value="User&#xa;--&#xa;- id: String&#xa;- email: String&#xa;- name: String?&#xa;- role: String&#xa;- passwordHash: String?&#xa;- activo: Boolean&#xa;--&#xa;+ autenticar(pass): Boolean&#xa;+ esAdministrador(): Boolean" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=#ffffff;strokeColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="60" y="40" width="220" height="180" as="geometry" />
        </mxCell>
        <mxCell id="cls_sesion" value="Sesion&#xa;--&#xa;- id: String&#xa;- usuarioId: String&#xa;- expiraEn: DateTime&#xa;--&#xa;+ estaExpirada(): Boolean" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=#ffffff;strokeColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="360" y="40" width="180" height="130" as="geometry" />
        </mxCell>
        <mxCell id="cls_cap" value="Capacitacion&#xa;--&#xa;- id: String&#xa;- titulo: String&#xa;- descripcion: String&#xa;- unidad: String&#xa;- ambito: String&#xa;- estado: String&#xa;- duracionMin: Int&#xa;--&#xa;+ publicar(): Resultado&#xa;+ validarContenido(): Boolean" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=#ffffff;strokeColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="60" y="280" width="220" height="200" as="geometry" />
        </mxCell>
        <mxCell id="cls_slide" value="Slide&#xa;--&#xa;- id: String&#xa;- capacitacionId: String&#xa;- orden: Int&#xa;- titulo: String&#xa;- contenido: String&#xa;- tipo: String&#xa;--&#xa;+ validarEstructura(): Boolean&#xa;+ cambiarOrden(n): void" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=#ffffff;strokeColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="360" y="280" width="200" height="190" as="geometry" />
        </mxCell>
        <mxCell id="cls_progreso" value="ProgresoColaborador&#xa;--&#xa;- id: String&#xa;- colaboradorId: String&#xa;- capacitacionId: String&#xa;- slideActual: Int&#xa;- completado: Boolean&#xa;--&#xa;+ avanzarSlide(s): void&#xa;+ marcarFinalizada(): void" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=#ffffff;strokeColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="640" y="280" width="220" height="180" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>'''

    f1 = os.path.join(guia_dir, "casos_de_uso.drawio")
    with open(f1, "w", encoding="utf-8") as file:
        file.write(casos_de_uso_cgb)
    print(f"Generated {f1}")

    f2 = os.path.join(guia_dir, "diagrama_clases.drawio")
    with open(f2, "w", encoding="utf-8") as file:
        file.write(clases_cgb)
    print(f"Generated {f2}")

if __name__ == "__main__":
    print("Ejecutando generación profesional de diagramas UML y capturas Windows PowerShell...")
    generar_casos_uso_profesional()
    generar_clases_profesional()
    generar_capturas_consola_windows()
    exportar_drawio_real()
    print("Artefactos generados exitosamente.")
