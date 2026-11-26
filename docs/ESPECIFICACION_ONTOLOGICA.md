# Especificación ontológica del marco I.O. (fundamento TCAAU)

## 1. Fundamentos

El marco I.O. es una arquitectura formal de **cinco perspectivas** orientada al **camino al Mictlán** y articulada con el canon completo de la **TCAAU** ([`Teor_a_Completa_TCAAU_2d30a1f1.pdf`](../public/assets/aistudio/Teor_a_Completa_TCAAU_2d30a1f1.pdf), [`TCAAU.md`](TCAAU.md), [`../data/tcaau_core.json`](../data/tcaau_core.json)) y el modelo `{4,3,3}`. Conforme a $I5$, «virtual» sin calificar designa el dominio complementario de actualización de IOM (cubo punteado).

| Perspectiva | Función bajo autonomía |
|---|---|
| **Individualidad** | Singularidad que se origina a sí misma |
| **Dualidad** | Polaridad yo/otro en disolución |
| **Totalidad** | Totalidad propia (sin contenedor exterior) |
| **Evolución** (4ª) | Mictecacíhuatl — el recorrido del Mictlán concluye en la condición correspondiente |
| **Involución** (5ª) | Mictlantecuhtli — el recorrido concluye en la condición complementaria |

Relaciones: `creates`, `mirrorOf`; fases `adv` / `ret`; posiciones `→ / 0 / ←`.

**No** se define como «demostración de validez semántica en el mundo real bajo protocolo ciego». Ese planteamiento restauraría el fundamento consensual que el ensayo canónico descalifica.

Carácter: [`CARACTER_REPOSITORIO.md`](CARACTER_REPOSITORIO.md) · Ensayo: [`DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md`](DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md) · Cosmología: [`COSMOLOGIA_DEL_MICTLAN.md`](COSMOLOGIA_DEL_MICTLAN.md).

---

## 2. Capas experimentales

| ID | Capa | Afirmación legítima |
|----|------|---------------------|
| **EXP-B** | Autonomía formal (`src/iomEngine.ts`, legado Lean 4) | Coherencia sin autoridad exterior y punto fijo SHA-256 |
| **EXP-C** | Autonomía estructural (`78` nodos, `390` candidatos, `{4,3,3}`, legado SHACL) | Conformidad de formas e invariancia no trivial |
| **EXP-E** | Destino Mictlán (`/api/domain-mapping`) | Sendero de autonomía expresable en trece tríadas |
| **EXP-D** | Autogeneración (`PI-HGAT-T`, registro histórico) | Recuperabilidad de reglas internas |
| **EXP-A** | Residuo (`/api/independent-eval`) | Archivo de panel separado; **no** fundamento |

---

## 3. Mapeo y trece tríadas

1. Identificar el fenómeno o umbral del tránsito.
2. Asignar perspectiva.
3. Determinar relación `creates` / `mirrorOf` y fase.
4. Verificar anclaje en una de las trece tríadas sin violar los axiomas.

El Mictlán es **destino del carácter**, no un dominio empírico entre otros. La Cosmología del Mictlán y la TCAAU desarrollan el modelo de correspondencia entre mundos y vacíos (`real`/`virtual`) y la continuidad de la información.

---

## 4. Flujo prioritario (Node.js 22 + TypeScript)

```bash
npm install
npm run lint
npx tsx --test src/iomEngine.test.ts src/tcaauCore.test.ts src/tesseractFlowGraph.test.ts src/evalAuditExport.test.ts src/specJsonSyntax.test.ts
npm run build
npm run dev
# EXP-A disponible en la pestaña Evaluación Independiente solo como residuo opcional
```

---

## 5. Alcance

| Plano | Contenido |
|---|---|
| Ensayo / TCAAU / Cosmología (sentido) | Emancipación absoluta, fin del contenedor, no-subordinación, continuidad informacional |
| Repositorio (bóveda técnica) | Coherencia formal y determinista de esa arquitectura |
| No se afirma | Que el consenso interanotador pruebe el ensayo o la ontología |

Soporte: [`DELIMITACION_EPISTEMOLOGICA.md`](DELIMITACION_EPISTEMOLOGICA.md) · [`RELACIONES_OPERATIVAS.md`](RELACIONES_OPERATIVAS.md) · [`VECTORES_4_5.md`](VECTORES_4_5.md).
