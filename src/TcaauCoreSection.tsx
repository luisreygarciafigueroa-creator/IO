import React, { useState } from 'react';
import { BookOpen, FileText, Download, Layers, Compass, Sparkles } from 'lucide-react';
import type { TcaauCoreDocument, TcaauCoreVerification, TcaauMirrorPairRecord } from './tcaauCore';

export interface TcaauCorePayload {
  core: TcaauCoreDocument;
  mirrorPairs: TcaauMirrorPairRecord[];
  verification: TcaauCoreVerification;
}

type CoreViewTab = 'axioms' | 'propositions' | 'definitions' | 'inventory' | 'ideas';

interface TcaauCoreSectionProps {
  data: TcaauCorePayload;
}

export function TcaauCoreSection({ data }: TcaauCoreSectionProps) {
  const [subTab, setSubTab] = useState<CoreViewTab>('propositions');
  const { core, verification } = data;
  const inv = core.combinatorial_inventory;

  const subTabs: Array<{ id: CoreViewTab; label: string }> = [
    { id: 'propositions', label: `Proposiciones R1–R8 (${core.canonical_propositions.length})` },
    { id: 'axioms', label: `Axiomas A1–A8 (${core.axioms.length})` },
    { id: 'definitions', label: 'D10–D13 · P11 · C15–C17 · §11' },
    { id: 'inventory', label: 'Inventario & {4,3,3} / §7.7' },
    { id: 'ideas', label: 'Teoremas · Ideas I1–I8 · P1–P7' },
  ];

  const downloadCoreJson = () => {
    const serialized = JSON.stringify(core, null, 2);
    const blob = new Blob([serialized], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'tcaau_core.json';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section
      aria-label="Fundamento teórico y núcleo formal TCAAU"
      className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4"
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-300">
              <BookOpen className="w-3.5 h-3.5" />
              Fundamento teórico canónico (TCAAU)
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {core.canonical_edition.author} · {core.canonical_edition.date}
            </span>
          </div>
          <h2 className="text-base font-semibold text-white">
            {core.canonical_edition.title} — Núcleo formal legible por máquina
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            {core.core_thesis.one_sentence_canon}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href={core.canonical_edition.canonical_pdf_path}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-200 text-xs font-medium transition"
          >
            <FileText className="w-3.5 h-3.5" />
            Texto canónico TCAAU (PDF)
          </a>
          <button
            type="button"
            onClick={downloadCoreJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            tcaau_core.json
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
          <div className="text-[11px] text-slate-400">Axiomas y Canon</div>
          <div className="font-mono text-slate-100 font-semibold mt-0.5">
            {verification.axiomCount} axiomas · {verification.propositionCount} prop. ·{' '}
            {verification.definitionCount} def.
          </div>
          <div className="text-[10.5px] text-slate-500">dos estratos · un solo canon</div>
        </div>
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
          <div className="text-[11px] text-slate-400">Pares mirrorOf (D12)</div>
          <div className="font-mono text-sky-300 font-semibold mt-0.5">
            {verification.mirrorPairsVerified.totalPairs} pares ({verification.mirrorPairsVerified.lateralPairs}+
            {verification.mirrorPairsVerified.centerPairs})
          </div>
          <div className="text-[10.5px] text-slate-500">
            26 lat. · 13 centro (eigenformas) · {verification.mirrorPairsVerified.actsForVerD12} actos
          </div>
        </div>
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
          <div className="text-[11px] text-slate-400">Torsor {inv.tesseract_group.group_name}</div>
          <div className="font-mono text-emerald-300 font-semibold mt-0.5">
            {inv.tesseract_group.isomorphism} (orden {inv.tesseract_group.order})
          </div>
          <div className="text-[10.5px] text-slate-500">
            subgrupo de {inv.tesseract_group.full_tesseract_symmetry_group} (
            {inv.tesseract_group.full_tesseract_symmetry_order})
          </div>
        </div>
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
          <div className="text-[11px] text-slate-400">Superposición §7.7</div>
          <div className="font-mono text-amber-300 font-semibold mt-0.5">
            {core.tesseract_and_projections.superposition_7_7.traces_total} trazos · ciclo 4
          </div>
          <div className="text-[10.5px] text-slate-500">
            {verification.valid ? 'verificado vs motor vivo' : 'revisar'}
          </div>
        </div>
      </div>

      <div role="tablist" aria-label="Secciones del núcleo TCAAU" className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-2.5">
        {subTabs.map((t) => {
          const active = subTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSubTab(t.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition cursor-pointer border ${
                active
                  ? 'bg-sky-500/20 text-sky-200 border-sky-500/40'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {subTab === 'propositions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {core.canonical_propositions.map((prop) => (
            <article
              key={prop.id}
              className="bg-slate-950/75 border border-slate-800 rounded-lg p-3.5 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-semibold text-amber-300">
                  {prop.id} · {prop.title}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-[10px] text-slate-300">
                  estrato: {prop.stratum}
                </span>
              </div>
              <p className="text-slate-100 italic leading-relaxed">«{prop.canonical_text}»</p>
              <p className="text-slate-400 text-[11px] leading-relaxed">{prop.commentary}</p>
            </article>
          ))}
        </div>
      )}

      {subTab === 'axioms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {core.axioms.map((ax) => (
            <article
              key={ax.id}
              className="bg-slate-950/75 border border-slate-800 rounded-lg p-3.5 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-semibold text-sky-300">
                  {ax.id} · {ax.name}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-[10px] text-slate-300">
                  {ax.status}
                  {ax.direct_anchor_in_canonical_pdf ? ' · ancla directa' : ''}
                </span>
              </div>
              <p className="text-slate-200 leading-relaxed">{ax.canonical_statement}</p>
              <p className="text-slate-500 text-[11px] font-mono">{ax.formal_note}</p>
            </article>
          ))}
        </div>
      )}

      {subTab === 'definitions' && (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {core.definitions_and_modes.definitions.map((def) => (
              <article
                key={def.id}
                className="bg-slate-950/75 border border-slate-800 rounded-lg p-3.5 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-semibold text-emerald-300">
                    {def.id} · {def.title}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-[10px] text-slate-300">
                    {def.stratum === 'canon_ampliado' ? 'canon ampliado' : 'núcleo'}
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed">{def.canonical_statement}</p>
              </article>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {core.definitions_and_modes.postulates.map((post) => (
              <div
                key={post.id}
                className="bg-slate-950/75 border border-slate-800 rounded-lg p-3.5 space-y-1"
              >
                <div className="font-mono font-semibold text-amber-300">
                  {post.id} · {post.title}
                </div>
                <p className="text-slate-300 leading-relaxed">{post.canonical_statement}</p>
              </div>
            ))}
            <div className="bg-slate-950/75 border border-emerald-500/30 rounded-lg p-3.5 space-y-1">
              <div className="font-mono font-semibold text-emerald-300">
                {core.definitions_and_modes.verifiable_traceability_corollary.id} ·{' '}
                {core.definitions_and_modes.verifiable_traceability_corollary.title}
              </div>
              <p className="text-slate-200 leading-relaxed">
                {core.definitions_and_modes.verifiable_traceability_corollary.canonical_statement}
              </p>
              <p className="text-slate-400 text-[11px] font-mono leading-relaxed">
                {core.definitions_and_modes.verifiable_traceability_corollary.operational_form}
              </p>
            </div>
            {core.definitions_and_modes.corollaries.map((cor) => (
              <div
                key={cor.id}
                className="bg-slate-950/75 border border-slate-800 rounded-lg p-3.5 space-y-1"
              >
                <div className="font-mono font-semibold text-sky-300">
                  {cor.id} · {cor.title}
                </div>
                <p className="text-slate-300 leading-relaxed">{cor.canonical_statement}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-950/75 border border-slate-800 rounded-lg p-3.5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-semibold text-white">
                Integración del material del sitio y criterio de clausura (§11.2–§11.6)
              </div>
              <span className="font-mono text-[11px] text-emerald-300">
                κ = {core.site_integration_11.closure_criterion_11_4.fleiss_kappa} · invariancia{' '}
                {core.site_integration_11.closure_criterion_11_4.candidates_total}/
                {core.site_integration_11.closure_criterion_11_4.negative_control_detected}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {core.site_integration_11.scope_rule}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[11px]">
              <div className="bg-slate-900/70 border border-slate-800 rounded p-2.5 space-y-1">
                <div className="font-mono text-amber-300 font-semibold">
                  Criterio de clausura (§11.4, acompaña C15–C17)
                </div>
                {core.site_integration_11.closure_criterion_11_4.conditions.map((cond) => (
                  <p key={cond} className="text-slate-300 leading-relaxed">
                    {cond}
                  </p>
                ))}
              </div>
              <div className="bg-slate-900/70 border border-slate-800 rounded p-2.5 space-y-1">
                <div className="font-mono text-sky-300 font-semibold">
                  Ruta prioritaria T12 (§11.6): {core.site_integration_11.t12_priority_route_11_6.priority_route}
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {core.site_integration_11.t12_priority_route_11_6.justification}
                </p>
                <p className="text-slate-400 font-mono text-[10.5px]">
                  Estrato de ideas/encuentro (§11.5): {core.site_integration_11.ideas_and_encounter_11_5.expanded_categories_count} categorías{' '}
                  {core.site_integration_11.ideas_and_encounter_11_5.expanded_levels} (I8/P7) ·{' '}
                  {core.site_integration_11.ideas_and_encounter_11_5.nahua_examples_count} ejemplos nahuas (
                  {core.site_integration_11.ideas_and_encounter_11_5.nahua_results}).
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-1.5 pr-3">Material del sitio</th>
                    <th className="py-1.5 px-3">Al núcleo</th>
                    <th className="py-1.5 px-3">A ideas / encuentro</th>
                    <th className="py-1.5 pl-3">Qué entra en esta edición</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {core.site_integration_11.integration_table.map((row) => (
                    <tr key={row.site_material}>
                      <td className="py-1.5 pr-3 font-mono text-slate-200">{row.site_material}</td>
                      <td className="py-1.5 px-3 font-mono text-emerald-300">{row.to_nucleus}</td>
                      <td className="py-1.5 px-3 font-mono text-amber-300">{row.to_ideas_encounter}</td>
                      <td className="py-1.5 pl-3 text-slate-300">{row.edition_action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {subTab === 'inventory' && (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-950/75 border border-slate-800 rounded-lg p-3.5 space-y-2">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                Desglose de pares mirrorOf (39 = 26 + 13) y G-torsor
              </div>
              <p className="text-slate-300 leading-relaxed">
                {inv.unordered_mirror_pairs.lateral.description}
              </p>
              <p className="text-slate-300 leading-relaxed">
                {inv.unordered_mirror_pairs.center.description}
              </p>
              <p className="text-slate-400 font-mono text-[11px]">
                {inv.tesseract_group.torsor_property}
              </p>
            </div>

            <div className="bg-slate-950/75 border border-slate-800 rounded-lg p-3.5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  Diagrama 2×4 ({core.tesseract_and_projections.diagram_2x4_definitive.date}), §7.7 y materia = vacío
                </div>
                <a
                  href={core.canonical_edition.canonical_diagram_path}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10.5px] font-mono text-amber-300 hover:underline"
                >
                  Lámina 27 nov (LRGF)
                </a>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {core.tesseract_and_projections.diagram_2x4_definitive.checkerboard_domain.rule}{' '}
                {core.tesseract_and_projections.diagram_2x4_definitive.loop_reading_rule.epistemic_note}
              </p>
              <p className="text-slate-200 leading-relaxed">
                {core.tesseract_and_projections.final_analysis_matter_vacuum.thesis}
              </p>
              <div className="font-mono text-[11px] text-sky-300 bg-slate-900/90 border border-slate-800 rounded px-2.5 py-1.5">
                Ciclo: {core.tesseract_and_projections.superposition_7_7.four_cycle.join(' – ')}
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {core.tesseract_and_projections.scope_5_2_delimitation}
              </p>
            </div>
          </div>

          <div className="bg-slate-950/75 border border-slate-800 rounded-lg p-3.5 space-y-2">
            <div className="font-semibold text-white">
              Acción definida de G ≅ (Z₂)³ sobre {'{T₁,…,T₈}'} (§11.1)
            </div>
            <p className="text-slate-300 leading-relaxed">{inv.tesseract_group.action_rule}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 pt-1">
              {inv.tesseract_group.coordinates_z2_3.map((entry) => (
                <div
                  key={entry.cell}
                  className="bg-slate-900/80 border border-slate-800 rounded px-2.5 py-1.5 text-center font-mono"
                >
                  <div className="text-sky-300 font-semibold">{entry.cell}</div>
                  <div className="text-[11px] text-slate-300">
                    ({entry.coordinates.join(', ')})
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/75 border border-slate-800 rounded-lg p-3.5 overflow-x-auto">
            <div className="font-semibold text-white mb-2">
              Registros de la distinción (una sola operación sin exterior)
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-1.5 pr-3">Registro</th>
                  <th className="py-1.5 px-3">Distinción</th>
                  <th className="py-1.5 pl-3">Límite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {core.core_thesis.four_registers.map((r) => (
                  <tr key={r.register}>
                    <td className="py-1.5 pr-3 font-mono text-sky-300">{r.register}</td>
                    <td className="py-1.5 px-3 font-mono text-slate-200">{r.distinction}</td>
                    <td className="py-1.5 pl-3 text-slate-300">{r.limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'ideas' && (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {core.ideas.map((idea) => (
              <article
                key={idea.id}
                className="bg-slate-950/75 border border-slate-800 rounded-lg p-3.5 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-semibold text-amber-300">
                    {idea.id} · {idea.name} ({idea.section})
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{idea.anchor}</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{idea.statement}</p>
                <div className="text-[10.5px] font-mono text-slate-500">Estatus: {idea.status}</div>
              </article>
            ))}
          </div>

          <div className="bg-slate-950/75 border border-slate-800 rounded-lg p-3.5 space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Programa comprobable P1–P7 y Teorema propuesto T12 (§13 · §19)
            </div>
            <p className="text-slate-300 leading-relaxed">
              <span className="font-mono text-emerald-300 mr-1.5">T12 (propuesto):</span>
              {core.theorems.find((t) => t.id === 'T12')?.statement}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
              {core.research_program.map((p) => (
                <div key={p.id} className="bg-slate-900/70 border border-slate-800 rounded p-2.5">
                  <div className="font-mono text-sky-300 font-semibold">
                    {p.id} · {p.name}
                  </div>
                  <p className="text-slate-300 text-[11px] mt-0.5">{p.task}</p>
                  <p className="text-slate-500 text-[10.5px] mt-0.5">
                    Criterio: {p.success_criterion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
