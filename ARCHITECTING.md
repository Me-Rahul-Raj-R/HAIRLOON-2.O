# Hairloon: Advanced Enterprise-Grade Architecture
## Autonomous Multi-Agent Orchestration, Scalable Vector Databases, and Modular Vision-RAG Pipeline

This document details the production-ready technical architecture, operational mechanisms, and systems engineering blueprints of **Hairloon**, an AI-powered luxury hairstyle recommendation engine and salon booking platform.

---

## 1. Architectural Overview

Hairloon is built upon a full-stack, distributed architecture designed for low-latency visual analysis, high-accuracy semantic recommendations, and seamless calendar integration. The architecture is composed of three core modules:

1. **Autonomous Multi-Agent Orchestration Layer**: A coordinating hive of specialized, single-responsibility LLM/Vision agents that interact asynchronously to process user media, compute style recommendations, guide booking processes, and answer styling queries.
2. **Scalable Vector Database & Embeddings Layer**: A high-throughput vector index (compatible with Qdrant, Pinecone, or PGVector) storing multi-dimensional embeddings of hair styles, cut textures, face shapes, and salon services.
3. **Modular Computer Vision RAG Pipeline**: A retrieval-augmented generation pipeline that encodes uploaded user facial features into structural metadata, matches them against indexed styles via cosine-similarity search, and augments the context of conversational agents to provide hyper-personalized real-time advice.

```
                  +----------------------------------------------+
                  |              User Interaction                |
                  |     (Selfie Upload, Chat, Booking UI)        |
                  +----------------------+-----------------------+
                                         |
                                         v
                  +----------------------+-----------------------+
                  |         Express.js / Node.js Backend         |
                  +----------------------+-----------------------+
                                         |
               +-------------------------+-------------------------+
               |                                                   |
               v                                                   v
+--------------+---------------+                     +-------------+--------------+
|   Autonomous Multi-Agent     |                     |    Modular Computer Vision |
|     Orchestration Layer      |                     |         RAG Pipeline       |
+--------------+---------------+                     +-------------+--------------+
| - Vision Broker Agent        |                     | - Face Landmark Extractor  |
| - Recommendation Strategist  |                     | - Face Shape Classifying   |
| - Scheduling Coordinator     |                     | - Cosine Similarity Engine |
| - Companion Stylist (Simone) |                     | - Dynamic Context Injector |
+--------------+---------------+                     +-------------+--------------+
               |                                                   |
               +-------------------------+-------------------------+
                                         |
                                         v
                  +----------------------+-----------------------+
                  |     Scalable Vector Database Layer           |
                  |     (PGVector / Qdrant / Pinecone Index)     |
                  +----------------------+-----------------------+
                                         |
                                         v
                  +----------------------+-----------------------+
                  |       Relational Ledger DB (Firestore)       |
                  |       (Salons, Stylists, User Bookings)      |
                  +----------------------------------------------+
```

---

## 2. Autonomous Multi-Agent Orchestration Layer

Hairloon avoids the pitfalls of a single monolithic AI system by utilizing a group of specialized agents. Each agent maintains its own localized state, operates with focused instructions, and communicates via highly defined schemas.

### A. The Agent Registry
*   **Vision Broker Agent**: Triggered immediately upon selfie capture or upload. Its sole responsibility is to evaluate biometric suitability (image contrast, alignment, resolution), detect facial features, and categorize facial metric structures.
*   **Recommendation Strategist Agent**: Takes the structured output of the Vision Broker (e.g., face shape, forehead height, jaw structure) and queries the Vector Database to select the top 5 matching hairstyles for the user's specific gender, texture, and style constraints.
*   **Scheduling Coordinator Agent**: Manages appointment calendars. It translates conversational expressions (e.g., "book me next Friday afternoon") into structured DateTime objects, queries salon databases for real-time availability, and creates booking logs.
*   **Companion Stylist Agent ("Simone")**: The primary conversational interface. Simone coordinates with the other three agents to present recommendations in an engaging, luxurious tone, answering detailed styling and upkeep questions.

### B. Agent Choreography Sequence
1. The user uploads a photo. The **Vision Broker Agent** classifies the biometric outline (e.g., *Round Face Shape* with a 94.6% confidence rating).
2. The **Recommendation Strategist Agent** initiates a semantic vector search for hairstyles suited for *Round* shapes, filtering by user gender.
3. The matches are returned to the **Companion Stylist Agent**, who explains *why* these cuts are optimal (e.g., how an *Angular Fringe* or *French Crop* elongates a round profile).
4. When the user selects a style, the **Scheduling Coordinator Agent** maps local partner salons that specialize in that style and guides the booking.

---

## 3. Scalable Vector Database & Embedding Layer

At scale, searching through thousands of haircuts, styling tips, and salon catalogs using traditional SQL keyword matching is inefficient. Hairloon uses dense vector embeddings to match hairstyles and user faces.

