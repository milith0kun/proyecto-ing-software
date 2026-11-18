"""Genera las figuras del Laboratorio 7 a partir de capturas/jira_sprint2_data.json (datos reales de Jira)."""
import json, os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

AQUI = os.path.dirname(os.path.abspath(__file__))
CAP = os.path.join(AQUI, "capturas")
datos = json.load(open(os.path.join(CAP, "jira_sprint2_data.json"), encoding="utf-8"))["issues"]
NAVY, TEAL, GRIS = "#0B2545", "#139A8C", "#64748B"
COLORES = {"Alex Carpio": "#123466", "Domingo Quispe": "#139A8C", "Ronaldo Ticona": "#D97706", "Héctor Barazorda": "#7C3AED"}

# Figura 1: carga por responsable
fig, ax = plt.subplots(figsize=(9, 4.2))
personas = list(COLORES)
for p in personas:
    izq = 0
    for h in [d for d in datos if d["assignee"] == p]:
        ax.barh(p, h["sp"], left=izq, color=COLORES[p], edgecolor="white", linewidth=2)
        ax.text(izq + h["sp"] / 2, p, f'{h["key"]}\n{h["sp"]} SP', ha="center", va="center", color="white", fontsize=9, fontweight="bold")
        izq += h["sp"]
    ax.text(izq + 0.15, p, f"{izq} SP", va="center", color=NAVY, fontweight="bold")
ax.set_xlim(0, 10); ax.invert_yaxis()
ax.set_xlabel("Story Points asignados en el Sprint 2")
ax.set_title(f"Carga por desarrollador - Sprint 2 ({sum(d['sp'] for d in datos)} SP, datos de Jira 09/11/2026)", color=NAVY, fontweight="bold")
ax.spines[["top", "right"]].set_visible(False)
fig.tight_layout(); fig.savefig(os.path.join(CAP, "grafico_carga_sprint2.png"), dpi=200); plt.close(fig)

# Figura 2: Flujo de GitHub con las 8 ramas
fig, ax = plt.subplots(figsize=(9, 5))
ax.plot([0, 10], [8.5, 8.5], color=NAVY, lw=4, solid_capstyle="round")
ax.text(-0.1, 8.5, "main", ha="right", va="center", fontweight="bold", color=NAVY)
ax.scatter([0.6, 9.2], [8.5, 8.5], color=NAVY, zorder=3)
ax.text(0.6, 8.9, "af60a3b", ha="center", fontsize=8, color=GRIS)
ax.text(9.2, 8.9, "Squash and merge\n(PR revisado)", ha="center", fontsize=8, color=GRIS)
for i, d in enumerate(datos):
    y = 7.3 - i * 0.85
    c = COLORES[d["assignee"]]
    ax.plot([0.6, 1.4], [8.5, y], color=c, lw=2); ax.plot([1.4, 8.4], [y, y], color=c, lw=3)
    ax.plot([8.4, 9.2], [y, 8.5], color=c, lw=2, ls="--")
    ax.scatter([1.4, 3.4, 5.4, 7.4], [y] * 4, color=c, s=18, zorder=3)
    ax.text(-0.1, y, f'feature/{d["key"]}', ha="right", va="center", fontsize=8, color=c)
ax.text(1.4, 0.1, "T1 RED", ha="center", fontsize=8); ax.text(3.4, 0.1, "T2 GREEN", ha="center", fontsize=8)
ax.text(5.4, 0.1, "T3 REFACTOR", ha="center", fontsize=8); ax.text(7.4, 0.1, "T4 VALIDACIÓN + PR", ha="center", fontsize=8)
ax.set_xlim(-2.2, 10.2); ax.set_ylim(-0.4, 9.4); ax.axis("off")
ax.set_title("Flujo de GitHub: una rama feature por historia desde main", color=NAVY, fontweight="bold")
fig.tight_layout(); fig.savefig(os.path.join(CAP, "diagrama_flujo_github.png"), dpi=200); plt.close(fig)
print("ok")
