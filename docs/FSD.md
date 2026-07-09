# Functional Specification Document (FSD)
**Project:** PT Mahaga Widya Cita Corporate Website & Portal

## 1. Introduction
This document details the functional requirements for the corporate website and portal.

## 2. Frontend Modules
### 2.1 Navigation & Footer
- **Global Header:** Contains logo, primary navigation links with dropdowns for "Tentang Kami" and "Layanan", and a CTA button. Changes color on scroll.
- **Global Footer:** Contains comprehensive site map, contact information, social links, and newsletter subscription form.

### 2.2 Core Pages
- **Homepage:** Hero section with dynamic animations, service highlights, recent articles, and newsletter section.
- **Service Pages:** Individual pages describing services (Smart Consulting, Executive Education, etc.) with detailed content and related contact forms.

## 3. CMS & Backend Modules
### 3.1 Content Management
- **Payload CMS Dashboard:** Accessible via `/admin`.
- **Rich Text Editor:** Lexical editor for writing complex articles and reviews.

### 3.2 File Storage
- **Media Uploads:** All uploaded images and PDFs are automatically routed to Cloudflare R2 via S3 adapter.
