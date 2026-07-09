# API Contract — PT Mahaga Widya Cita
## REST API Specification v1.0

**Base URL:** `https://mahagawidyacita.co.id/api`  
**Versi API:** v1  
**Format:** JSON  
**Autentikasi:** Bearer Token (JWT via Cookie HttpOnly)  
**Tanggal:** 9 Juli 2026  

---

## Konvensi Umum

### Request Headers

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <jwt_token>  (hanya untuk endpoint yang memerlukan autentikasi)
```

### Standard Response Structure

```typescript
// Success
{
  "success": true,
  "message": string,
  "data": object | array | null,
  "meta"?: {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}

// Error
{
  "success": false,
  "message": string,
  "error": {
    "code": string,
    "details"?: Array<{ field: string, message: string }>
  }
}
```

### HTTP Status Codes

| Code | Makna |
|---|---|
| `200` | OK — Request berhasil |
| `201` | Created — Resource baru berhasil dibuat |
| `400` | Bad Request — Input tidak valid |
| `401` | Unauthorized — Token tidak ada atau tidak valid |
| `403` | Forbidden — Tidak memiliki izin |
| `404` | Not Found — Resource tidak ditemukan |
| `409` | Conflict — Duplikat data (misal: email sudah terdaftar) |
| `422` | Unprocessable Entity — Validasi gagal |
| `429` | Too Many Requests — Rate limit terlampaui |
| `500` | Internal Server Error — Kesalahan server |

---

## 1. Auth API

### 1.1 Registrasi Pengguna Baru

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "fullName": "Budi Santoso",
  "email": "budi.santoso@kemendagri.go.id",
  "phone": "081234567890",
  "institution": "Kementerian Dalam Negeri",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

**Response `201 Created`:**
```json
{
  "success": true,
  "message": "Registrasi berhasil! Cek email Anda untuk verifikasi akun.",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "budi.santoso@kemendagri.go.id",
    "emailVerified": false
  }
}
```

**Error `409 Conflict`:**
```json
{
  "success": false,
  "message": "Email sudah terdaftar.",
  "error": { "code": "EMAIL_ALREADY_EXISTS" }
}
```

---

### 1.2 Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "budi.santoso@kemendagri.go.id",
  "password": "SecurePass123"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Login berhasil.",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "fullName": "Budi Santoso",
      "email": "budi.santoso@kemendagri.go.id",
      "role": "USER",
      "avatarUrl": null
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error `401 Unauthorized`:**
```json
{
  "success": false,
  "message": "Email atau password salah.",
  "error": { "code": "INVALID_CREDENTIALS" }
}
```

---

### 1.3 Logout

```http
POST /api/auth/logout
Authorization: Required
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Logout berhasil."
}
```

---

### 1.4 Verifikasi Email

```http
GET /api/auth/verify-email?token=<verification_token>
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Email berhasil diverifikasi. Silakan login."
}
```

---

### 1.5 Request Reset Password

```http
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "budi.santoso@kemendagri.go.id"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Jika email terdaftar, link reset password telah dikirimkan."
}
```

---

### 1.6 Reset Password

```http
POST /api/auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass456",
  "confirmPassword": "NewSecurePass456"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Password berhasil diubah. Silakan login dengan password baru."
}
```

---

## 2. Articles API

### 2.1 Daftar Artikel

```http
GET /api/articles
```

**Query Parameters:**

| Parameter | Tipe | Default | Deskripsi |
|---|---|---|---|
| `page` | number | 1 | Nomor halaman |
| `limit` | number | 12 | Jumlah item per halaman |
| `category` | string | all | `individu`, `bisnis`, `pemerintah`, `policy-review` |
| `search` | string | - | Kata kunci pencarian |
| `sort` | string | `newest` | `newest`, `oldest`, `popular` |

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Daftar artikel berhasil diambil.",
  "data": [
    {
      "id": "art-001",
      "title": "Panduan SAKIP 2026 untuk Instansi Pemerintah",
      "slug": "panduan-sakip-2026",
      "excerpt": "Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP) mengalami pembaruan...",
      "category": "pemerintah",
      "thumbnailUrl": "https://assets.mahagawidyacita.co.id/articles/sakip-2026.jpg",
      "author": {
        "name": "Oscar Radyan Danar",
        "avatarUrl": "https://assets.mahagawidyacita.co.id/team/oscar.jpg"
      },
      "publishedAt": "2026-07-05T08:00:00Z",
      "readTimeMinutes": 7,
      "viewCount": 1240
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 87,
    "totalPages": 8
  }
}
```

