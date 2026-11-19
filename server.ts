import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import {
  evaluatePairRule,
  generateArtifacts,
  loadIndependentEvalData,
  loadQuiz,
  loadSpec,
  runInvarianceAudit,
  scoreIndependentEval,
  scoreQuiz,
  validateDomainMapping,
} from './src/iomEngine.ts';
import type { AnnotationsPayload } from './src/iomEngine.ts';

const PORT = Number(process.env.PORT ?? 3000);
const HOST = '0.0.0.0';

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'iom-informational-unit', port: PORT });
  });

  app.get('/api/spec', (_req, res) => {
    try {
      const spec = loadSpec();
      const artifacts = generateArtifacts(spec);
      res.json({
        spec,
        counts: artifacts.counts,
        fixedPoint: artifacts.fixedPoint,
        vectorSteps: artifacts.vectorSteps,
        expandedCategories: artifacts.expandedCategories,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get('/api/triads', (_req, res) => {
    try {
      const spec = loadSpec();
      const artifacts = generateArtifacts(spec);
      res.json({
        nodes: artifacts.nodes,
        relationCandidates: artifacts.relationCandidates,
        counts: artifacts.counts,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post('/api/rule-check', (req, res) => {
    try {
      const { source, target } = req.body as { source?: string; target?: string };
      if (!source || !target) {
        return res.status(400).json({ error: 'Se requieren los identificadores source y target.' });
      }
      return res.json(evaluatePairRule(source, target));
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post('/api/invariance', (req, res) => {
    try {
      const body = (req.body ?? {}) as { corruptCandidateIndex?: number };
      const artifacts = generateArtifacts();
      const report = runInvarianceAudit(
        artifacts.relationCandidates,
        typeof body.corruptCandidateIndex === 'number' ? body.corruptCandidateIndex : undefined
      );
      res.json({
        fixedPoint: artifacts.fixedPoint,
        counts: artifacts.counts,
        invariance: report,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get('/api/independent-eval', (_req, res) => {
    try {
      const { annotations, ruleReference, pairs } = loadIndependentEvalData();
      const report = scoreIndependentEval(annotations, ruleReference);
      res.json({
        annotations,
        ruleReference,
        pairs,
        report,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post('/api/independent-eval/score', (req, res) => {
    try {
      const { annotations, minAnnotators } = req.body as {
        annotations?: AnnotationsPayload;
        minAnnotators?: number;
      };
      const base = loadIndependentEvalData();
      const payload = annotations ?? base.annotations;
      const report = scoreIndependentEval(payload, base.ruleReference, minAnnotators ?? 3);
      res.json({ report });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get('/api/domain-mapping', (_req, res) => {
    try {
      const artifacts = generateArtifacts();
      const validation = validateDomainMapping(artifacts);
      res.json(validation);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get('/api/quiz', (_req, res) => {
    try {
      const quiz = loadQuiz();
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post('/api/quiz/score', (req, res) => {
    try {
      const { answers } = req.body as { answers?: Record<string, string> };
      const result = scoreQuiz(answers ?? {});
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';
  const distDir = path.join(process.cwd(), 'dist');

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`IOM server listening on http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
