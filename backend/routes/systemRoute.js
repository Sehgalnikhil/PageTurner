import express from 'express';
import v8 from 'v8';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';
import { auditEmitter } from '../utils/eventBus.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @route   GET /system/info
// @desc    Lectures 49 & 50: Node.js Runtime, V8 Engine Stats, Global Objects & Event Loop
// @access  Public
router.get('/info', (req, res) => {
  const heapStats = v8.getHeapStatistics();
  const memUsage = process.memoryUsage();

  const toMB = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB';

  res.status(200).json({
    title: 'PageTurner Backend Runtime Diagnostics',
    nodeRuntime: {
      version: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      uptimeSeconds: Math.floor(process.uptime()),
      title: process.title,
    },
    v8Engine: {
      totalHeapSize: toMB(heapStats.total_heap_size),
      usedHeapSize: toMB(heapStats.used_heap_size),
      heapSizeLimit: toMB(heapStats.heap_size_limit),
      totalPhysicalSize: toMB(heapStats.total_physical_size),
      totalAvailableSize: toMB(heapStats.total_available_size),
    },
    processMemory: {
      rss: toMB(memUsage.rss),
      heapTotal: toMB(memUsage.heapTotal),
      heapUsed: toMB(memUsage.heapUsed),
      external: toMB(memUsage.external),
    },
    eventLoopMetrics: {
      status: 'Healthy',
      nonBlockingExecution: true,
      concurrencyModel: 'Single-threaded event loop with Libuv worker pool',
    },
    timestamp: new Date().toISOString(),
  });
});

// @route   GET /system/events
// @desc    Real-time event bus audit stream via EventEmitter
// @access  Public
router.get('/events', (req, res) => {
  const events = auditEmitter.getRecentEvents();
  res.status(200).json({
    count: events.length,
    events,
  });
});

// @route   GET /system/fs-demo
// @desc    File System Module (fs/promises) & Path Module demonstration
// @access  Public
router.get('/fs-demo', async (req, res, next) => {
  try {
    const pkgPath = path.resolve(__dirname, '../package.json');
    const content = await fs.readFile(pkgPath, 'utf8');
    const pkg = JSON.parse(content);

    res.status(200).json({
      moduleDemonstration: 'Node.js fs.promises + path.resolve',
      filePath: pkgPath,
      name: pkg.name,
      version: pkg.version,
      moduleType: pkg.type,
      dependenciesCount: Object.keys(pkg.dependencies || {}).length,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /system/stream-demo
// @desc    Buffers & Node.js Readable Streams demonstration
// @access  Public
router.get('/stream-demo', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  // Demonstrate Buffer chunk streaming
  const chunks = [
    '=== PageTurner Node.js Streams & Buffers Live Stream ===\n\n',
    `Chunk 1: Stream initialized at ${new Date().toISOString()}\n`,
    'Chunk 2: Emitting binary buffer memory allocation...\n',
    `Chunk 3: V8 Active Buffer Size: ${Buffer.byteLength('PageTurner Stream Buffer Chunk', 'utf8')} bytes\n`,
    'Chunk 4: Non-blocking asynchronous chunk transmission complete.\n',
    '=== End of Stream ===\n'
  ];

  let index = 0;
  const stream = new Readable({
    read() {
      if (index < chunks.length) {
        const buf = Buffer.from(chunks[index++], 'utf-8');
        this.push(buf);
      } else {
        this.push(null); // Signal EOF
      }
    }
  });

  stream.pipe(res);
});

export default router;
