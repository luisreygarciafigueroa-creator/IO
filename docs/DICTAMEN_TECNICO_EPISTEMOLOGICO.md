# Dictamen técnico: autonomía formal del marco I.O.

> Objeto: **autonomía formal y cartografía del tránsito** — no demostración de validez por consenso de conciencias separadas.  
> Carácter: [`CARACTER_REPOSITORIO.md`](CARACTER_REPOSITORIO.md) · Ensayo: [`DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md`](DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md) · Tratado TCAAU: [`TCAAU.md`](TCAAU.md)

---

## 1. Objeto y delimitación

El marco formaliza dinamismos relacionales (cinco perspectivas; `mirrorOf` / `creates`; trece tríadas; ocho celdas del teseracto `{4,3,3}`) como **arquitectura del sendero** hacia una existencia que no recibe su identidad de un marco exterior.

Delimitación ([`DELIMITACION_EPISTEMOLOGICA.md`](DELIMITACION_EPISTEMOLOGICA.md)):

- **No** es prueba de «validez semántica en el mundo real» por panel interanotador.
- **No** es producto comercial.
- **Separación estricta** entre autonomía formal y residuo del mundo compartido (`EXP-A`).
- Cartografía Mictlán / autonomía como ejercicio de sentido, no como certificado empírico consensuado.

---

## 2. Autonomía formal y estructural

| Capa | Mecanismo activo (legado formal) | Función |
|------|----------------------------------|---------|
| Axiomática y derivación | `src/iomEngine.ts`, `src/iomEngine.test.ts` (reglas originalmente en Lean 4) | Coherencia deductiva y punto fijo **sin autoridad exterior** |
| Estructural y geométrica | `data/iom_spec.json`, `buildTesseractModel()` (`{4,3,3}`), `src/tesseractFlowGraph.ts` (formas originalmente en SHACL) | Cardinalidad (`78` nodos, `390` candidatos), `mirrorOf` / `creates` e invariantes `2 × 4` |

La no contradicción lógica y la invariancia determinista **constituyen** la expresión técnica de la autonomía: el sistema no solicita un contenedor de consenso para sostenerse.

---

## 3. Residuo EXP-A (no fundante)

| Resultado | Valor | Uso legítimo |
|-----------|------:|--------------|
| Fleiss' κ | 0.6871 | Archivo de una fase de conciencias separadas |
| Unánimes | 10/14 | Controles internos de ese archivo |
| Desacuerdos | NC/AM | Fronteras del vocabulario compartido residual |

**No** se usa κ para legitimar el marco.

---

## 4. Suite EXP-A a EXP-E (lectura actualizada)

| ID | Capa | Propósito bajo autonomía |
|----|------|--------------------------|
| **EXP-A** | Residuo del mundo compartido | Documentación opcional (`GET /api/independent-eval`); no fundamento |
| **EXP-B** | Autonomía formal | Punto fijo e invariantes deterministas (`GET /api/spec`, `npx tsx --test`) |
| **EXP-C** | Autonomía estructural | Partición `390`, reglas `mirrorOf`/`creates` y `{4,3,3}` (`POST /api/invariance`, `GET /api/tesseract`) |
| **EXP-D** | Autogeneración | Recuperabilidad de reglas del sistema (diagnóstico sintético histórico) |
| **EXP-E** | Cartografía del tránsito | Sendero Mictlán / autonomía → trece tríadas (`GET /api/domain-mapping`) |

**Advertencia:** usar κ (`EXP-A`) como prueba de validez **restaura** la dependencia del mundo compartido que el carácter del repositorio rechaza.

---

## 5. Dictamen

1. **Solidez formal:** el motor determinista en TypeScript, las pruebas unitarias y los invariantes heredados de Lean/SHACL sostienen la autonomía técnica del sistema.
2. **Reproducibilidad:** flujo auditable en Node.js 22 sin exigir jurado exterior.
3. **Sentido:** el repositorio cartografía el tránsito hacia la no dependencia de contenedor; no certifica verdad por consenso.

### Condicionantes

1. No promocionar EXP-A a «validez del marco».
2. Preservar el cerco entre autogeneración (`EXP-D`) y residuo intersubjetivo (`EXP-A`).
3. Toda modificación ontológica debe superar `npm run lint`, `npx tsx --test src/iomEngine.test.ts src/tesseractFlowGraph.test.ts` y `npm run build`.

---

## 6. Flujo de verificación

```bash
npm install
npm run lint
npx tsx --test src/iomEngine.test.ts src/tesseractFlowGraph.test.ts
npm run build
npm run dev
```