---

### 2.2 Detail Artikel

```http
GET /api/articles/:slug
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Detail artikel berhasil diambil.",
  "data": {
    "id": "art-001",
    "title": "Panduan SAKIP 2026 untuk Instansi Pemerintah",
    "slug": "panduan-sakip-2026",
    "content": "<p>Sistem Akuntabilitas Kinerja Instansi Pemerintah...</p>",
    "category": "pemerintah",
    "tags": ["SAKIP", "Kinerja", "Birokrasi"],
    "thumbnailUrl": "https://assets.mahagawidyacita.co.id/articles/sakip-2026.jpg",
    "author": {
      "name": "Oscar Radyan Danar",
      "position": "CEO & Founder",
      "avatarUrl": "https://assets.mahagawidyacita.co.id/team/oscar.jpg"
    },
    "publishedAt": "2026-07-05T08:00:00Z",
    "readTimeMinutes": 7,
    "viewCount": 1241,
    "relatedArticles": [
      {
        "title": "Memahami Zona Integritas WBK/WBBM",
        "slug": "zona-integritas-wbk-wbbm",
        "thumbnailUrl": "...",
        "publishedAt": "2026-06-20T08:00:00Z"
      }
    ]
  }
}
```

---

## 3. Courses API

### 3.1 Daftar Kursus

```http
GET /api/courses
```

**Query Parameters:**

