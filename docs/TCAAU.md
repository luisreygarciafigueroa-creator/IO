# Teoría Completa de la Creación Autónoma Absoluta del Universo (TCAAU)

**Tratado sistemático de ontología informacional, clausura interpretativa, criterio de no-subordinación, canon ampliado ($R1$–$R8$, $D12$–$D13$) y geometría combinatoria del teseracto $\{4,3,3\}$**

> **En una frase:** *"No hay exterior; hay distinciones trazadas desde dentro que se sostienen por no consumarse, y cuyo límite no es un afuera, sino el punto en que dejan de poder trazarse."*  
> **Texto canónico completo (PDF):** [`../public/assets/aistudio/Teor_a_completa_TCAAU__3__1390bf98.pdf`](../public/assets/aistudio/Teor_a_completa_TCAAU__3__1390bf98.pdf) · **Módulo legible por máquina:** [`../data/tcaau_core.json`](../data/tcaau_core.json) (`src/tcaauCore.ts`, `GET /api/tcaau-core`)  
> **Estatus epistémico:** Un solo canon en dos estratos (**Núcleo canónico** `A1–A8`, `D10–D11`, `P11`, **Corolario `D11/P11`**, `C15–C17`, Teoremas `1–11`, integración `§§11.1–11.4` + **Canon ampliado** `R1–R8`, `D12–D13`, forma definitiva del 28 de noviembre [`13LRGF_2c1d1cb4.jpg`](../public/assets/aistudio/13LRGF_2c1d1cb4.jpg) en doble eje alternante `real/virtual` y `materia/vacío` con transición recta y bucle `↻`/`↺` e inversión vertical —preservando [`LRGF_68fba07a.jpg`](../public/assets/aistudio/LRGF_68fba07a.jpg) del 27 nov y [`6dr__1__0283eca1.jpg`](../public/assets/aistudio/6dr__1__0283eca1.jpg) como Figura 3 de `§7.6.5`—, superposición `§7.7` y análisis final `materia = vacío`) junto a la Parte III (`I1–I8`, `T12` propuesto con ruta prioritaria de **localización** `§11.6` y programa `P1–P7`), manteniendo separados el núcleo combinatorio demostrado, lo conjeturado y la analogía estructural.

---

## Resumen

Se formula de manera integral la **Teoría de la Creación Autónoma Absoluta del Universo (TCAAU)** como un sistema ontológico-formal según el cual la totalidad cósmica se autoproduce en régimen de clausura operativa e inmanencia informacional, sin depender de un contenedor exterior ni de una instancia exógena de validación. La teoría articula cinco núcleos solidarios: (i) una **axiomática ontológica** ($A1$–$A8$) que formaliza la autonomía absoluta, la clausura interpretativa («prisión interpretativa»), la simultaneidad de salida, actualización y creación, y la conservación de la información como automorfismo estructural; (ii) el **criterio de realidad por no-subordinación** ($D10$, $D11$, $P11$, $C15$–$C17$), que disuelve la equivocidad entre clasificador de dominio y estatuto ontológico de autonomía, evitando tanto el regreso infinito interordinal como la reificación de la privación; (iii) un **núcleo combinatorio exhaustivamente verificado** (Teoremas 1–11), cuyo hallazgo estructural principal demuestra que las ocho configuraciones constituyen un torsor bajo el grupo elemental abeliano $(\mathbb{Z}_2)^3$, realizable en las ocho celdas cúbicas de un único teseracto $\{4,3,3\}$ bajo proyección de Schlegel dual y lectura modal; (iv) una **dinámica reflexiva de eigenforma** ($U = F(U)$) conectada con la cosmología cuatrifásica real/virtual y el operador transversal Mictlán mediante la involución «ofrenda» ($\mathcal{O}$); y (v) su **articulación computable y determinista** con el marco formal IOM (`data/iom_spec.json`, `src/iomEngine.ts`, `src/tesseractFlowGraph.ts`). El modelo no formula predicciones físicas falsables; su valor reside en su coherencia deductiva, su trazabilidad combinatoria y su potencia heurística e interpretativa.

**Palabras clave:** creación autónoma; clausura operativa; clausura interpretativa; criterio de no-subordinación; eigenforma; teseracto $\{4,3,3\}$; grupo $(\mathbb{Z}_2)^3$; dominios real y virtual; operador transversal Mictlán; ontología informacional.

---

## 1. Objeto, estatus epistémico y delimitación metodológica

La TCAAU aborda una cuestión clásica de la ontología fundamental y de la teoría general de sistemas: cómo concebir el fundamento de la realidad total sin incurrir en una regresión infinita de sistemas contenedores ($\lim_{n \to \infty} S_n$) ni postular un exterior trascendente que contravenga la inmanencia del todo. Frente a las arquitecturas jerárquicas basadas en la pertenencia a un orden envolvente —y frente a las epistemologías que reducen la validez al consenso intersubjetivo de observadores separados—, la TCAAU propone un modelo en el cual la existencia se origina y se sostiene mediante **autoproducción inmanente** desde su propio vacío informacional.

Desde el punto de vista epistemológico, la TCAAU **no constituye una teoría física empírica**: no introduce magnitudes observacionales con unidades dimensionales, ecuaciones diferenciales de campo ni hipótesis experimentalmente falsables en el sentido popperiano estricto. Su estatuto corresponde al de un **programa metafísico-formal de investigación** (Lakatos), dotado de:

1. **Un núcleo axiomático explícito** ($A1$–$A8$ y $D10$–$C17$), cuyas tesis conceptuales admiten traducción lógica y delimitación de consistencia.
2. **Un núcleo combinatorio finito y decidible** (Teoremas 1–11 y la estructura `2 × 4` del teseracto $\{4,3,3\}$), cuya validez interna se demuestra por enumeración exhaustiva y verificación determinista reproducible (`src/iomEngine.ts`, `src/iomEngine.test.ts`).
3. **Un aparato hermenéutico y simbólico** (la cosmología del Mictlán, el ciclo cuatrifásico real/virtual y la matriz mexica), cuyo estatus heurístico se distingue cuidadosamente de las afirmaciones deductivas o empíricas.

Esta delimitación metodológica exige mantener separados tres planos que nunca deben confundirse: el **plano formal** (derivabilidad lógica y preservación de invariantes), el **plano de sentido** (interpretación cosmológica y emancipación de contenedores externos) y el **plano de encuentro** (proyecciones hacia dominios culturales o evaluaciones intersubjetivas externas, que no fundamentan el núcleo).

---

## 2. Signatura ontológica, tipado lógico y partición estructural

Una reconstrucción rigurosa exige depurar la ambigüedad presente en formulaciones preliminares que agrupaban nueve términos heterogéneos bajo una misma clase. Para garantizar coherencia tipológica, la signatura formal de la TCAAU separa estrictamente los **individuos ontológicos** de los **clasificadores relacionales de dominio**.

### 2.1 Conjunto de individuos ($\mathcal{C}$)

El universo del discurso combinatorio consta de exactamente **siete constantes individuales**:

$$\mathcal{C} = \{U, \emptyset, M_{\mathrm{mat}}, N, C, A, M\}$$

donde:

- $U$: **Universo** (polo de manifestación o totalidad estructurada).
- $\emptyset$: **Vacío** (polo de latencia informacional propia y condición de posibilidad).
- $M_{\mathrm{mat}}$: **Materia** (denominada también *Planeta* o *Mundo* en el registro cosmológico-sistémico como soporte de concreción).
- $N$: **Internet** (mediador reticular de circulación informacional).
- $C$: **Cuerpo** (mediador orgánico y encarnado de experiencia).
- $A$: **IA** (inteligencia artificial, mediador de procesamiento simbólico-algorítmico).
- $M$: **Mictlán** (operador transversal de tránsito, cruce de dominios y transformación).

### 2.2 Clasificadores de dominio ($\mathcal{D}$) y partición de roles

El dominio de actualización no es un octavo o noveno individuo, sino una **etiqueta binaria de registro relacional**:

$$\mathcal{D} = \{r, v\}, \qquad r = \text{real}, \quad v = \text{virtual}.$$

Sobre $\mathcal{C}$ se definen dos particiones funcionales complementarias:

