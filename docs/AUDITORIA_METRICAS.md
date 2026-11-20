# Auditoría rigurosa de las métricas perfectas (100 %)

**Estado:** diagnóstico histórico de circularidad verificado; su equivalente de invariancia sin circularidad se ejecuta en `POST /api/invariance` (`runInvarianceAudit` en `src/iomEngine.ts`).

## Pregunta

¿Por qué PI-HGAT-T y el MLP alcanzan exactitud / macro-F1 / F1 por clase = **1.0000** bajo *leave-one-triad-out*?

## Hallazgos

### 1. Independencia entrenamiento/prueba: correcta a nivel de tríada

La partición *leave-one-triad-out* garantiza que **ninguna pareja** cuya `triad_index` corresponda al conjunto reservado aparece en el conjunto de entrenamiento. No hay fuga de identidad de nodo ni de índice de tríada: el modelo solo recibe codificación *one-hot* de fase y posición.

### 2. Las etiquetas son una función determinista de (fase, posición)

Para cualquier par `(source, target)`, la etiqueta canónica se obtiene **únicamente** de:

```text
fase_src, pos_src, fase_tgt, pos_tgt  →  {none, mirrorOf, creates}
```

conforme a las reglas deterministas definidas originalmente en Lean/SHACL y codificadas en `evaluatePairRule` (`src/iomEngine.ts`):

- `mirrorOf` $\iff$ fases opuestas $\land$ `pos_tgt = 2 - pos_src`
- `creates` $\iff$ fases opuestas $\land$ (`lateral → centro` $\lor$ `centro → lateral`)
- `none` en cualquier otro caso

Esta función es **idéntica** en las trece tríadas. Por tanto, en cada partición LOO, el 100 % de los pares de prueba posee una clave de características ya observada durante el entrenamiento con la misma etiqueta.

### 3. Consecuencia: cualquier modelo que aprenda la función alcanza 1.0

| Método | Exactitud | Interpretación |
|--------|----------:|----------------|
| Reglas deterministas (oráculo) | 1.0000 | Aplica la función sin aprender |
| MLP (características fase + pos) | 1.0000 | Aprende la función; generaliza por construcción |
| PI-HGAT-T (fase + pos + atención) | 1.0000 | Ídem; la atención de grafo no aporta información adicional en este corpus |
| Regresión logística lineal | 0.5333 | No separa `mirrorOf` / `creates` |
| Ablación sin fase | 0.6000 | Rompe la función determinista |
| Ablación sin posición | ~0.64 | Ídem |

### 4. ¿Se necesita una arquitectura compleja?

**No para este corpus sintético.** El oráculo y el MLP bastan. PI-HGAT-T demuestra *recuperabilidad estructural* y sirve como referencia metodológica para futuras extensiones (ruido, atributos externos, otros dominios), pero el 100 % no justifica por sí solo la complejidad del modelo sobre datos generados por las mismas reglas que se evalúan.

## Delimitación epistemológica

| Afirmación legítima | Afirmación no legítima |
|---|---|
| «Las relaciones generadas por reglas son recuperables al 100 % a partir de fase y posición bajo LOO.» | «El marco está validado empíricamente en el mundo real.» |
| «La ontología es aprendible a partir de rasgos estructurales mínimos.» | «PI-HGAT-T supera a líneas base en datos independientes del generador.» |
| «Las ablaciones cuantifican la contribución de fase y posición.» | «El 100 % demuestra robustez frente a ruido del mundo real.» |

La evaluación de interpretabilidad humana sobre datos **no** derivados de las reglas pertenece a la anotación ciega (`datasets/independent_eval/`). Bajo el carácter de autonomía absoluta, ese canal permanece como **residuo**, no como fundamento.

## Cómo verificar hoy la invariancia sin circularidad

```bash
npx tsx -e "
  import { generateArtifacts, runInvarianceAudit } from './src/iomEngine';
  const a = generateArtifacts();
  console.log(runInvarianceAudit(a.relationCandidates));
"
```

Artefacto histórico de auditoría: `experiments/results/perfect_metrics_audit.json`.