| Parameter | Tipe | Default | Deskripsi |
|---|---|---|---|
| `page` | number | 1 | Nomor halaman |
| `limit` | number | 9 | Jumlah item per halaman |
| `category` | string | all | Kategori kursus |
| `level` | string | all | `dasar`, `menengah`, `lanjutan` |
| `format` | string | all | `online`, `offline`, `hybrid` |
| `isFree` | boolean | - | Filter kursus gratis |
| `search` | string | - | Kata kunci |

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Daftar kursus berhasil diambil.",
  "data": [
    {
      "id": "crs-001",
      "title": "Penyusunan APBD Berbasis Kinerja",
      "slug": "penyusunan-apbd-berbasis-kinerja",
      "category": "Keuangan Daerah",
      "level": "menengah",
      "format": "online",
      "thumbnailUrl": "https://assets.mahagawidyacita.co.id/courses/apbd.jpg",
      "instructor": {
        "name": "Prof. Dr. M. R. Khairul Muluk, M.Si.",
        "title": "Komisaris & Pakar Keuangan Daerah"
      },
      "durationHours": 12,
      "totalModules": 8,
      "totalEnrollments": 345,
      "price": 0,
      "isFree": true,
      "hasCertificate": true,
      "rating": 4.8,
      "reviewCount": 89
    }
  ],
  "meta": {
    "page": 1,
    "limit": 9,
    "total": 24,
    "totalPages": 3
  }
}
```

---

### 3.2 Detail Kursus

```http
GET /api/courses/:slug
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "id": "crs-001",
    "title": "Penyusunan APBD Berbasis Kinerja",
    "slug": "penyusunan-apbd-berbasis-kinerja",
    "description": "Kursus komprehensif tentang...",
    "objectives": [
      "Memahami konsep APBD berbasis kinerja",
      "Mampu menyusun dokumen APBD sesuai regulasi terbaru"
    ],
    "targetAudience": "ASN di bagian keuangan daerah, perencana pembangunan",
    "curriculum": [
      {
        "moduleNumber": 1,
        "title": "Pengantar Keuangan Daerah",
        "durationMinutes": 90,
        "lessons": [
          { "lessonNumber": 1, "title": "Dasar Hukum Keuangan Daerah", "type": "video", "durationMinutes": 30 },
          { "lessonNumber": 2, "title": "Siklus APBD", "type": "video", "durationMinutes": 45 },
          { "lessonNumber": 3, "title": "Quiz Modul 1", "type": "quiz", "durationMinutes": 15 }
        ]
      }
    ],
    "instructor": {
      "id": "tm-002",
      "name": "Prof. Dr. M. R. Khairul Muluk, M.Si.",
      "bio": "Profesor di bidang administrasi publik...",
      "photoUrl": "..."
    },
    "price": 0,
    "isFree": true,
    "durationHours": 12,
    "totalModules": 8,
    "hasCertificate": true,
    "isEnrolled": false,
    "enrollmentProgress": null
  }
}
```

---

### 3.3 Daftar Kursus

```http
POST /api/courses/:courseId/enroll
Authorization: Required
```

**Response `201 Created`:**
```json
{
  "success": true,
  "message": "Anda berhasil mendaftar kursus ini!",
  "data": {
    "enrollmentId": "enr-001",
    "courseId": "crs-001",
    "enrolledAt": "2026-07-09T16:00:00Z",
    "status": "ACTIVE"
  }
}
```

---

## 4. Webinars API

### 4.1 Daftar Webinar

```http
GET /api/webinars
```

**Query Parameters:**

| Parameter | Tipe | Default | Deskripsi |
|---|---|---|---|
| `page` | number | 1 | |
| `limit` | number | 9 | |
| `status` | string | all | `upcoming`, `live`, `completed` |
| `year` | number | - | Filter berdasarkan tahun |
| `month` | number | - | Filter berdasarkan bulan (1–12) |

**Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "web-027",
      "title": "Smart Discussion Series #27 Tahun 2026",
      "slug": "smart-discussion-series-27-2026",
      "topic": "Strategi Implementasi Reformasi Birokrasi Tematik",
      "description": "Webinar membahas strategi konkret...",
      "speakers": [
        {
          "name": "Dr. Akhmad Amirudin",
          "title": "Chief Business Officer, PT Mahaga Widya Cita",
          "photoUrl": "..."
        }
      ],
      "eventDate": "2026-07-15T09:00:00+07:00",
      "eventEndDate": "2026-07-15T11:00:00+07:00",
      "platform": "zoom",
      "posterUrl": "https://assets.mahagawidyacita.co.id/webinars/sds-27-2026.jpg",
      "status": "upcoming",
      "quota": 500,
      "registeredCount": 234,
      "isQuotaFull": false,
      "hasCertificate": true,
      "isFree": true
    }
  ],
  "meta": {
    "page": 1, "limit": 9, "total": 52, "totalPages": 6
  }
}
```

---

### 4.2 Detail Webinar

```http
GET /api/webinars/:slug
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "id": "web-027",
    "title": "Smart Discussion Series #27 Tahun 2026",
    "slug": "smart-discussion-series-27-2026",
    "topic": "Strategi Implementasi Reformasi Birokrasi Tematik",
    "description": "Deskripsi lengkap webinar...",
    "agenda": [
      { "time": "09.00", "activity": "Pembukaan & Sambutan" },
      { "time": "09.15", "activity": "Pemaparan Materi" },
      { "time": "10.00", "activity": "Diskusi & Tanya Jawab" },
      { "time": "11.00", "activity": "Penutupan" }
    ],
    "speakers": [ { ... } ],
    "moderator": { "name": "Laily Akbariah", "title": "COO" },
    "eventDate": "2026-07-15T09:00:00+07:00",
    "platform": "zoom",
    "posterUrl": "...",
    "status": "upcoming",
    "quota": 500,
    "registeredCount": 234,
    "isQuotaFull": false,
    "materialsUrl": null,
    "recordingUrl": null
  }
}
```

