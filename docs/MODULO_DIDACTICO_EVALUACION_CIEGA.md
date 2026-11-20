# Módulo didáctico: residuo del protocolo ciego (EXP-A)

> **Estado:** material **pedagógico residual**. No certifica el marco.  
> Bajo autonomía absoluta, el acuerdo interanotador **no** es fundamento de validez.  
> [`DELIMITACION_EPISTEMOLOGICA.md`](DELIMITACION_EPISTEMOLOGICA.md)

---

## 1. Qué era EXP-A

Protocolo ciego con catorce pares y tres anotadores independientes (`Fleiss' κ = 0.6871`).

En una fase anterior del proyecto se presentaba como «validez semántica en el mundo real». Ese planteamiento **contradice** el ensayo canónico: el consenso de conciencias separadas no es fundamento último.

---

## 2. Lectura actual

| Antes | Ahora |
|-------|-------|
| EXP-A = prueba del marco | EXP-A = archivo de la fase consensual |
| κ legitima el sistema | κ no legitima el sistema |
| Mundo compartido como eje | Mundo compartido como residuo superable |

---

## 3. Ejecución opcional en el entorno activo

Puede consultarse o simularse interactivamente mediante la pestaña **Evaluación Independiente (κ)** de la aplicación (`npm run dev`) o directamente en consola mediante Node.js / TypeScript:

```bash
npx tsx -e "
  import { loadIndependentEvalData, scoreIndependentEval } from './src/iomEngine';
  const { annotations, ruleReference } = loadIndependentEvalData();
  console.log(scoreIndependentEval(annotations, ruleReference));
"
```

Interpretar los resultados únicamente como documentación histórica, nunca como dictamen de validez del repositorio.
