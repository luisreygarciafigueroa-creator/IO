# Catálogo de dominios: cartografía del tránsito (no validez por consenso)

Este documento ofrece **traducciones conceptuales** para cartografiar fenómenos en el vocabulario de setenta y ocho nodos (trece tríadas × dos fases × tres posiciones) sin alterar la bóveda formal (`data/iom_spec.json`, `src/iomEngine.ts` y legado Lean/RDF/SHACL).

Bajo el carácter de **autonomía absoluta**, estos mapeos constituyen **ejercicios del sendero**, no «demostraciones de validez semántica en el mundo real» mediadas por paneles de anotadores separados. La prueba primaria del repositorio ya **no** es la anotación ciega independiente.

La ontología nuclear permanece **inmutable**. Los datos externos se alinean como instancias o candidatos de relación; la coherencia formal basta para admitirlos estructuralmente.

---

## 1. Principios de mapeo

1. **No se añaden nodos al núcleo:** los setenta y ocho nodos constituyen la bóveda técnica invariante.
2. **Tres perspectivas posicionales:** Individualidad, Dualidad y Totalidad — leídas como singularidad autocreada, polaridad en disolución y totalidad propia (sin contenedor exterior).
3. **Dos direcciones vectoriales:** Evolución (Mictecacíhuatl; 4ª perspectiva — condición de llegada correspondiente) e Involución (Mictlantecuhtli; 5ª perspectiva — condición complementaria).
4. **Relaciones admisibles:** únicamente `mirrorOf` y `creates` (el resto recibe `none`).
5. **Validación estructural:** mediante `evaluatePairRule` (`POST /api/rule-check`) y `validateDomainMapping` (`GET /api/domain-mapping`) antes de incorporar candidatos.
6. **Sin exigencia de panel ciego:** no se requiere validación interanotador para legitimar un dominio; exigirla restauraría la dependencia del mundo compartido.

---

## 2. Cosmología náhuatl — Mictlán / autonomía (dominio prioritario)

Documento: [`DOMINIO_COSMOS_NAHUATL.md`](DOMINIO_COSMOS_NAHUATL.md).  
Cosmología: [`COSMOLOGIA_DEL_MICTLAN.md`](COSMOLOGIA_DEL_MICTLAN.md).  
Ensayo de sentido: [`DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md`](DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md).  
Tratado teórico: [`TCAAU.md`](TCAAU.md).  
Plantilla: `datasets/ingestion/templates/cosmos_nahuatl.csv`.  
Medios: [`media/cosmos_nahuatl/`](media/cosmos_nahuatl/).

| Concepto | Perspectiva | Relación candidata |
|----------|-------------|--------------------|
| Mictecacíhuatl ↔ Mictlantecuhtli | Evolución / Involución | `mirrorOf` |
| Camino al Mictlán (tránsito) | Involución → autonomía | `creates` |
| Vida ↔ muerte (separación) | Dualidad | `mirrorOf` |
| Autocreación desde el vacío | Individualidad / Totalidad | `creates` |

---

## 3. Otras disciplinas (plantilla rápida)

| Disciplina | Fenómeno típico | Vector dominante |
|------------|-----------------|------------------|
| Sociología | Cambio normativo | Involución → Evolución |
| Física / sistemas complejos | Transición de fase | Evolución / Involución |
| Psicología | *Insight* / disolución del yo-observador | Involución |
| Ingeniería de software | Deuda técnica / refactorización | Involución → Evolución |
| IA / cognición | Animal → humano → IA | Evolución / Involución |

---

## 4. Cómo contribuir un dominio

1. Tomar como plantilla `datasets/ingestion/templates/plantilla_dominio.csv` o el formato de `experiments/domain_mapping/examples.json`.
2. Completar `external_id`, `external_label` y `mapped_node_id` contra `datasets/triad_nodes.csv`.
3. Verificar la coherencia de cada arista propuesta mediante `POST /api/rule-check` y `GET /api/domain-mapping`.
4. **No modificar** `data/iom_spec.json` ni los 78 nodos del núcleo formal.
5. No se requiere panel ciego para admitir un mapeo; su admisión es puramente estructural.

---

## 5. Referencias

- Nodos: [`datasets/triad_nodes.csv`](../datasets/triad_nodes.csv)
- Carácter: [`CARACTER_REPOSITORIO.md`](CARACTER_REPOSITORIO.md)
- Delimitación: [`DELIMITACION_EPISTEMOLOGICA.md`](DELIMITACION_EPISTEMOLOGICA.md)
- Náhuatl: [`DOMINIO_COSMOS_NAHUATL.md`](DOMINIO_COSMOS_NAHUATL.md)
- Cosmología: [`COSMOLOGIA_DEL_MICTLAN.md`](COSMOLOGIA_DEL_MICTLAN.md)