---

### 4.3 Pendaftaran Webinar (Guest — tanpa login)

```http
POST /api/webinars/:webinarId/register
```

**Request Body:**
```json
{
  "fullName": "Siti Rahayu",
  "email": "siti.rahayu@pemkot-malang.go.id",
  "phone": "082198765432",
  "institution": "Pemerintah Kota Malang",
  "position": "Analis Kebijakan Ahli Muda",
  "captchaToken": "03AGdBq25..."
}
```

**Response `201 Created`:**
```json
{
  "success": true,
  "message": "Pendaftaran berhasil! Email konfirmasi dan link Zoom telah dikirimkan.",
  "data": {
    "registrationId": "reg-001",
    "webinarTitle": "Smart Discussion Series #27 Tahun 2026",
    "eventDate": "2026-07-15T09:00:00+07:00",
    "confirmationSentTo": "siti.rahayu@pemkot-malang.go.id"
  }
}
```

**Error `409 Conflict`:**
```json
{
  "success": false,
  "message": "Email ini sudah terdaftar untuk webinar ini.",
  "error": { "code": "ALREADY_REGISTERED" }
}
```

---

## 5. Contact API

### 5.1 Kirim Pesan Kontak

```http
POST /api/contact
```

**Request Body:**
```json
{
  "fullName": "Ahmad Miftahul",
  "email": "ahmad@bkd.malangkab.go.id",
  "phone": "081245678901",
  "institution": "Badan Kepegawaian Daerah Kab. Malang",
  "position": "Kepala Bidang",
  "servicesInterested": ["smart-consulting", "smart-executive-education"],
  "message": "Kami tertarik dengan layanan pelatihan dan pendampingan SAKIP untuk seluruh OPD kami...",
  "captchaToken": "03AGdBq25..."
}
```

**Response `201 Created`:**
```json
{
  "success": true,
  "message": "Pesan Anda telah kami terima! Tim kami akan menghubungi Anda dalam 1x24 jam.",
  "data": {
    "ticketId": "TKT-20260709-001"
  }
}
```

---

## 6. Certificates API

### 6.1 Verifikasi Sertifikat (Publik)

```http
GET /api/certificates/verify?code=MWC-2026-CRS001-BUD
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Sertifikat valid.",
  "data": {
    "certCode": "MWC-2026-CRS001-BUD",
    "recipientName": "Budi Santoso",
    "programName": "Penyusunan APBD Berbasis Kinerja",
    "programType": "course",
    "issuedAt": "2026-07-01T00:00:00Z",
    "issuedBy": "PT Mahaga Widya Cita",
    "isValid": true
  }
}
```

**Error `404 Not Found`:**
```json
{
  "success": false,
  "message": "Kode sertifikat tidak ditemukan atau tidak valid.",
  "error": { "code": "CERTIFICATE_NOT_FOUND" }
}
```

---

### 6.2 Daftar Sertifikat Pengguna

```http
GET /api/certificates/mine
Authorization: Required
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cert-001",
      "certCode": "MWC-2026-CRS001-BUD",
      "programName": "Penyusunan APBD Berbasis Kinerja",
      "programType": "course",
      "issuedAt": "2026-07-01T00:00:00Z",
      "downloadUrl": "https://assets.mahagawidyacita.co.id/certificates/MWC-2026-CRS001-BUD.pdf"
    }
  ]
}
```

---

## 7. Team API

### 7.1 Daftar Anggota Tim

```http
GET /api/team
```

**Query Parameters:**

