import os
import time
from app.core.database import get_chroma_client

collection = get_chroma_client().get_or_create_collection(name="medical_policies")

# 简单缓存机制：记录查询结果及时间戳
_policy_cache = {}
CACHE_TTL = 300  # 5分钟缓存过期

def init_rag_knowledge():
    """
    初始化 RAG 知识库，将 VitaCross 医疗政策文档向量化存入 ChromaDB
    """
    doc_path = os.path.join(os.path.dirname(__file__), "../../docs/vitacross_policy.md")
    if not os.path.exists(doc_path):
        print("[VitaCross] Warning: vitacross_policy.md not found.")
        return

    with open(doc_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 按双换行简易分块
    chunks = [c.strip() for c in content.split("\n\n") if c.strip()]

    if not chunks:
        return

    # 简单查重机制，避免重复存储
    existing_count = collection.count()
    if existing_count > 0:
        print(f"[VitaCross] RAG Knowledge already initialized with {existing_count} chunks.")
        return

    for i, chunk in enumerate(chunks):
        collection.add(
            documents=[chunk],
            metadatas=[{"source": "vitacross_policy.md"}],
            ids=[f"policy_{i}"]
        )
    print(f"[VitaCross] Successfully loaded {len(chunks)} medical policy chunks into ChromaDB.")

def search_policy(query: str, top_k: int = 2) -> list[str]:
    """
    检索相关的医疗政策与保险理赔规则（带 5 分钟缓存）
    """
    current_time = time.time()
    if query in _policy_cache:
        cached_result, timestamp = _policy_cache[query]
        if current_time - timestamp < CACHE_TTL:
            return cached_result

    if collection.count() == 0:
        return []

    results = collection.query(
        query_texts=[query],
        n_results=top_k
    )
    if not results['documents']:
        return []

    final_result = results['documents'][0]
    _policy_cache[query] = (final_result, current_time)
    return final_result