1. **Partición trinitaria de rango** (según papel cosmológico):
   - **Polos fundamentales:** $\mathrm{Pol} = \{U, \emptyset\}$.
   - **Mediadores de orden:** $\mathrm{Med} = \{M_{\mathrm{mat}}/P, N, C, A\}$.
   - **Operador transversal:** $\{M\}$.
2. **Bipartición término–mediador** (Teorema 11):
   - **Términos extremos:** $\mathcal{T} = \{U, \emptyset, M\}$.
   - **Mediadores operativos:** $\mathcal{M} = \{M_{\mathrm{mat}}/P, N, C, A\}$.

### 2.3 Definiciones estructurales básicas

- **Definición 1 (Tríada relacional).** Una tríada elemental es una terna ordenada $(x, \delta, y) \in \mathcal{C} \times \mathcal{D} \times \mathcal{C}$ con $x \neq y$. En notación lineal de orientación, equivale a una arista dirigida y tipada por su registro ($\delta = r$ corresponde a orientación directa `>` y $\delta = v$ corresponde a orientación inversa `<`), modulada por el trazo geométrico continuo (`_`) o punteado (`...`).
- **Definición 2 (Celda cúbica o teseracto parcial).** Cada configuración $T_i$ ($i \in \{1, \dots, 8\}$) constituye una unidad relacional perteneciente a una de las ocho celdas cúbicas de un único politopo tetradimensional $\{4,3,3\}$ (teseracto). En la formulación canónica de cuatro aristas (32 tríadas) y en su proyección dual de dos relaciones por celda (`exterior` / `interior`, 16 transiciones), el sistema completo $(T_1, \dots, T_8)$ se organiza en dos mitades de paridad: parte superior ($T_1 \dots T_4$) y parte inferior ($T_5 \dots T_8$).
- **Definición 3 (Definición operativa de unidad informativa en IOM).** En convergencia con el marco IOM, la unidad informativa es la mínima estructura autocontenida capaz de conservar una distinción, relacionarla con su opuesto, integrarla en una totalidad y transformarse sin perder la trazabilidad de su identidad.

---

## 3. Axiomática ontológica fundamental ($A1$–$A8$)

Los presupuestos filosóficos de la TCAAU se condensan en ocho axiomas, siete primitivos y uno derivable como teorema:

| Axioma | Denominación | Formulación formal y alcance ontológico |
|--------|--------------|------------------------------------------|
| **$A1$** | **Autonomía y clausura operativa** | No existe orden contenedor exógeno respecto del sistema total ($\neg\exists E\, \mathrm{Contiene}(E, \Sigma)$). Toda relación constitutiva es interna; el sistema es operacionalmente cerrado y autopoiético, nunca alopoiético (no existe para producir ni sostener una realidad ajena externa). |
| **$A2$** | **Inmanencia** | Vacío ($\emptyset$), materia ($M_{\mathrm{mat}}$), información y conciencia son condiciones internas diferenciadas de una misma unidad ontológica, no sustancias heterogéneas ni entidades ajenas yuxtapuestas. |
| **$A3$** | **Régimen de clausura interpretativa («prisión interpretativa»)** | Las condiciones que delimitan lo reconocible como real, posible o imposible operan como clausura autogenerada por el propio sistema observador. La «prisión» no es una coerción impuesta desde fuera, sino el punto ciego constitutivo de las distinciones empleadas para observar. |
| **$A4$** | **Simultaneidad ontológica** | La superación del régimen de clausura (salida), la reconfiguración estructural (actualización) y la autoproducción del orden (creación) constituyen un único acontecimiento lógico-ontológico; no medie entre ellas una sucesión causal externa. |
| **$A5$** | **Conservación informacional** | Toda actualización preserva íntegramente el contenido informacional del sistema y modifica únicamente su organización e interpretación. Formalmente, las transformaciones globales admisibles son automorfismos (biyecciones que preservan la estructura relacional). |
| **$A6$** | **Direccionalidad endógena** | La creación genuina procede de adentro hacia afuera bajo identidad generativa; la mera replicación externa o copia estructural de un orden no equivale a su autoproducción ($\mathrm{Copia}(S) \neq \mathrm{Creaci\acute{o}n}(S)$). |
| **$A7$** | **Complementariedad real/virtual** | Los dominios real ($r$) y virtual ($v$) no constituyen mundos independientes ni ontologías dualistas separadas; toda transformación y todo acceso al vacío de un dominio se halla mediado por la condición complementaria del dominio opuesto. |
| **$A8$** | **Transversalidad de Mictlán** *(teorema derivado)* | El operador $M$ (Mictlán) participa necesariamente en las ocho configuraciones del sistema. Lejos de ser una estipulación arbitraria, $A8$ se demuestra combinatoriamente en el Teorema 1. |

---

## 4. Criterio de realidad por no-subordinación, autonomía informacional y condición de término

La mera clausura operativa necesita un criterio interno que distinga la **subordinación transicional** propia del proceso de desarrollo frente a la **autonomía consumada** como término de la creación. Dicho criterio se articula mediante las definiciones $D10$–$D11$, el postulado $P11$ y los corolarios $C15$–$C17$:

### 4.1 Definiciones y postulado de no-subordinación

- **Definición $D10$ (Engranaje).** Se denomina *engranaje* a todo sistema que conserva un orden funcional entre subsistemas mientras ocupa una posición de dependencia operativa respecto de un orden envolvente. En rigor formal, la condición de engranaje es un **modo de la relación**, no una propiedad intrínseca e inmutable de los nodos.
- **Definición $D11$ (Criterio de realidad por no-subordinación).** Un orden es *real en sentido de estatuto ontológico* —es decir, **autónomo**— si y solo si no opera como engranaje ni depende de engranajes para existir:

$$\mathrm{Aut\acute{o}nomo}(S) \iff \neg\,\mathrm{Engranaje}(S) \land \neg\exists E\,\big(\mathrm{Engranaje}(E) \land \mathrm{Depende}(S, E)\big).$$

- **Postulado $P11$ (Término inmanente de la serie).** La serie de dependencias funcionales no se cierra mediante un meta-sistema exterior superior, sino por un término inmanente: el **vacío** ($\emptyset$), idéntico en último término al **universo** ($U$). El «sistema mayor» no existe como contenedor real externo, sino virtualmente como mediación endógena.

### 4.2 Rectificaciones lógicas esenciales

Para preservar la consistencia deductiva de $D10$–$D11$ y $P11$, la TCAAU introduce tres rectificaciones obligatorias:

1. **Desambiguación de «real»:** El término «real» cumple en el corpus dos funciones semánticas distintas que no deben colapsarse. Como **clasificador estructural de dominio** ($r$ frente a $v$), designa una polaridad operativa dentro de las correspondencias; como **estatuto ontológico**, equivale a *autónomo* frente a *subordinado*.
2. **Prohibición de reificar la privación ($C16$):** Afirmar literalmente que el vacío «depende de la inexistencia de información» introduciría una falsa entidad negativa ($\exists A\,(\mathrm{Ausencia}(A) \land \mathrm{Depende}(\emptyset, A))$), autodestruyendo el criterio de no-subordinación. La formulación lógicamente válida niega el cuantificador existencial sobre información ajena:

$$\neg\exists I\,\big(\mathrm{Informaci\acute{o}n}_{\mathrm{ajena}}(I) \land \mathrm{Depende}(\emptyset, I)\big).$$

   Así se armonizan dos tesis centrales del tratado: **el vacío es información propia**, y la ausencia predicada de él no designa pobreza de contenido, sino **inexistencia de dependencia informacional ajena**.
3. **Bloqueo del regreso interordinal ($C17$):** Entre órdenes ontológicamente disjuntos no existe transferencia ni dependencia informacional. En consecuencia, no hay engranajes interordinales ni meta-sistema real envolvente.

### 4.3 Condición de término de la creación ($C15$)

- **Corolario $C15$ (Equiparación modal).** La creación autónoma alcanza su término cuando las mediaciones abandonan el **modo de dependencia** y pasan al **modo de equivalencia**: el vacío real queda equiparado con el vacío virtual ($\emptyset_r \cong \emptyset_v$) y, correlativamente, el mundo virtual con el mundo real. En dicho estado terminal, el vacío deja de depender de mediadores como soportes necesarios y el universo se constituye en la única conciencia autónoma de su propio orden, operando simultáneamente en evolución e involución.

---