| Parameter | Tipe | Deskripsi |
|---|---|---|
| `division` | string | Filter: `management`, `komisaris`, `direktur`, `advisor`, `expert` |

**Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "tm-001",
      "name": "Oscar Radyan Danar, S.AP., M.AP., Ph.D.",
      "position": "Founder & Chief Executive Officer",
      "division": "management",
      "bio": "Pendiri PT Mahaga Widya Cita dengan latar belakang...",
      "photoUrl": "https://assets.mahagawidyacita.co.id/team/oscar.jpg",
      "linkedinUrl": "https://linkedin.com/in/oscar-radyan"
    }
  ]
}
```

---

## 8. Career API

### 8.1 Daftar Lowongan

```http
GET /api/career
```

**Query Parameters:**

| Parameter | Tipe | Deskripsi |
|---|---|---|
| `division` | string | Filter berdasarkan divisi |
| `type` | string | `full-time`, `part-time`, `contract`, `internship` |

**Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "job-001",
      "title": "Full Stack Developer",
      "slug": "full-stack-developer",
      "division": "Teknologi",
      "type": "full-time",
      "location": "Malang, Jawa Timur (Hybrid)",
      "deadline": "2026-08-01T23:59:59Z",
      "publishedAt": "2026-07-01T00:00:00Z"
    }
  ]
}
```

---

### 8.2 Kirim Lamaran

```http
POST /api/career/:jobId/apply
Content-Type: multipart/form-data
```

**Form Data:**

| Field | Tipe | Keterangan |
|---|---|---|
| `fullName` | string | Required |
| `email` | string | Required |
| `phone` | string | Required |
| `portfolioUrl` | string | Optional (URL) |
| `coverLetter` | string | Optional |
| `cv` | file | Required, PDF, maks 5MB |

**Response `201 Created`:**
```json
{
  "success": true,
  "message": "Lamaran Anda berhasil dikirim! Kami akan menghubungi Anda jika kualifikasi sesuai.",
  "data": {
    "applicationId": "APP-2026-001"
  }
}
```

---

## 9. Rate Limiting

| Endpoint Group | Limit |
|---|---|
| Auth endpoints (`/api/auth/*`) | 10 request/menit per IP |
| Public read endpoints (`GET`) | 100 request/menit per IP |
| Form submission (`POST /api/contact`, `POST /api/webinars/*/register`) | 5 request/menit per IP |
| Protected user endpoints | 60 request/menit per user |

**Rate Limit Response `429 Too Many Requests`:**
```json
{
  "success": false,
  "message": "Terlalu banyak permintaan. Coba lagi dalam beberapa saat.",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "retryAfter": 60
  }
}
```

---

## 10. Error Code Reference

| Code | HTTP Status | Deskripsi |
|---|---|---|
| `VALIDATION_ERROR` | 400/422 | Input tidak valid |
| `INVALID_CREDENTIALS` | 401 | Email/password salah |
| `TOKEN_EXPIRED` | 401 | JWT token kedaluwarsa |
| `TOKEN_INVALID` | 401 | JWT token tidak valid |
| `FORBIDDEN` | 403 | Tidak memiliki akses |
| `NOT_FOUND` | 404 | Resource tidak ditemukan |
| `EMAIL_ALREADY_EXISTS` | 409 | Email sudah terdaftar |
| `ALREADY_REGISTERED` | 409 | Sudah mendaftar untuk event ini |
| `QUOTA_FULL` | 409 | Kuota webinar penuh |
| `CERTIFICATE_NOT_FOUND` | 404 | Sertifikat tidak ditemukan |
| `FILE_TOO_LARGE` | 400 | Ukuran file melebihi batas |
| `INVALID_FILE_TYPE` | 400 | Tipe file tidak diizinkan |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit terlampaui |
| `INTERNAL_ERROR` | 500 | Kesalahan server internal |

---

*API Contract ini mengikuti RESTful conventions dan akan di-versioning jika terjadi breaking changes.*
