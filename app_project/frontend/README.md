# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).


frontend/
│── public/                     # Chứa favicon, robots.txt, manifest.json
│── src/
│   │── assets/                  # Chứa hình ảnh, font, CSS global
│   │   │── styles/               # Chứa các file CSS/SCSS chung
│   │   │   │── main.css          # File CSS chính
│   │── components/               # Chứa các component dùng chung
│   │   │── ui/                   # Component UI như button, input...
│   │   │── layout/               # Layout chính như Sidebar, Header
│   │── hooks/                    # Chứa các hooks
│   │   │── useAuth.ts                   
│   │   │── useFetch.ts               
│   │── pages/                    # Chứa các trang chính của ứng dụng
│   │   │── auth/                 # Các trang liên quan đến auth
│   │   │   │── Login.vue         # Trang đăng nhập
│   │   │   │── Register.vue      # Trang đăng ký (nếu có)
│   │   │── dashboard/            # Dashboard sau khi đăng nhập
│   │   │   │── Home.vue          # Trang chính
│   │   │── error/                # Các trang lỗi
│   │   │   │── NotFound.vue      # Trang 404
│   │── router/                   # Quản lý router
│   │   │── index.ts              # Cấu hình Vue Router
│   │── store/                    # Quản lý state bằng Pinia
│   │   │── auth.ts               # State quản lý authentication
│   │── services/                 # Chứa logic API call
│   │   │── api.ts                # Cấu hình Axios và gọi API
│   │   │── auth.ts               # API Auth (login, logout, register)
│   │── utils/                    # Chứa helper functions
│   │── App.vue                    # Component gốc
│   │── main.ts                     # File khởi tạo Vue app
│── .env                            # Biến môi trường
│── index.html                      # File HTML chính
│── vite.config.ts                   # Cấu hình Vite
│── package.json                     # Danh sách dependencies
│── tsconfig.json                     # Cấu hình TypeScript