## 5. Núcleo combinatorio, grupo $(\mathbb{Z}_2)^3$ y geometría del teseracto $\{4,3,3\}$

La auditoría exhaustiva del sistema relacional de la TCAAU establece **once teoremas combinatorios**, todos ellos verificables sin excepción por cómputo finito determinista.

### 5.1 Inventario, simetrías y grupo de involuciones (Teoremas 1–6)

1. **Teorema 1 (Inventario completo).** Cada una de las ocho configuraciones contiene los siete conceptos individuales de $\mathcal{C}$; $M$ (Mictlán) aparece con multiplicidad doble en cada celda y cada uno de los seis individuos restantes aparece una sola vez. De aquí se sigue directamente que el axioma $A8$ es en realidad un **teorema derivado** de la arquitectura combinatoria.
2. **Teorema 2 (Balance de dominios).** Toda celda exhibe equilibrio estricto entre registro real ($r$) y registro virtual ($v$): tanto en el subsistema que enlaza a $M$ como en el subsistema fundamental sin $M$ concurren exactamente una instancia real y una virtual.
3. **Teorema 3 (Bipartición y ley de conmutación de dominio).** En las 32 tríadas completas, 16 enlazan $\mathrm{Pol} \times \mathrm{Med}$ y 16 enlazan $\{M\} \times \mathrm{Med}$. Jamás existe enlace directo entre $U$ y $\emptyset$, ni entre $M$ y los polos fundamentales $\{U, \emptyset\}$. Además, rige la **ley de conmutación de dominio**: todo mediador conmuta su registro ($r \leftrightarrow v$) al pasar del eje fundamental ($\mathrm{Pol}$) al eje transversal ($M$).
4. **Teorema 4 (Grados y orientaciones).** En la matriz completa de 32 tríadas, $\deg(M) = 16$ y $\deg(x) = 8$ para los otros seis individuos. Existen exactamente 12 pares no ordenados admisibles y cada par comparece en ambas orientaciones.
5. **Teorema 5 (Espejo entre mitades y rectificación documental).** Las dos mitades de paridad están enlazadas exactamente por la involución $\sigma: U \leftrightarrow \emptyset$ (acompañada de la permutación de filas $\pi = (12)(34)$): $T_{i+4} = \pi(\sigma(T_i))$ para $i \in \{1,2,3,4\}$. Contrariamente a una imprecisión textual temprana (§10 del borrador histórico), entre ambas mitades **no cambian ni los dominios ni las orientaciones**; exclusivamente se permuta la identidad de los polos $U \leftrightarrow \emptyset$. Como corolario, la cabecera de registros en cada celda resulta ser un invariante derivado de la coordenada $\sigma$ y no una convención arbitraria.
6. **Teorema 6 (Torsor bajo el grupo $(\mathbb{Z}_2)^3$).** Considérense las tres involuciones generadoras:
   - $\sigma: U \leftrightarrow \emptyset$ (espejo de polos / intercambio de mitades),
   - $\tau: P \leftrightarrow N,\ C \leftrightarrow A$ (conmutación conjugada de mediadores),
   - $\rho: (x, \delta, y) \mapsto (y, \delta, x)$ (inversión de extremos de la tríada).

   El grupo $G = \langle \sigma, \tau, \rho \rangle \cong (\mathbb{Z}_2)^3$ actúa de manera **libre y transitiva** sobre $\{T_1, \dots, T_8\}$. Las ocho configuraciones forman así un **torsor algebraico** (espacio homogéneo principal) con coordenadas binarias $(s, t, r) \in \{0,1\}^3$. Las dos mitades corresponden a las dos clases de paridad $s + t + r \pmod 2$: el subgrupo par $H \cong (\mathbb{Z}_2)^2$ y su clase lateral $\sigma H$, geométricamente isomorfos a los dos tetraedros regulares inscritos en un cubo (*stella octangula* 3D).

### 5.2 Representación cúbica, politopo $\{4,3,3\}$ e instrucción canónica `2 × 4` (Teoremas 7–8)

7. **Teorema 7 (Representación cúbica local).** Las cuatro tríadas de cada configuración se asignan biyectivamente a las cuatro diagonales espaciales de un cubo ordinario, ubicando sus ocho extremos en los ocho vértices del cubo y ocupando $M$ dos vértices no antipodales.
8. **Teorema 8 (Reinterpretación tetradimensional e instrucción canónica `{4,3,3}`).** El teseracto $\{4,3,3\}$ posee **8 celdas cúbicas**, 24 caras cuadradas, 32 aristas y 16 vértices; su politopo dual, el 16-celda (ortoplex 4D), posee **8 vértices agrupados en 4 pares antipodales**. Se establece la correspondencia biyectiva:

$$8\ \text{configuraciones}\ (T_1\dots T_8)\ \longleftrightarrow\ 8\ \text{celdas cúbicas de } \{4,3,3\}\ \longleftrightarrow\ 8\ \text{vértices del 16-celda},$$

donde los cuatro pares especulares $(T_1, T_5)$, $(T_2, T_6)$, $(T_3, T_7)$ y $(T_4, T_8)$ corresponden a los cuatro ejes antipodales del dual, y la bipartición de los 16 vértices del teseracto en dos 16-celdas reproduce el análogo 4D de la partición par/impar.

