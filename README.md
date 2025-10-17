# 🌸 Scent2Me — Intelligent Perfume Recommendation Platform

Scent2Me adalah **platform rekomendasi parfum berbasis AI** yang membantu pengguna menemukan parfum dengan aroma serupa dan tersedia untuk dibeli langsung di marketplace seperti **Tokopedia**.  
Proyek ini dikembangkan sebagai **Capstone Project Semester 7** dengan pendekatan **Content-Based & Context-Aware Recommendation System** menggunakan **Next.js + FastAPI**.

---

## 🚀 Tech Stack

**Frontend (Website)**
- [Next.js 14](https://nextjs.org/) — App Router, TypeScript  
- [TailwindCSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + [lucide-react](https://lucide.dev/)  
- [Axios / Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) untuk komunikasi API  

**Backend (Rekomendasi Service)**
- [FastAPI](https://fastapi.tiangolo.com/)  
- [Sentence-BERT](https://www.sbert.net/) + [FAISS](https://faiss.ai/) untuk vector search  
- [Scikit-learn](https://scikit-learn.org/stable/) untuk TF-IDF dan cosine similarity  
- [Pandas & Joblib](https://pandas.pydata.org/) untuk pre-processing  

**Dataset**
- Data hasil *scraping* produk parfum di Tokopedia (nama, brand, harga, rating, link, gambar)  
- Data aroma dari Fragrantica (notes, accords, family, deskripsi, longevity, sillage)  
- Dataset digabung menggunakan *fuzzy matching* berdasarkan kemiripan nama produk.

---

## 🧠 Algoritma Rekomendasi

Pendekatan utama: **Content-Based Filtering (CBF)** yang mengukur kemiripan parfum berdasarkan fitur deskriptifnya.

**Tahapan:**
1. **Preprocessing & Feature Engineering**  
   Gabungkan data Tokopedia × Fragrantica → hasilkan fitur:
   - TF-IDF → notes, accords, family  
   - SBERT → deskripsi aroma  
   - Numeric → longevity, sillage, price  
2. **Similarity Computation**  
score = 0.6 * Cosine(SBERT)
+ 0.3 * Cosine(TF-IDF)
+ 0.1 * Sim(Context)

yaml
Copy code
3. **Diversification (MMR)** — menghindari rekomendasi yang terlalu mirip.  
4. **Context Filtering** — menyesuaikan dengan preferensi user: budget, season, longevity, dll.  

---

## 🧩 Struktur Project

scent2me/
├── web/ # Next.js frontend
│ ├── app/ # Routing (auth, onboarding, homepage, dll)
│ ├── components/ # UI components (navbar, form, grid)
│ ├── lib/ # API helper ke FastAPI
│ ├── public/ # Static assets
│ └── package.json
│
├── rec-service/ # FastAPI backend untuk sistem rekomendasi
│ ├── src/
│ │ ├── serve.py # Endpoint API (by item, by profile)
│ │ ├── features.py # TF-IDF, SBERT, FAISS, MMR
│ │ └── schemas.py # Model request/response
│ ├── artifacts/ # Artefak hasil training (tfidf.pkl, embeddings.npy, dsb)
│ ├── requirements.txt
│ └── Dockerfile
│
└── docker-compose.yml # Jalankan web + backend bersamaan

yaml
Copy code

---

## 🧪 Cara Menjalankan

### 1️⃣ Frontend (Next.js)
```bash
cd web
npm install
npm run dev
# buka http://localhost:3000
2️⃣ Backend (FastAPI)
bash
Copy code
cd rec-service
pip install -r requirements.txt
uvicorn src.serve:app --reload --port 8000
# cek http://localhost:8000/health
3️⃣ Docker Compose (opsional)
bash
Copy code
docker-compose up --build
# web di http://localhost:3000, backend di http://localhost:8000
💡 Fitur Utama
- Login & Onboarding Form
- Homepage dengan kategori aroma
- Rekomendasi parfum mirip berdasarkan aroma & notes
- Integrasi harga & link Tokopedia
- Onboarding personal berdasarkan preferensi user
- Arsitektur modular (Next.js frontend × FastAPI backend)

📊 Rencana Pengembangan
 Tambah Collaborative Filtering saat data user sudah tersedia

 Integrasi database untuk logging klik/simpan

 Improve UI & UX (dark mode, loading state)

 Deploy ke Vercel (frontend) & Render/AWS (backend)

 Evaluasi model dengan Mean Average Precision (MAP@K)

