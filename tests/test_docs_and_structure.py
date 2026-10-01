#!/usr/bin/env python3
"""
Suite de Pruebas Automatizadas para el Proyecto CGB Academy
Verifica la integridad de la documentación, especificación de HUs, RNFs y estructura de ramas.
"""

import os
import re
import unittest
import subprocess

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(BASE_DIR, "docs")
README_PATH = os.path.join(BASE_DIR, "README.md")


class TestProjectDocumentation(unittest.TestCase):

    def test_readme_exists(self):
        """Verificar que el README principal exista y no esté vacío."""
        self.assertTrue(os.path.isfile(README_PATH), "El archivo README.md no existe.")
        with open(README_PATH, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertGreater(len(content), 100, "El README.md está vacío o incompleto.")

    def test_docs_directory_and_files(self):
        """Verificar que todos los documentos clave existan en docs/."""
        expected_files = [
            "01_metodologia_desarrollo_hibrido.md",
            "02_historias_de_usuario_mvp.md",
            "03_requerimientos_no_funcionales.md",
            "04_plan_de_sprints.md",
            "05_guia_de_flujo_git.md",
        ]
        self.assertTrue(os.path.isdir(DOCS_DIR), "El directorio docs/ no existe.")
        for filename in expected_files:
            file_path = os.path.join(DOCS_DIR, filename)
            self.assertTrue(
                os.path.isfile(file_path),
                f"Falta el documento requerido: docs/{filename}",
            )

    def test_all_user_stories_present(self):
        """Verificar que las 23 Historias de Usuario (HU-001 a HU-023) estén debidamente redactadas."""
        hu_file = os.path.join(DOCS_DIR, "02_historias_de_usuario_mvp.md")
        with open(hu_file, "r", encoding="utf-8") as f:
            content = f.read()

        for i in range(1, 24):
            hu_id = f"HU-{i:03d}"
            self.assertIn(
                hu_id,
                content,
                f"La historia de usuario {hu_id} no se encuentra en {hu_file}",
            )

    def test_user_stories_structure(self):
        """Verificar que las HU contengan formato BDD con Criterios de Aceptación CA-."""
        hu_file = os.path.join(DOCS_DIR, "02_historias_de_usuario_mvp.md")
        with open(hu_file, "r", encoding="utf-8") as f:
            content = f.read()

        # Cada HU debe tener criterios de aceptación CA-
        ca_count = len(re.findall(r"\*\*CA-\d+\*\*", content))
        self.assertGreaterEqual(
            ca_count, 46, "Debe haber al menos 46 criterios de aceptación definidos."
        )

    def test_non_functional_requirements(self):
        """Verificar que los 10 requerimientos no funcionales (RNF-001 a RNF-010) existan."""
        rnf_file = os.path.join(DOCS_DIR, "03_requerimientos_no_funcionales.md")
        with open(rnf_file, "r", encoding="utf-8") as f:
            content = f.read()

        for i in range(1, 11):
            rnf_id = f"RNF-{i:03d}"
            self.assertIn(
                rnf_id,
                content,
                f"El requerimiento no funcional {rnf_id} no se encuentra en {rnf_file}",
            )

    def test_readme_links_resolve(self):
        """Verificar que todos los enlaces a archivos locales en README.md existan."""
        with open(README_PATH, "r", encoding="utf-8") as f:
            content = f.read()

        # Buscar enlaces del tipo [Texto](./docs/archivo.md)
        local_links = re.findall(r"\]\(\./([^)]+)\)", content)
        self.assertGreater(len(local_links), 0, "No se encontraron enlaces en README.md")

        for link in local_links:
            target_path = os.path.join(BASE_DIR, link)
            self.assertTrue(
                os.path.exists(target_path),
                f"El enlace en README apunta a una ruta inexistente: {link}",
            )

    def test_git_branches_configured(self):
        """Verificar que las ramas main y develop estén creadas en el repositorio."""
        result = subprocess.run(
            ["git", "branch", "-a"],
            cwd=BASE_DIR,
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0, "Error al ejecutar git branch.")
        output = result.stdout
        self.assertIn("main", output, "Falta la rama main en Git.")
        self.assertIn("develop", output, "Falta la rama develop en Git.")


if __name__ == "__main__":
    unittest.main(verbosity=2)
