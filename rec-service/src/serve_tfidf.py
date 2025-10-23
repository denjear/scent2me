from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import os, pandas as pd, numpy as np, joblib
from scipy import sparse
from sklearn.metrics.pairwise import cosine_similarity

# === Setup ===
ART_DIR = os.getenv(ART_DIR, .artifacts)
meta_path = os.path.join(ART_DIR, meta.csv)
tfidf_path = os.path.join(ART_DIR, tfidf.pkl)
x_path = os.path.join(ART_DIR, X_tfidf.npz)

# === Load artifacts ===
print(Loading artifacts from, ART_DIR)
meta = pd.read_csv(meta_path)
vectorizer = joblib.load(tfidf_path)
X = sparse.load_npz(x_path)
print(fLoaded {len(meta)} items)

# === App init ===
app = FastAPI(title=Scent2Me Recommender API)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[],
    allow_methods=[],
    allow_headers=[],
)

@app.get(health)
def health()
    return {ok True, n_items len(meta)}

@app.get(recommend_by_item)
def recommend_by_item(
    id int = Query(..., ge=0),
    k int = Query(12, ge=1),
    price_tol float = Query(0.3, ge=0, le=1),
)
    if id = len(meta)
        return {error id out of range}
    qprice = meta.loc[id, price_num]
    sims = cosine_similarity(X[id], X).ravel()

    # filter harga
    low, high = qprice(1-price_tol), qprice(1+price_tol)
    filt = meta[price_num].between(low, high)
    sims = np.where(filt, sims, -1)

    order = np.argsort(-sims)
    order = [i for i in order if i != id][k]
    items = meta.iloc[order].copy()
    items[similarity] = sims[order]
    return {query_item meta.iloc[id].to_dict(), items items.to_dict(orient=records)}

@app.post(recommend_by_profile)
def recommend_by_profile(payload dict)
    accords_like = payload.get(accords_like, [])
    notes_like = payload.get(notes_like, [])
    min_price = payload.get(min_price, None)
    max_price = payload.get(max_price, None)
    k = payload.get(k, 12)

    # gabung input ke satu string
    prefs =  .join(accords_like + notes_like)
    if not prefs.strip()
        return {error Empty preference list.}

    q = vectorizer.transform([prefs])
    sims = cosine_similarity(q, X).ravel()

    # filter harga
    if min_price is not None
        sims = np.where(meta[price_num] = min_price, sims, -1)
    if max_price is not None
        sims = np.where(meta[price_num] = max_price, sims, -1)

    order = np.argsort(-sims)[k]
    items = meta.iloc[order].copy()
    items[similarity] = sims[order]
    return {items items.to_dict(orient=records)}
