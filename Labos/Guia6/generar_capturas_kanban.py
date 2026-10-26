import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

output_dir = "/opt/data/proyecto-ing-software/Labos/Guia6/capturas"
os.makedirs(output_dir, exist_ok=True)

# -------------------------------------------------------------------------
# 1. TABLERO KANBAN PROFESIONAL (Simulación Jira / Trello en CGB Academy)
# -------------------------------------------------------------------------
def generar_tablero_kanban():
    fig, ax = plt.subplots(figsize=(16, 9.5), dpi=300)
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 9.5)
    ax.axis('off')
    fig.patch.set_facecolor('#0f172a')  # Slate 900 dark background

    # Header de la aplicación (Jira / GitHub Projects style)
    header = patches.Rectangle((0, 8.4), 16, 1.1, facecolor='#1e293b', edgecolor='#334155', lw=1.5)
    ax.add_patch(header)
    ax.text(0.5, 9.05, "CGB ACADEMY  |  Tablero Kanban de Ingeniería de Software (Sprint 1)",
            fontsize=15, fontweight='bold', color='#f8fafc', va='center')
    ax.text(0.5, 8.65, "Proyecto: Centro de Capacitación e Inducción (CIIP Latam / GEOMINA / BIOMEDIC)  •  Límites WIP Activos  •  UNSAAC",
            fontsize=10.5, color='#94a3b8', va='center')

    # Status / Quick Filters
    ax.text(12.2, 8.85, "Filtro: Todos los Desarrolladores", fontsize=9.5, color='#38bdf8',
            bbox=dict(boxstyle="round,pad=0.3", facecolor="#0369a1", edgecolor="#0284c7", alpha=0.4))

    # Definición de Columnas
    cols = [
        {"name": "BACKLOG", "wip": "∞", "count": "2 historias", "x": 0.4, "w": 2.8, "hdr_color": "#475569"},
        {"name": "POR HACER (To Do)", "wip": "WIP: 3", "count": "1 historia", "x": 3.5, "w": 2.8, "hdr_color": "#0284c7"},
        {"name": "EN PROGRESO", "wip": "WIP: 2 (Max)", "count": "2 historias", "x": 6.6, "w": 2.8, "hdr_color": "#d97706"},
        {"name": "EN REVISIÓN (PR)", "wip": "WIP: 2 (Max)", "count": "2 historias (¡Cuello!)", "x": 9.7, "w": 2.8, "hdr_color": "#dc2626"},
        {"name": "TERMINADO (Done)", "wip": "∞", "count": "3 historias", "x": 12.8, "w": 2.8, "hdr_color": "#16a34a"},
    ]

    for col in cols:
        # Columna de fondo
        bg = patches.FancyBboxPatch((col["x"], 0.4), col["w"], 7.8, boxstyle="round,pad=0.1",
                                    facecolor="#1e293b", edgecolor="#334155", lw=1.2)
        ax.add_patch(bg)
        # Cabecera de columna
        hdr = patches.FancyBboxPatch((col["x"] + 0.05, 7.4), col["w"] - 0.1, 0.7, boxstyle="round,pad=0.08",
                                     facecolor=col["hdr_color"], edgecolor="none")
        ax.add_patch(hdr)
        ax.text(col["x"] + col["w"]/2, 7.82, col["name"], fontsize=10.5, fontweight='bold', color="#ffffff", ha='center', va='center')
        ax.text(col["x"] + col["w"]/2, 7.52, f"{col['wip']}  •  {col['count']}", fontsize=8.5, color="#f1f5f9", ha='center', va='center')

    # Función para dibujar Tarjeta de Historia de Usuario
    def draw_card(x, y, hu_id, title, role, priority, points, color_tag, border_alert=False):
        card_w = 2.6
        card_h = 1.35
        bc = "#ef4444" if border_alert else "#475569"
        lw = 2.2 if border_alert else 1.0
        bg_card = "#0f172a"
        card = patches.FancyBboxPatch((x, y), card_w, card_h, boxstyle="round,pad=0.08",
                                      facecolor=bg_card, edgecolor=bc, lw=lw)
        ax.add_patch(card)

        # Tag superior
        tag = patches.Rectangle((x + 0.1, y + card_h - 0.28), 0.7, 0.2, facecolor=color_tag)
        ax.add_patch(tag)
        ax.text(x + 0.45, y + card_h - 0.18, hu_id, fontsize=7.5, fontweight='bold', color="#ffffff", ha='center', va='center')

        # Prioridad y puntos
        ax.text(x + card_w - 0.12, y + card_h - 0.18, f"{priority} • {points} pts", fontsize=7.5, color="#94a3b8", ha='right', va='center')

        # Título
        ax.text(x + 0.12, y + card_h - 0.52, title, fontsize=8.2, fontweight='bold', color="#f8fafc", va='top', wrap=True)

        # Footer tarjeta: Responsable
        avatar_col = "#38bdf8"
        circ = patches.Circle((x + 0.25, y + 0.22), 0.12, facecolor=avatar_col)
        ax.add_patch(circ)
        ax.text(x + 0.45, y + 0.22, role, fontsize=7.5, color="#cbd5e1", va='center')

    # --- TARJETAS EN BACKLOG (x=0.5) ---
    draw_card(0.5, 5.8, "HU-006", "Generación automática de certificados\ncon código QR para aprobados", "Ronaldo Ticona", "Baja", "5", "#64748b")
    draw_card(0.5, 4.2, "HU-007", "Módulo de analítica y tasas de\ncompletitud por unidad de negocio", "Alex Carpio", "Media", "8", "#64748b")

    # --- TARJETAS EN POR HACER (x=3.6) ---
    draw_card(3.6, 5.8, "HU-008", "Control de asistencias por QR en\nsesiones presenciales (AulaActiva)", "Domingo Quispe", "Alta", "5", "#0284c7")

    # --- TARJETAS EN PROGRESO (x=6.7) - WIP: 2 ---
    draw_card(6.7, 5.8, "HU-004", "Visor de diapositivas interactivas con\ncontrol de tiempo y asistencia", "Edmil Saire", "Muy Alta", "8", "#f59e0b")
    draw_card(6.7, 4.2, "HU-003", "Módulo de gestión de usuarios y roles\n(RBAC) con Prisma y MongoDB", "Hector Barazorda", "Alta", "5", "#f59e0b")

    # --- TARJETAS EN REVISIÓN (x=9.8) - CUELLO DE BOTELLA (WIP saturado) ---
    draw_card(9.8, 5.8, "HU-002", "Panel administrativo para creación\nde capacitaciones e inducciones", "Domingo Quispe", "Alta", "8", "#ef4444", border_alert=True)
    draw_card(9.8, 4.2, "HU-005", "Catálogo público multi-marca\n(CIIP, GEOMINA, BIOMEDIC)", "Alex Carpio", "Alta", "5", "#ef4444", border_alert=True)

    # Alerta visual en Revisión (Pull Request Review Bottleneck)
    alert_box = patches.FancyBboxPatch((9.85, 2.7), 2.5, 1.2, boxstyle="round,pad=0.08",
                                        facecolor="#450a0a", edgecolor="#ef4444", lw=1.5)
    ax.add_patch(alert_box)
    ax.text(11.1, 3.65, "⚠️ CUELLO DE BOTELLA", fontsize=9, fontweight='bold', color="#fca5a5", ha='center')
    ax.text(11.1, 3.25, "Límite WIP (2/2) alcanzado.\n2 PRs pendientes de Code Review.\nSe requiere desatascar antes de mover.",
            fontsize=7.3, color="#fecaca", ha='center', va='center')

    # --- TARJETAS EN TERMINADO (x=12.9) ---
    draw_card(12.9, 5.8, "HU-001", "Autenticación segura con NextAuth.js\ny persistencia de sesiones seguras", "Edmil Saire", "Crítica", "5", "#10b981")
    draw_card(12.9, 4.2, "HU-009", "Diseño del sistema de marca e\nidentidad institucional (Tokens CSS)", "Ronaldo Ticona", "Alta", "3", "#10b981")
    draw_card(12.9, 2.6, "HU-010", "Configuración de entorno Docker y\ndespliegue continuo en Dokploy VPS", "Edmil Saire", "Media", "5", "#10b981")

    # Pie de tablero con métricas en tiempo real
    footer_rect = patches.Rectangle((0, 0), 16, 0.4, facecolor="#0f172a", edgecolor="none")
    ax.add_patch(footer_rect)
    ax.text(0.5, 0.2, "Métricas del Tablero: Throughput Semanal = 3 historias | Lead Time Promedio = 4.2 días | Cycle Time = 1.8 días | WIP Total = 4",
            fontsize=9, color="#94a3b8", va='center')

    plt.tight_layout()
    output_path = os.path.join(output_dir, "tablero_kanban_cgb.png")
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"[OK] Generado: {output_path}")