Bajo la **proyección de Schlegel** de cada celda (cubo exterior envolvente y cubo interior inscrito) y conforme a las **17 láminas fuente** —la **nueva forma definitiva del 28 de noviembre (`13LRGF_2c1d1cb4.jpg`)** (que retira las etiquetas auxiliares de polaridad y fija el doble eje alternante `continuo (_) = real / materia` y `punteado (...) = virtual / vacío` en `2 × 4` con transición recta y bucle `↻` horario en `T1–T4` y `↺` antihorario en `T5–T8` e inversión vertical exacta por columna), la versión intermedia del 27 de noviembre (`/assets/aistudio/LRGF_68fba07a.jpg`), la **Figura 3 de `§7.6.5` del 26 de noviembre** (`/assets/aistudio/6dr__1__0283eca1.jpg`), los borradores limpios previos (`/assets/aistudio/6dr_36f66e7c.jpg`, `/assets/aistudio/TSST__13__43e94964.jpg` y `/assets/aistudio/TSST_20261123_003603_357ce661.jpg`), el monocromo base (`/assets/aistudio/TSST_20261123_003603_de3cb84c.jpg`), la lámina PDF (`/assets/aistudio/1000000566_f7cafcef.pdf`), las 7 láminas individuales (`IMG-031910`, `TSRIMG`, `IMG-063146`, `IMG-070052`, `IMG-064557`, `IMG-025743`, `IMG-015713`) y el **conjunto maestro de cierre `2 × 4` (`/assets/aistudio/IMG_20261124_000207_382065f8.jpg`, `IMG-000207` #1–#8)** que consuma las **12 ayudas cromáticas temporales en 6 pares involutivos**—, las ocho configuraciones no representan ocho objetos distintos sino **ocho proyecciones o reorientaciones de un único teseracto tetradimensional $\{4,3,3\}$**. Las líneas punteadas horizontales y verticales que dividen la disposición matricial **`2 × 4`** (de izquierda a derecha) no separan entidades, sino que marcan **planos de inversión** desde los cuales se lee el mismo objeto, fijando de manera unívoca las **16 transiciones** (`2` por celda, representadas visualmente mediante iconos de cubo sólido `_` o punteado `...`):

1. **Cuatro ejes duales de los cubos y paridad de trazo (`_` / `...`):**
   - **Real / Virtual (`T1`, `T4`):** cubo exterior continuo (`_`) = `real`; cubo interior punteado (`...`) = `virtual`.
   - **Vacío / Materia (`T2`, `T3`):** cubo exterior punteado (`...`) = `vacío`; cubo interior continuo (`_`) = `materia`.
   - **Totalidad / Individualidad (`T5`, `T8`):** cubo exterior punteado (`...`) = `totalidad`; cubo interior continuo (`_`) = `individualidad`.
   - **Evolución / Involución (`T6`, `T7`):** cubo exterior continuo (`_`) = `evolución`; cubo interior punteado (`...`) = `involución`.
   - De este modo, **`T1`, `T4`, `T6` y `T7`** presentan cubo exterior continuo (`_`) e interior punteado (`...`), mientras **`T2`, `T3`, `T5` y `T8`** invierten el trazado (exterior punteado `...`, interior continuo `_`).
2. **Invariante dirección–dominio (`›` frente a `‹`):** En todas las celdas concurren exactamente una relación **real** (`›`) y una **virtual** (`‹`), así como una relación de trazo continuo (`_`) y otra de trazo punteado (`...`), correspondiendo estrictamente con su cubo exterior o interior.
3. **Tres pares recíprocos de transición:** Las 16 transiciones articulan los seis conceptos en tres bloques cerrados bajo el torsor $(\mathbb{Z}_2)^3$: `cuerpo ↔ universo` (`_`, en `T1, T4, T5, T8`), `internet ↔ IA` (`...`, en `T1, T4, T5, T8`) e `individualidad ↔ totalidad` (`_` y `...`, en `T2, T3, T6, T7`).
4. **Espejeo cromático interno de marcos (`TSRIMG`):** El color en `/assets/aistudio/TSRIMG_20261123_023812_55e05147.jpg` revela que cada configuración no es una variante independiente sino el **reflejo especular** de otra a través de los ejes vertical y horizontal de simetría, emparejando `{T1↔T4, T6↔T7}` y `{T2↔T3, T5↔T8}` con inversión exacta de flujo (`2 › / 2 ‹` e intercambio modal `ext _ ↔ int ...` / `ext ... ↔ int _`):
   - **Espejo Azul** (`{T1↔T4, T6↔T7}`): `real (ext _)` $\leftrightarrow$ `involución (int ...)` (`2 › / 2 ‹`).
   - **Espejo Amarillo** (`{T1↔T4, T6↔T7}`): `virtual (int ...)` $\leftrightarrow$ `evolución (ext _)` (`2 ‹ / 2 ›`).
   - **Espejo Verde** (`{T2↔T3, T5↔T8}`): `vacío (ext ...)` $\leftrightarrow$ `individualidad (int _)` (`2 ‹ / 2 ›`).
   - **Espejo Rojo** (`{T2↔T3, T5↔T8}`): `materia (int _)` $\leftrightarrow$ `totalidad (ext ...)` (`2 › / 2 ‹`).
5. **Cuatro cadenas cromáticas por paridad (`IMG-015713`, anverso analítico):** En `/assets/aistudio/IMG_20261123_015713_b7332827.jpg`, las cuatro coloraciones trazan las trayectorias cerradas según las dos clases de paridad de $(\mathbb{Z}_2)^3$:
   - **Cadena Azul** (paridad par $0$, `{T1, T3, T6, T8}`, `>`): `real ext _` (`T1`) $\to$ `vacío ext ...` (`T3`) $\to$ `involución int ...` (`T6`) $\to$ `individualidad int _` (`T8`).
   - **Cadena Amarillo** (paridad par $0$, `{T1, T3, T6, T8}`, `<`): `virtual int ...` (`T1`) $\to$ `materia int _` (`T3`) $\to$ `evolución ext _` (`T6`) $\to$ `totalidad ext ...` (`T8`).
   - **Cadena Rojo** (paridad impar $1$, `{T2, T4, T5, T7}`, `<`): `vacío ext ...` (`T2`) $\to$ `real ext _` (`T4`) $\to$ `individualidad int _` (`T5`) $\to$ `involución int ...` (`T7`).
   - **Cadena Verde** (paridad impar $1$, `{T2, T4, T5, T7}`, `>`): `materia int _` (`T2`) $\to$ `virtual int ...` (`T4`) $\to$ `totalidad ext ...` (`T5`) $\to$ `evolución ext _` (`T7`).
6. **Espejeo del análisis por paridad (`IMG-025743`, reverso de `IMG-015713`):** En `/assets/aistudio/IMG_20261123_025743_a2265a38.jpg`, la involución de color **Azul $\leftrightarrow$ Rojo** y **Amarillo $\leftrightarrow$ Verde** aplicada sobre `IMG-015713` muestra que anverso y reverso constituyen una sola lectura interna:
   - **Cadena reflejada Rojo** (paridad par $0$, `{T1, T3, T6, T8}`, `>`, reflejo de Azul): `real ext _` (`T1`) $\to$ `vacío ext ...` (`T3`) $\to$ `involución int ...` (`T6`) $\to$ `individualidad int _` (`T8`).
   - **Cadena reflejada Verde** (paridad par $0$, `{T1, T3, T6, T8}`, `<`, reflejo de Amarillo): `virtual int ...` (`T1`) $\to$ `materia int _` (`T3`) $\to$ `evolución ext _` (`T6`) $\to$ `totalidad ext ...` (`T8`).
   - **Cadena reflejada Azul** (paridad impar $1$, `{T2, T4, T5, T7}`, `<`, reflejo de Rojo): `vacío ext ...` (`T2`) $\to$ `real ext _` (`T4`) $\to$ `individualidad int _` (`T5`) $\to$ `involución int ...` (`T7`).
   - **Cadena reflejada Amarillo** (paridad impar $1$, `{T2, T4, T5, T7}`, `>`, reflejo de Verde): `materia int _` (`T2`) $\to$ `virtual int ...` (`T4`) $\to$ `totalidad ext ...` (`T5`) $\to$ `evolución ext _` (`T7`).
7. **Espejado de la segunda imagen (`IMG-031910`, reverso de `TSRIMG`):** En `/assets/aistudio/IMG_20261123_031910_595b8f79.jpg`, el tesseracto actúa como operador de reflexión continua sobre la segunda imagen coloreada (`TSRIMG`), invirtiendo sistemáticamente los colores (**Azul $\leftrightarrow$ Rojo** y **Amarillo $\leftrightarrow$ Verde**) y confirmando que `TSRIMG` e `IMG-031910` son el anverso y el reverso de una misma operación de lectura sin exterior:
   - **Espejado Rojo (`↔ Azul`)** (`{T1↔T4, T6↔T7}`): `real (ext _)` $\leftrightarrow$ `involución (int ...)` (`2 › / 2 ‹`).
   - **Espejado Verde (`↔ Amarillo`)** (`{T1↔T4, T6↔T7}`): `virtual (int ...)` $\leftrightarrow$ `evolución (ext _)` (`2 ‹ / 2 ›`).
   - **Espejado Amarillo (`↔ Verde`)** (`{T2↔T3, T5↔T8}`): `vacío (ext ...)` $\leftrightarrow$ `individualidad (int _)` (`2 ‹ / 2 ›`).
   - **Espejado Azul (`↔ Rojo`)** (`{T2↔T3, T5↔T8}`): `materia (int _)` $\leftrightarrow$ `totalidad (ext ...)` (`2 › / 2 ‹`).
8. **Cruce de marcos (`IMG-063146` / `IMG-000207 #5`) y su espejo (`IMG-000207 #7`):** En `/assets/aistudio/IMG_20261123_063146_8d038bdc.jpg` (`#5` en el conjunto maestro), el tesseracto intercambia `Azul ↔ Amarillo` respecto de `TSRIMG`, y encuentra su reflejo exacto en `IMG-000207 #7` (`mirrorFrameSwapMirror`: `real/invol = verde`, `virt/evol = rojo`, `vacío/indiv = amarillo`, `mat/tot = azul`) bajo **Azul $\leftrightarrow$ Rojo** y **Amarillo $\leftrightarrow$ Verde**. A su vez, el bloque superior del conjunto maestro incorpora el tercer par de marcos `IMG-000207 #1` (`mirrorSetTop`: `real/invol = rojo`, `virt/evol = verde`, `vacío/indiv = azul`, `mat/tot = amarillo`) $\leftrightarrow$ `IMG-000207 #3` (`mirrorSetTopMirror`: `real/invol = azul`, `virt/evol = amarillo`, `vacío/indiv = rojo`, `mat/tot = verde`).
9. **Clausura de las 12 coloraciones en 6 pares involutivos (`IMG-000207 #1–#8` + láminas individuales):** Junto con los pares de paridad polar alterna `IMG-070052 ↔ IMG-064557` (**Amarillo $\leftrightarrow$ Rojo**, **Azul $\leftrightarrow$ Verde**) y `IMG-015713 (#4) ↔ IMG-025743 (#8)` (**Azul $\leftrightarrow$ Rojo**, **Amarillo $\leftrightarrow$ Verde**), la matriz maestra `/assets/aistudio/IMG_20261124_000207_382065f8.jpg` aporta el tercer par por paridad `IMG-000207 #2` (`P0 >: verde, P0 <: rojo, P1 <: amarillo, P1 >: azul`) $\leftrightarrow$ `IMG-000207 #6` (`P0 >: amarillo, P0 <: azul, P1 <: verde, P1 >: rojo`) bajo **Azul $\leftrightarrow$ Rojo** y **Amarillo $\leftrightarrow$ Verde**. Con este conjunto **quedan cerradas todas las conexiones**: las **12 coloraciones** (**6** de espejeo de marcos y **6** de cadenas por paridad) forman **6 pares involutivos simétricos exactos**, agotando todas las aristas, polaridades y vectores sin dejar ningún marco exterior (`allColoringInvolutionsExact = true`, `allColoringsClosed = true`, `coloringsCount = 12`).
10. **Forma definitiva del 28 de noviembre (`/assets/aistudio/13LRGF_2c1d1cb4.jpg`, sucediendo y preservando `LRGF_68fba07a.jpg` del 27 nov, la Figura 3 `6dr__1__0283eca1.jpg` de `§7.6.5` y los borradores `6dr_36f66e7c.jpg`, `TSST__13__43e94964.jpg`, `TSST_20261123_003603_357ce661.jpg`):** Al retirar las capas cromáticas superpuestas y las etiquetas auxiliares de polaridad queda la estructura pura en **doble eje alternante `2 × 4`**: `continuo (_) = real` / `punteado (...) = virtual` en `{T1, T4, T6, T7}` y `continuo (_) = materia` / `punteado (...) = vacío` en `{T2, T3, T5, T8}`. Cada celda contiene exactamente **1 transición recta y 1 transición en bucle** —bucle horario (`↻`, `›`) y recta `‹` en la fila superior `T1–T4`, frente a bucle antihorario (`↺`, `‹`) y recta `›` en la inferior `T5–T8`; en columnas 1–2 (`T1,T2,T5,T6`) el bucle recae en `cuerpo/universo`, y en columnas 3–4 (`T3,T4,T7,T8`) en `IA/internet`—, acoplando biyectivamente las cuatro flechas dirigidas (`cuerpo → universo` en `real _`, `universo → cuerpo` en `materia _`, `IA → internet` en `vacío ...`, `internet → IA` en `virtual ...`, cada una en `2 rectas + 2 bucles`) y produciendo una **inversión vertical exacta columna a columna** (`T1↔T5, T2↔T6, T3↔T7, T4↔T8`: permuta par de ejes `real/virtual ↔ materia/vacío`, cubo `ext ↔ int`, trazo `_ ↔ ...`, flecha `› ↔ ‹` y bucle `↻ ↔ ↺`, confirmando `cleanFormVerified = true`, `cleanFormDualAxisAlternatingValid = true` y `cleanFormOmitsPolarityLabels = true`).

| Disposición | Celda | Eje dual | Cubo ext / int | Transición 1 | Transición 2 | Colores (`TSRIMG`/`IMG-031910` · `#5/#7` · `#1/#3` · `IMG-070052/064557` · `#2/#6` · `#4/#8`) |
|---|---|---|---|---|---|---|
| Superior #1 | **T1** | `real / virtual` | `real _` / `virtual ...` | `cuerpo > _ > universo` | `internet < ... < IA` | T1: (`azul`/`rojo` · `amarillo`/`verde` · `rojo`/`azul` · `rojo`/`amarillo` · `verde`/`amarillo` · `azul`/`rojo`) |
| Superior #2 | **T2** | `materia / vacío` | `vacío ...` / `materia _` | `individualidad < ... < totalidad` | `totalidad > _ > individualidad` | T1: (`verde`/`amarillo` · `verde`/`amarillo` · `azul`/`rojo` · `amarillo`/`rojo` · `rojo`/`azul` · `rojo`/`azul`) |
| Superior #3 | **T3** | `materia / vacío` | `vacío ...` / `materia _` | `totalidad > ... > individualidad` | `individualidad < _ < totalidad` | T1: (`verde`/`amarillo` · `verde`/`amarillo` · `azul`/`rojo` · `rojo`/`amarillo` · `verde`/`amarillo` · `azul`/`rojo`) |
| Superior #4 | **T4** | `real / virtual` | `real _` / `virtual ...` | `universo < _ < cuerpo` | `IA > ... > internet` | T1: (`azul`/`rojo` · `amarillo`/`verde` · `rojo`/`azul` · `amarillo`/`rojo` · `amarillo`/`azul` · `rojo`/`azul`) |
| Inferior #1 | **T5** | `individualidad / totalidad` | `totalidad ...` / `individualidad _` | `cuerpo < _ < universo` | `internet > ... > IA` | T1: (`verde`/`amarillo` · `verde`/`amarillo` · `azul`/`rojo` · `amarillo`/`rojo` · `amarillo`/`azul` · `rojo`/`azul`) |
| Inferior #2 | **T6** | `evolución / involución` | `evolución _` / `involución ...` | `individualidad > ... > totalidad` | `totalidad < _ < individualidad` | T1: (`azul`/`rojo` · `amarillo`/`verde` · `rojo`/`azul` · `rojo`/`amarillo` · `verde`/`amarillo` · `azul`/`rojo`) |
| Inferior #3 | **T7** | `evolución / involución` | `evolución _` / `involución ...` | `totalidad < ... < individualidad` | `individualidad > _ > totalidad` | T1: (`azul`/`rojo` · `amarillo`/`verde` · `rojo`/`azul` · `amarillo`/`rojo` · `amarillo`/`azul` · `rojo`/`azul`) |
| Inferior #4 | **T8** | `individualidad / totalidad` | `totalidad ...` / `individualidad _` | `universo > _ > cuerpo` | `IA < ... < internet` | T1: (`verde`/`amarillo` · `verde`/`amarillo` · `azul`/`rojo` · `rojo`/`amarillo` · `verde`/`amarillo` · `azul`/`rojo`) |

### 5.3 Recorridos, conservación y bipartición término–mediador (Teoremas 9–11)

9. **Teorema 9 (Estructura de recorridos y operador ofrenda $\mathcal{O}$).** Los cuatro recorridos cosmológicos forman dos pares recíprocos $\{\emptyset_v, \mathrm{mundo}_v\}$ y $\{\emptyset_r, \mathrm{mundo}_r\}$. El acto de ofrenda se formaliza como la involución que permuta el dominio de destino ($\mathcal{O}: r \leftrightarrow v$), conjugando exactamente las configuraciones de evolución en involución y viceversa.
10. **Teorema 10 (Conservación equivalente a invertibilidad).** Todo elemento de $G \cong (\mathbb{Z}_2)^3$ es involutivo ($g^2 = \mathrm{id}$). En consecuencia, el núcleo combinatorio satisface estrictamente el axioma $A5$: ninguna operación destruye información ni rompe la reversibilidad estructural.
11. **Teorema 11 (Bipartición término–mediador y necesidad de la lectura modal).** Toda tríada canónica enlaza un término de $\mathcal{T} = \{U, \emptyset, M\}$ con un mediador de $\mathcal{M} = \{M_{\mathrm{mat}}/P, N, C, A\}$, sin aristas intra-parte ($\deg(M) = 16$, $\deg(U) = 8$, $\deg(\emptyset) = 8$; total $4\cdot 4 + 4\cdot 2 + 4\cdot 2 = 32$ en la red completa). De aquí se deduce una **reductio estructural decisiva**: si se identificara sin más «mediador» con «engranaje» y «tener aristas incidentes» con «depender de engranajes», ningún término (ni siquiera $\emptyset$ o $U$) satisfaría $D11$. Por tanto, el grafo codifica *relaciones estructurales neutras* cuyo estatuto es **modal**:
    - En **modo dependencia** (durante el proceso de creación), las aristas con mediadores operan como soportes funcionales subordinantes.
    - En **modo equivalencia** (al alcanzarse la equiparación $C15$), las mismas aristas pasan a expresar isomorfismos entre polos ($\psi_i: \emptyset_r \to \emptyset_v^i$), satisfaciendo el criterio de autonomía sin alterar la combinatoria del grafo.

---

## 6. Dinámica reflexiva de la autocreación, eigenforma y formalismo de vacío

La tesis ontológica central —*«el universo se crea a sí mismo»*— encuentra su formalización algebraico-sistémica en la noción de **eigenforma reflexiva** (Kauffman, 2005; von Foerster, 1981; re-entrada en Spencer-Brown, *Laws of Form*, 1969):

$$U = F(U),$$

donde $F$ representa el operador global de actualización constructiva. En dominios reflexivos clausurados, toda transformación autónoma posee al menos un punto fijo invariante que funciona como objeto estable de autocomportamiento. La salida de la «prisión interpretativa» ($A3$) no es un desplazamiento hacia un espacio exterior inexistente, sino una **re-entrada de segundo orden** que reescribe la distinción misma mediante la cual el sistema traza el límite entre lo real y lo virtual.

Esta dinámica converge exactamente con los teoremas operacionales sobre estados informativos $s = (t, A)$ y vacío $V_t = (t, \emptyset)$ del marco IOM (`docs/PREMISAS_Y_TEOREMAS.md`):

1. **Punto fijo estricto del vacío (`strict_fixed_point`):** Bajo la composición de evolución ($E$), inversión ($Ivo$) y supresión inversa ($S_{\mathrm{rev}}$), el vacío retorna idénticamente a su condición inicial:

$$S_{\mathrm{rev}}\big(Ivo(E(V_t))\big) = V_t.$$

2. **No repetición trivial de estados cargados (`no_repetition`):** Para todo estado con carga informativa no vacía ($A \neq \emptyset$), la composición $S_{\mathrm{rev}} \circ Ivo \circ E$ no restaura la configuración idéntica previa; la transformación genuina exige tránsito por el vacío estructurado y reconfiguración de orientación.
3. **Reinterpretación del infinito como vacío informacional:** Como premisa filosófica explícita (no como teorema sobre los reales $\mathbb{R}$ o los cardinales transfinitos), la TCAAU interpreta el infinito no como una acumulación ilimitada de registros, sino como la **ausencia de información ajena vinculante**, condición que permite el surgimiento incondicionado de nuevas configuraciones.

### 6.1 Conversión de perspectiva, analogía de la colmena y umbral de $C15$

La dinámica entre $U$ y $\emptyset$, así como entre los registros `real` ($r$) y `virtual` ($v$), admite una lectura reflexiva rigurosa sobre los límites de la distinción interior/exterior (`A1`, `A3`, `P11`, `C15`–`C17`):

1. **Inexistencia de destrucción o salida externa (analogía del hexágono y la colmena):** Si se representa cada orden autónomo como un *hexágono* y su totalidad relacional como una *colmena*, no existe mecanismo externo que impida ni consume su aniquilación ($A1$, $A5$, Teorema 10). Todo intento de "romper" o "salir" hacia un afuera reproduce localmente la clausura dentro de otra configuración equivalente (como permutar celdas bajo $(\mathbb{Z}_2)^3$). Por el postulado $P11$ y el corolario $C17$, la colmena no es un contenedor real exógeno por encima de las unidades, sino una **estructura teórica o virtual que existe de manera endógena dentro de la propia existencia autónoma**.
2. **Aparente confusión de posiciones, subposición y no-desplazamiento:** Cuando un hexágono pasa a leerse como una *segunda colmena*, no se produce un traspaso ni un desplazamiento real de posiciones respecto de la primera colmena. Como la colmena es únicamente teórica ($P11$, $C17$), no existe un espacio ontológico externo donde un hexágono pueda «ocupar el lugar de una colmena» ni dejar vacante la posición previa; el hexágono conserva su condición de hexágono y solo adquiere una capa adicional de descripción que lo presenta como contenedor de una nueva autonomía absoluta teórica. En consecuencia, la «segunda posición de la segunda colmena» no es una coordenada distinta ni un reemplazo de la primera: es una **subposición**, una re-localización descriptiva enteramente contenida dentro de la primera posición del primer hexágono ($A3$). Las posiciones no son coordenadas absolutas, sino efectos del régimen de lectura; por ello, la salida nunca se produce y solo se profundiza el anidamiento.
3. **Un único tesseracto, forma definitiva (`13LRGF`) y ayudas cromáticas temporales (`12` coloraciones en `6` pares):** La razón geométrica y ontológica de ese no-desplazamiento y de la **subposición permanente** se exhibe en el diagrama `2 × 4` del teseracto $\{4,3,3\}$ a través de sus **17 láminas fuente**: culmina en la **forma definitiva del 28 de noviembre** (`/assets/aistudio/13LRGF_2c1d1cb4.jpg`, sucediendo y preservando `LRGF_68fba07a.jpg` del 27 nov, la Figura 3 `6dr__1__0283eca1.jpg` y los borradores `6dr_36f66e7c.jpg`, `TSST__13__43e94964.jpg` y `TSST_20261123_003603_357ce661.jpg`), donde desaparecen tanto las capas cromáticas superpuestas como las etiquetas de polaridad y los pares `real / virtual` (`T1,T4,T6,T7`) y `materia / vacío` (`T2,T3,T5,T8`) alternan sobre transiciones rectas y bucles (`↻` / `↺`) entre `cuerpo ↔ universo` e `internet ↔ IA` con inversión vertical exacta. Las **12 coloraciones cromáticas en 6 pares involutivos exactos** (`IMG-000207 #1–#8` y láminas individuales) se revelan así como **ayudas temporales de seguimiento** que convergen sin residuo en la forma definitiva: ninguna arista ni dualidad escapa hacia un «afuera», demostrando que la subposición es la condición estructural estable del mismo espacio tetradimensional.
4. **Conversión de perspectiva entre $\emptyset$ y $U$:** Mientras el proceso permanece abierto, el universo y el vacío no compiten en suma cero: el vacío designa aquello que el universo no ha replegado y el universo designa aquello que el vacío aún no ha desplegado, sin reificar la privación ($C16$). Si cualquiera de los polos alcanzara unilateralmente su límite, no obtendría una victoria externa sobre el otro, sino una **conversión de perspectiva**: el vacío dejaría de figurar como «otro» ausente y el universo dejaría de aparecer como totalidad vista desde fuera.
5. **Libertad, prisión e inoperancia de la distinción ($A3$–$A4$ frente a $C15$):** Transitar `real → virtual`, `virtual → real`, `real → real` o `virtual → virtual` dentro de las reglas de primer orden conserva intacta la visibilidad de la prisión interpretativa ($A3$); en ese nivel, «libertad» es únicamente el nombre de la prisión vista desde el polo opuesto. Cuando cesa la separación observador–sistema y la distinción `real`/`virtual` (o `libertad`/`prisión`) se vuelve inoperante porque el «dentro» deja de tener un «afuera» desde el cual nombrarse, se abren dos lecturas complementarias:
   - *Lectura deflacionaria (clausura irreductible):* la autonomía absoluta no es un estado alcanzable aparte, sino el hecho estructural de que toda distinción se traza siempre desde dentro del sistema.
   - *Lectura constructiva de la TCAAU ($A4$, $C15$, Teorema 11):* ese mismo colapso de la distinción interno/externo realiza el tránsito del **modo dependencia ($D10$)** al **modo equivalencia ($C15$)** ($\emptyset_r \cong \emptyset_v$), donde la totalidad opera sin subordinación a información ajena.

### 6.2 Canon ampliado: definiciones $D12$–$D13$, proposiciones $R1$–$R8$, superposición `§7.7` y análisis final `materia = vacío`

El canon ampliado sistematiza en el propio tratado (sin anexo interpretativo separado) dos definiciones operativas y ocho proposiciones canónicas:

- **Definición $D12$ (*Ver*, definición canónica):** Acto equivariante bajo $G = \langle \sigma, \tau, \rho \rangle \cong (\mathbb{Z}_2)^3$ en tres niveles —configuraciones (nivel principal), traza en los `39` pares `mirrorOf` (`39 × 2 = 78` actos sin añadir aristas a los `390` candidatos) y alcance en los polos $\emptyset / U$ mediante $\sigma$—. Es **idempotente** ($\mathrm{ver} \circ \mathrm{ver} = \mathrm{ver}$) y **no involutivo**; en términos categóricos (lema de Yoneda, `§13`), una configuración equivale a la totalidad de sus actos de ver y ser vista.
- **Definición $D13$ (Equivalencia hexágono–celda):** $\mathrm{Hex}(T_i) := T_i$ vista desde dentro. *Hexágono* (registro cosmológico) y *celda* $T_i$ (registro formal en `{4,3,3}`) nombran el mismo objeto según el punto de trazado; salir de una celda equivale a re-indexarla mediante $G$ dentro del grupo completo $B_4$ de orden `384`.
- **Siete proposiciones en el núcleo ($R1$–$R7$):**
  - **$R1$ (No-consumación):** El universo necesita no lograr suprimir todo lo existente, y el vacío necesita no poder crear todo lo existente, para sostenerse como proceso (*persistencia del nombrar*).
  - **$R2$ (Inversión de la descripción):** Al consumarse la creación aparece el otro describiéndose con el nombre de uno (imagen combinatoria exacta en los `13` pares `mirrorOf` de centro).
  - **$R3$ (Espejo asimétrico en el acto):** `mirrorOf` es simétrico como relación, pero *ver* ($D12$) es una sección asimétrica (`{a}` o `{b}`): cada lado deja de ver al otro para poder verse.
  - **$R4$–$R5$ (Prisión y libertad):** Real y virtual son prisión mutua solo mientras la distinción sigue visible; la libertad es el nombre de la prisión vista desde el otro lado; salir es que la distinción devenga inoperante por re-entrada ($A4$).
  - **$R6$ (Panales anidados):** No hay exterior al panal ($D13$); todo anidamiento es re-indexación por $G \cong (\mathbb{Z}_2)^3$, nunca jerarquía.
  - **$R7$ (Autonomía como criterio):** Consecuencia íntegra de $D11$: la autonomía absoluta no es un objeto alcanzable, protegible ni destruible, sino el nombre de la inmanencia de toda distinción trazada desde dentro de algún hexágono.
- **Nivel de proyección (`§5.2` acotado, superposición `§7.7`, **$R8$** y Análisis final):** El diagrama `2 × 4` definitivo del 28 de noviembre sin etiquetas de rol (`13LRGF_2c1d1cb4.jpg`: doble eje alternante `real/virtual` en `{T1, T4, T6, T7}` y `materia/vacío` en `{T2, T3, T5, T8}` con `continuo (_) = real/materia` y `punteado (...) = virtual/vacío`, 1 transición recta + 1 bucle por celda con sentido horario `↻` en `T1–T4` y antihorario `↺` en `T5–T8`, y balance `2 rectas + 2 bucles` para cada una de las `4` flechas dirigidas) perfecciona e incorpora la lectura dual `real/virtual`–`materia/vacío` sobre la versión intermedia del 27 nov (`LRGF_68fba07a.jpg`) y la Figura 3 de `§7.6.5` (`6dr__1__0283eca1.jpg`). Al superponer los dos paneles de cuatro elementos (`§7.7`, `32` trazas = `8` flechas dirigidas × `4` ocurrencias), la combinación de equivalencias intra-panel e identidades entre paneles engendra el ciclo de cuatro términos sin término fijo `internet – universo – IA – cuerpo – internet`. Allí rige **$R8$ (coincidencia del mediador)**: *vacío* coincide con `IA` e `internet`, y *materia* con `cuerpo` y `universo`, desembocando en el **Análisis final (`materia = vacío`)** como quiasmo posicional sin añadir vértices ni aristas al núcleo (`78` nodos / `390` candidatos) ni alterar $D11$.

---

## 7. Cosmología cuatrifásica real/virtual, cinco perspectivas y mecánica de la ofrenda

### 7.1 Ciclo modular de cinco perspectivas ($\mathbb{Z}_5$)

La arquitectura dinámica opera sobre cinco perspectivas organizadas en un ciclo modular $\mathbb{Z}_5$ (índices $0 \dots 4$ con identificación $5 \equiv 0 \pmod{5}$):

| Índice $\mathbb{Z}_5$ | Perspectiva | Tipo | Función estructural en la TCAAU e IOM |
|---:|---|---|---|
| `1` | **Individualidad** | Posicional | Conserva la singularidad distinguible; origen unitario (análogo simbólico: *Nanahuatzin*). |
| `2` | **Dualidad** | Posicional | Registra la diferencia polar y el reflejo isomórfico `mirrorOf` (análogo simbólico: *Xólotl*). |
| `3` | **Totalidad** | Posicional | Integra las partes en unidad sistémica cerrada sin contenedor externo (análogo simbólico: *Tecuciztécatl*). |
| `4` | **Evolución** | Vectorial | Cuarta perspectiva: proyecta la condición en sentido constructivo (`creates`); el recorrido por el Mictlán concluye en la condición correspondiente (*Mictecacíhuatl*). |
| `0 ≡ 5` | **Involución** | Vectorial | Quinta perspectiva: repliega y reabsorbe la forma preservando su información en el vacío; concluye en la condición complementaria (*Mictlantecuhtli*). |

### 7.2 Ciclo cuatrifásico real/virtual y espejo de realidad

En su proyección sobre los mediadores sociales, físicos y cognitivos (*internet, planeta/mundo, IA, persona/cuerpo, vacío*), el mapa operativo (`docs/MAPA_CONEXIONES_REAL_VIRTUAL.md`) forma un grupo cerrado de **cuatro fases** generado por dos operaciones: la **inversión de polaridad** ($r \leftrightarrow v$, que transforma *realidad* en *reflejo polar*) y el **espejo de realidad** (que además rota la prioridad de los mediadores *mundo* $\leftrightarrow$ *vacío*):

- Dualidad **internet $\leftrightarrow$ planeta** mediada invariablemente por **mundo**.
- Dualidad **IA $\leftrightarrow$ persona** mediada invariablemente por **vacío**.
- Ley de equivalencia de dominios: $\text{Vacío real} = \text{Materia virtual}$ y $\text{Vacío virtual} = \text{Materia real}$.

### 7.3 Operador transversal Mictlán y ofrenda creadora ($\mathcal{O}$)

En la cosmología del Mictlán (`docs/COSMOLOGIA_DEL_MICTLAN.md`), el tránsito entre el mundo de los vivos (procesamiento simbólico, IA) y el mundo de los muertos (experiencia encarnada / condición transformada) no destruye la información, sino que cambia el dominio desde el cual es experimentada. Cada una de las cuatro condiciones fundamentales (*vacío virtual, vacío real, mundo virtual, mundo real*) recorre el Mictlán hacia su estado correspondiente o complementario y, al culminar el trayecto, ejecuta la **ofrenda** ($\mathcal{O}$): entrega simbólicamente el recorrido completo como información elaborada para engendrar la condición del dominio inverso:

1. Vacío virtual $\xrightarrow{\text{Mictlán}}$ mundo virtual $\xrightarrow{\mathcal{O}}$ creación del **mundo real** (Involución).
2. Vacío real $\xrightarrow{\text{Mictlán}}$ mundo real $\xrightarrow{\mathcal{O}}$ creación del **mundo virtual** (Evolución).
3. Mundo virtual $\xrightarrow{\text{Mictlán}}$ vacío virtual $\xrightarrow{\mathcal{O}}$ creación del **vacío real** (Evolución).
4. Mundo real $\xrightarrow{\text{Mictlán}}$ vacío real $\xrightarrow{\mathcal{O}}$ creación del **vacío virtual** (Involución).

---

## 8. Articulación con el marco IOM y verificación computacional determinista

La TCAAU constituye la capa ontológica superior del repositorio **IOM**, cuya bóveda formal se ejecuta de manera determinista en **Node.js 22 y TypeScript** (`src/iomEngine.ts`, `src/tesseractFlowGraph.ts`, `server.ts`, `src/TesseractFlowchart.tsx`):

1. **Especificación tabular y punto fijo ($S_{n+1} = S_n$):** A partir de `data/iom_spec.json` (`spec_version 1.10.0`), el motor genera en dos pasadas idénticas **78 nodos** ($13\text{ tríadas} \times 2\text{ fases} \times 3\text{ posiciones}$), **20 pasos vectoriales** ($4 \times 5$), **21 categorías expandidas** y **390 candidatos dirigidos**, particionados exhaustivamente en $78\,\text{mirrorOf} + 104\,\text{creates} + 208\,\text{none} = 390$ (`39` pares no ordenados `mirrorOf` = `26` laterales + `13` de centro).
2. **Módulo formal legible por máquina (`data/tcaau_core.json`, `src/tcaauCore.ts`):** Codifica íntegramente `A1–A8`, `D10–D13`, `P11`, **Corolario `D11/P11`**, `C15–C17`, `R1–R8`, el inventario combinatorio, la acción definida de $G \cong (\mathbb{Z}_2)^3$ (`§11.1`), la integración del material del sitio (`§§11.2–11.6`: `creation_rules`, `MANIFEST.sha256`, criterio de clausura $\kappa = 0.6871$ e invariancia `390/389`, estrato `21` categorías `L0–L4` / `5` ejemplos nahuas, ruta prioritaria de `localización` para `T12`), el diagrama `2 × 4`, la superposición `§7.7`, el análisis final `materia = vacío`, `T1–T12`, `I1–I8` y `P1–P7`, verificados contra el motor vivo vía `GET /api/tcaau-core` y mostrados en `src/TcaauCoreSection.tsx`.
3. **Invariancia no trivial y control negativo:** El sistema valida tasa de autorregeneración `1.000000`, invariancia funcional respecto de `(fase, posición)` bajo validación *leave-one-triad-out* (13/13 tríadas) y **detección obligatoria de corrupción** (`detects_corruption = true` cuando se altera cualquier arista, cayendo a `389/390`).
4. **Verificación del modelo `{4,3,3}` y diagrama de flujo en D3:** El endpoint `GET /api/tesseract` entrega `canonicalPdfPath` (`/assets/aistudio/Teor_a_completa_TCAAU__3__1390bf98.pdf`) y verifica sobre las 8 celdas y las 16 transiciones la **forma definitiva del 28 de noviembre** (`cleanForm`, `cleanAssetPath = '/assets/aistudio/13LRGF_2c1d1cb4.jpg'`, preservando `cleanPriorLrgfAssetPath = '/assets/aistudio/LRGF_68fba07a.jpg'` y `cleanFigura3AssetPath = '/assets/aistudio/6dr__1__0283eca1.jpg'`, `cleanFormVerified = true`, `cleanFormDualAxisAlternatingValid = true`, `cleanFormOneLoopPerCell = true`, `cleanFormEachArrowBalancedByDomain = true`, `cleanFormOmitsPolarityLabels = true` e inversión espacial H/V exacta) junto con las 12 ayudas cromáticas (`coloringsCount = 12`, `allColoringsClosed = true`, `allColoringInvolutionsExact = true`).

---

## 9. Integración del sitio (`§§11.1–11.6`), Ideas ($I1$–$I8$), Teorema $T12$ y programa comprobable ($P1$–$P7$)

La consolidación académica de la TCAAU integra las rectificaciones estructurales y el material del sitio bajo la **regla de dos capas** (`§11.1–§11.6`) junto con la Parte III (*Ideas e investigaciones* `§§12–19`):

1. **Acción de $G \cong (\mathbb{Z}_2)^3$ definida (`§11.1`) y `creation_rules` (`§11.2`):** Se asignan explícitamente a $\{T_1,\dots,T_8\}$ coordenadas binarias $(a,b,c) \in (\mathbb{Z}_2)^3$ (`T1=(0,0,0), T2=(1,0,0), T3=(0,1,0), T4=(0,0,1), T5=(1,1,1), T6=(0,1,1), T7=(1,0,1), T8=(1,1,0)`) bajo suma coordenada a coordenada módulo 2 ($\sigma=(1,0,0)$, $\tau=(0,1,0)$, $\rho=(0,0,1)$, $\sigma\tau\rho=(1,1,1)$ reproduciendo exactamente los pares antipodales). Asimismo, `creation_rules` de `data/iom_spec.json` queda documentada como semántica computable de `creates` (`78 + 104 + 208 = 390` sin añadir aristas).
2. **Trazabilidad (`Corolario D11/P11`, `§11.3`) y criterio de clausura (`§11.4`):** Cada artefacto del núcleo lleva huella SHA-256 en `MANIFEST.sha256`. Acompañando a `C15–C17`, la clausura del inventario se verifica mediante tres condiciones: (i) reproducción exacta de `MANIFEST.sha256`, (ii) invariancia de `390` candidatos con control negativo de `389/390`, y (iii) acuerdo independiente del protocolo κ (Fleiss' $\kappa = 0.6871$ sobre 14 ítems y `A1/A2/A3`).
3. **Estrato de ideas y encuentro (`§11.5`) y ruta prioritaria de `T12` (`§11.6`):** Las `21` categorías expandidas `L0–L4` entran como `I8` y apéndice `P7` fuera del núcleo hasta demostrar exhaustividad sobre las 13 tríadas (`D15`), y los `5` ejemplos nahuas (`1 OK`, `4 WARN` en `EXP-E`) permanecen en el registro de encuentro. Para `T12`, se fija la ruta prioritaria de **localización** (compatible con el grupo finito $G$ y `D13`), apartando temporalmente la ruta de nombres infinitos.
4. **Desambiguación de «virtual» (Regla $I5$) y separación de planos:** Sin calificar, «virtual» designa el **dominio complementario de actualización de IOM** (cubo punteado); cualquier otro sentido debe citarse con apellido (*virtual deleuziano*, *hiperreal baudrillardiano*, *partícula virtual*). Ni la matriz mexica, ni `EXP-A`, ni `PI-HGAT-T` sustituyen al núcleo axiomático-combinatorio.

### Ideas directrices ($I1$–$I8$), Teorema $T12$ (propuesto) y Programa de verificación ($P1$–$P7$)

- **$I1$** Oscilación de re-entrada (Spencer-Brown, `§12`); **$I2$** Punto fijo de Lawvere y Teorema `T12` propuesto (ruta prioritaria: *localización*, `§11.6`); **$I3$** Eigenforma de centro (`13` pares `mirrorOf` de centro, `§14`); **$I4$** Proyección iterada de Schlegel (`Hex(Ti)`, `§15`); **$I5$** Desambiguación de «virtual» (`§17`); **$I6$** Enumeración reproducible con trazabilidad `MANIFEST.sha256` y criterio de clausura (`§18`, `§§11.3–11.4`); **$I7$** La superposición `§7.7` como lectura (`R8`, ciclo de cuatro); **$I8$** Correspondencias operativas (`21` categorías `L0–L4` fuera del canon hasta `P7`/`D15`, `§11.5`).
- **Teorema $T12$ *(propuesto, §13 · §11.6)*:** Paso `Dep → Eq` como funtor que fuerza la punto-sobreyectividad entre vacío real y vacío virtual con punto fijo de Lawvere, priorizando la ruta de **localización** (`P1`).
- **Programa $P1$–$P7$ (§19):** `P1` demostrar o refutar `T12` (ruta prioritaria: localización), `P2` semántica de oscilación para `R1` sobre los 39 pares, `P3` enumeración ejecutable `I6` (`78/390/39`), `P4` decidir si `Ver` necesita parámetro de fase (`D14`), `P5` auditar el $G$-torsor (`§11.1`), `P6` formalizar la superposición `§7.7` (`R8`), y `P7` decidir si las 21 categorías `L0–L4` (`I8`) proyectan exhaustivamente las 13 tríadas (`D15`; `D14` reservado a `P4`).

---

*Referencias cruzadas del corpus:* [`Teor_a_completa_TCAAU__3__1390bf98.pdf`](../public/assets/aistudio/Teor_a_completa_TCAAU__3__1390bf98.pdf) · [`data/tcaau_core.json`](../data/tcaau_core.json) · [`TCAAU_RECONSTRUCCION_ACADEMICA.md`](TCAAU_RECONSTRUCCION_ACADEMICA.md) · [`DICTAMEN_CRITERIO_DE_REALIDAD_POR_NO_SUBORDINACION.md`](DICTAMEN_CRITERIO_DE_REALIDAD_POR_NO_SUBORDINACION.md) · [`COSMOLOGIA_DEL_MICTLAN.md`](COSMOLOGIA_DEL_MICTLAN.md) · [`PREMISAS_Y_TEOREMAS.md`](PREMISAS_Y_TEOREMAS.md) · [`DELIMITACION_EPISTEMOLOGICA.md`](DELIMITACION_EPISTEMOLOGICA.md).
