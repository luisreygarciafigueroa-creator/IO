# Aprendizaje: protocolo ciego y capas A–E

> **Fundamento teórico:** **TCAAU** — [`Teor_a_Completa_TCAAU__2__ee97e4df.pdf`](../../public/assets/aistudio/Teor_a_Completa_TCAAU__2__ee97e4df.pdf) · [`docs/TCAAU.md`](../../docs/TCAAU.md) · [`data/tcaau_core.json`](../../data/tcaau_core.json). Este material pedagógico delimita la autonomía formal (`A1`, `D11`, `I6`) frente al orden residual del encuentro (`EXP-A`).

Material pedagógico derivado de los manuales y del dictamen técnico.

| Artefacto | Descripción |
|---|---|
| [`quiz_blind_protocol.json`](quiz_blind_protocol.json) | 4 preguntas de autoevaluación |
| [`score_quiz.py`](score_quiz.py) | Corrección local del quiz |

```bash
python experiments/learning/score_quiz.py --self-test
python experiments/learning/score_quiz.py Q1=b Q2=b Q3=c Q4=c
```

Fundamento y manuales:

- [`public/assets/aistudio/Teor_a_Completa_TCAAU__2__ee97e4df.pdf`](../../public/assets/aistudio/Teor_a_Completa_TCAAU__2__ee97e4df.pdf) · [`docs/TCAAU.md`](../../docs/TCAAU.md)
- [`docs/MANUAL_APRENDIZAJE_PROTOCOLO_CIEGO.md`](../../docs/MANUAL_APRENDIZAJE_PROTOCOLO_CIEGO.md)
- [`docs/MANUAL_APRENDIZAJE_CONCORDANCIA.md`](../../docs/MANUAL_APRENDIZAJE_CONCORDANCIA.md)
- [`docs/DICTAMEN_TECNICO_EPISTEMOLOGICO.md`](../../docs/DICTAMEN_TECNICO_EPISTEMOLOGICO.md)

**No** forma parte de las métricas del marco (κ, PI-HGAT-T, SHACL). Solo evalúa comprensión de la jerarquía metodológica y del diseño experimental.