# -------------------------------------------------------------------------
# 2. DIAGRAMA DE FLUJO ACUMULADO (CFD - Cumulative Flow Diagram)
# -------------------------------------------------------------------------
def generar_cfd():
    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
    fig.patch.set_facecolor('#ffffff')

    dias = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])

    # Cantidad acumulada por estado
    done = np.array([0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 5])
    review = done + np.array([0, 1, 1, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2, 1])
    in_prog = review + np.array([1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2])
    todo = in_prog + np.array([3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0])
    backlog = todo + np.array([4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2])

    ax.plot(dias, backlog, color='#334155', lw=1.5, label='Backlog')
    ax.plot(dias, todo, color='#0284c7', lw=1.5, label='Por hacer (To Do)')
    ax.plot(dias, in_prog, color='#d97706', lw=1.5, label='En progreso (In Progress)')
    ax.plot(dias, review, color='#dc2626', lw=1.5, label='En revisión (Review - Cuello)')
    ax.plot(dias, done, color='#16a34a', lw=1.5, label='Terminado (Done)')

    ax.fill_between(dias, 0, done, color='#dcfce7', alpha=0.85)
    ax.fill_between(dias, done, review, color='#fee2e2', alpha=0.7)
    ax.fill_between(dias, review, in_prog, color='#fef3c7', alpha=0.7)
    ax.fill_between(dias, in_prog, todo, color='#e0f2fe', alpha=0.7)
    ax.fill_between(dias, todo, backlog, color='#f1f5f9', alpha=0.8)

    # Indicación de Lead Time y Cycle Time
    ax.annotate('Cycle Time: ~2.1 días', xy=(6, 2), xytext=(2, 4.5),
                arrowprops=dict(arrowstyle='<->', color='#0f172a', lw=1.8),
                fontsize=9.5, fontweight='bold', bbox=dict(boxstyle="round,pad=0.3", fc="#ffffff", ec="#0f172a"))

    ax.annotate('Lead Time: ~4.5 días', xy=(10, 3), xytext=(4, 7.5),
                arrowprops=dict(arrowstyle='<->', color='#b91c1c', lw=1.8),
                fontsize=9.5, fontweight='bold', bbox=dict(boxstyle="round,pad=0.3", fc="#ffffff", ec="#b91c1c"))

    # Anotación del cuello de botella en revisión
    ax.annotate('Cuello de botella en Code Review\n(Banda roja ensanchada)', xy=(7.5, 4.2), xytext=(7.8, 2.5),
                arrowprops=dict(arrowstyle='->', color='#dc2626', lw=1.5),
                fontsize=9, fontweight='bold', color='#991b1b',
                bbox=dict(boxstyle="round,pad=0.3", fc="#fef2f2", ec="#ef4444"))

    ax.set_title("Diagrama de Flujo Acumulado (CFD) — Sprint 1 (14 Días)\nProyecto CGB Academy", fontsize=12, fontweight='bold', color="#0f172a", pad=12)
    ax.set_xlabel("Día del Sprint (Días laborables)", fontsize=10, fontweight='bold', color="#1e293b")
    ax.set_ylabel("Número Acumulado de Tareas / Historias", fontsize=10, fontweight='bold', color="#1e293b")
    ax.set_xticks(dias)
    ax.set_yticks(range(0, 12))
    ax.grid(True, linestyle='--', alpha=0.4)
    ax.legend(loc='upper left', fontsize=8.5, framealpha=0.95)

    plt.tight_layout()
    output_path = os.path.join(output_dir, "cfd_sprint1_cgb.png")
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"[OK] Generado: {output_path}")

