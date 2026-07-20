# RUNBOOK.md - Guía de Operaciones

## Fase #1 (Diagnóstico)
- Para verificar si el sistema está operativo, usa la siguiente URL en tu navegador o terminal:
  `http://localhost:3000/health`
- Si responde `{"status":"ok"}`, el sistema está activo.

## Fase #2 (Protocolo ante Caídas)
- L1 (Primer nivel): Reiniciar el proceso manualmente. 
  - Si estás en local: Detener con `Ctrl + C` y ejecutar `node server.js`.
  - Si estás en Render: Ir al dashboard de Render y seleccionar "Restart Service".
- L2 (Escalado): Verificar logs en busca del Correlation ID para identificar el error específico.

## Fase #3 (Recuperación ante Desastres)
- Procedimiento para restaurar la integridad del sistema:
  1. Identificar la corrupción en `toques.json`.
  2. Restaurar el archivo `toques.json` desde la última copia de seguridad en el repositorio de GitHub (Regla 3-2-1).
  3. Ejecutar el comando `git checkout -- toques.json` para revertir a la última versión estable.