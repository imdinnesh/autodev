root/
├── apps/
│   ├── web/               # Next.js UI
│   ├── docs/              # Documentation site
│   └── api/               # Fastify API
│
├── packages/
│   ├── agent/             # Core coding agent runtime
│   ├── embeddings/        # Embedding generator + vector client
│   ├── git/               # Git utilities
│   ├── queue/             # BullMQ wrapper
│   ├── llm/               # Unified LLM interface
│   ├── diff/              # Apply patches, generate diffs
│   ├── shared/            # Types & constants
│   └── utils/             # Common helpers
│
├── infra/
│   ├── postgres/
│   ├── redis/
│   ├── qdrant/
│   └── docker-compose.yml
│
└── turbo.json