# -------------------------------------------------------------------------
# 3. GRÁFICA DE MÉTRICAS (Cycle Time vs Lead Time por Historia)
# -------------------------------------------------------------------------
def generar_grafica_metricas():
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    fig.patch.set_facecolor('#ffffff')

    historias = ['HU-001\nAuth', 'HU-009\nMarca', 'HU-010\nDokploy', 'HU-004\nVisor', 'HU-003\nRBAC', 'HU-002\nPanel Adm', 'HU-005\nCatálogo']
    lead_time = [3.5, 2.0, 3.0, 5.5, 4.5, 6.0, 5.2]
    cycle_time = [1.5, 1.0, 1.2, 2.5, 1.8, 3.8, 3.2]

    x = np.arange(len(historias))
    width = 0.35

    rects1 = ax.bar(x - width/2, lead_time, width, label='Lead Time (Días desde creación)', color='#0284c7')
    rects2 = ax.bar(x + width/2, cycle_time, width, label='Cycle Time (Días en desarrollo/revisión)', color='#d97706')

    ax.axhline(y=4.2, color='#0284c7', linestyle='--', lw=1.2, label='Lead Time Promedio (4.2 d)')
    ax.axhline(y=2.1, color='#d97706', linestyle='--', lw=1.2, label='Cycle Time Promedio (2.1 d)')

    # Labels en las barras
    for rect in rects1:
        height = rect.get_height()
        ax.annotate(f'{height}d', xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=8, fontweight='bold')
    for rect in rects2:
        height = rect.get_height()
        ax.annotate(f'{height}d', xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=8, fontweight='bold')

    ax.set_title("Comparativa de Métricas Kanban por Historia de Usuario\nLead Time vs. Cycle Time en CGB Academy", fontsize=11, fontweight='bold', color="#0f172a", pad=12)
    ax.set_ylabel("Duración en Días Calendario", fontsize=10, fontweight='bold', color="#1e293b")
    ax.set_xticks(x)
    ax.set_xticklabels(historias, fontsize=9)
    ax.set_ylim(0, 7.5)
    ax.grid(True, linestyle='--', alpha=0.3, axis='y')
    ax.legend(loc='upper left', fontsize=8.5, framealpha=0.95)

    plt.tight_layout()
    output_path = os.path.join(output_dir, "metricas_lead_cycle_cgb.png")
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"[OK] Generado: {output_path}")

if __name__ == '__main__':
    generar_tablero_kanban()
    generar_cfd()
    generar_grafica_metricas()