### A. The Vector Embeddings Schema
Every hairstyle in our catalog is mapped into a **768-dimensional vector space** using a text/vision embedding model (such as Google's Multimodal Embeddings API or `text-embedding-004`).
The embedding represents:
*   **Structural Lines**: Angularity, vertical-to-horizontal proportions, and layering heights.
*   **Hair Density & Texture Suitability**: Coarse, straight, curly, or fine.
*   **Styling Complexity**: Maintenance level, required tools, and products.

### B. The Vector Index Configuration (Qdrant / PGVector)
For production deployments, the system utilizes an HNSW (Hierarchical Navigable Small World) index with Cosine Distance metrics:

```sql
-- Enabling the pgvector extension on a PostgreSQL instance
CREATE EXTENSION IF NOT EXISTS vector;

-- Creating the hairstyles vector table
CREATE TABLE hairstyles_vectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    style_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    face_shape_compatibility VARCHAR(50)[] NOT NULL,
    embedding vector(768) NOT NULL
);

-- Creating a high-speed HNSW index for instant Cosine Similarity lookups
CREATE INDEX hairstyles_hnsw_idx ON hairstyles_vectors 
USING hnsw (embedding vector_cosine_ops);
```

### C. Cosine Similarity Searching
When a user's face shape metrics are calculated, a target search vector $\vec{q}$ is created representing the optimal visual lines needed to balance their facial symmetry. A query is run against the index to return the top $k$ matches:

```sql
-- Querying hairstyles that are semantically closest to the user's optimal geometry
SELECT style_id, name, gender,
       1 - (embedding <=> :user_optimal_geometry_vector) AS similarity_score
FROM hairstyles_vectors
WHERE :detected_face_shape = ANY(face_shape_compatibility)
  AND (gender = :user_gender OR gender = 'Unisex')
ORDER BY similarity_score DESC
LIMIT 5;
```

---

## 4. The Modular RAG (Retrieval-Augmented Generation) Pipeline

Our computer vision RAG pipeline solves the "hallucination problem" of standard generative models. Rather than relying on the AI model to invent hairstyles, the system uses the LLM as an intelligent router and synthesizer of real-world salon data.

### Step 1: Input Encoding (Biometric Vision-RAG)
The captured selfie is sent as a base64 payload to the Vision Broker Agent using `gemini-2.5-flash`'s vision capability. The prompt instructs the model to return a structured JSON conforming to a strict biometric schema (facial heights, forehead-to-jaw proportions, eye lines, cheekbone width).

### Step 2: Semantic Retrieval
The RAG router parses this JSON and builds a vector query. It retrieves:
1. Matches from the **Hairstyle Vector Index** (filtering by gender, face shape, and hair length preferences).
2. Nearby partner salons from the **Relational Database** offering those specific cutting techniques.
3. Curated styling advice, upkeep rules, and recommended products.

### Step 3: Context-Augmented Generation
These retrieved database articles are compiled into a compact text block and injected into the **Companion Stylist Agent's** system instructions as verified ground-truth context:

```typescript
// System context construction during the RAG fetch
const systemContext = `
You are Simone, an expert hair stylist at Hairloon. 
The current customer has been analyzed with a **${analysisResult.faceShape}** face shape.
Our vector database retrieved these exact matches for them:
${retrievedStyles.map(s => `- ${s.name}: ${s.description}. Suitable textures: ${s.suitableTextures.join(', ')}`).join('\n')}

Our booking ledger shows these top rated salons nearby specialize in these cuts:
${retrievedSalons.map(sal => `- ${sal.name} (rated ${sal.rating}). Address: ${sal.address}`).join('\n')}

Provide highly-polished, luxury consultation based ONLY on these matches. Recommend specific booking options from the provided list.
`;
```

---

## 5. Security & Deployment Engineering

Hairloon is built with enterprise security, privacy, and low-latency execution at its core.

### A. Scalability & Edge Caching
*   **Media Privacy**: Uploaded selfies are processed immediately in-memory as ephemeral streams. No user images are persisted to long-term storage unless explicitly saved by the user for try-on history, satisfying strict GDPR/CCPA regulations.
*   **Edge Rendering**: The React frontend is built using Vite and compiled into a static client SPA, which can be distributed globally across CDNs.
*   **Server-Side Secret Isolation**: All interactions with the Google GenAI SDK occur behind server-side `/api/*` proxy routes in Express, ensuring client-side security of the `GEMINI_API_KEY`.

### B. High Availability & API Fallbacks
To handle high model demand or external service outages, Hairloon implements a resilient multi-tier fallback system:
1. **Tier 1 (Multimodal Vision Engine)**: Queries the primary `gemini-2.5-flash` model for dense vision analysis.
2. **Tier 2 (Heuristic Face Shape Matching)**: If the API returns a rate limit (503 / 429), the frontend automatically switches to a local biometric heuristic scanning module, allowing users to select/input their face metrics manually while retaining full Catalog, Booking, and Chat functionality.
3. **Tier 3 (Local Style Search)**: If the vector index is unreachable, the system falls back to the local `HAIRSTYLES_DB` dictionary, providing a safe and seamless experience.

---
*Created and maintained by the Hairloon Architecture Team.*
