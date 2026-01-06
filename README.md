# Quizly 🚀
> **Master any topic in seconds with AI-powered interactive quizzes.**

Quizly là một nền tảng học tập hiện đại, sử dụng sức mạnh của Trí tuệ nhân tạo (AI) để giúp người dùng tạo, quản lý và thực hiện các bài trắc nghiệm một cách thông minh và sinh động nhất.

---

## ✨ Tính năng nổi bật (Core Features)

- **🧠 AI Quiz Generation (Gemini 3 Pro):** Tự động tạo câu hỏi trắc nghiệm chuyên sâu từ bất kỳ chủ đề nào hoặc từ tài liệu tải lên (PDF, DOCX, Hình ảnh).
- **🎨 AI Image Studio (Nano Banana Pro):** Tích hợp công nghệ tạo ảnh từ văn bản để minh họa cho câu hỏi với chất lượng lên đến 4K.
- **⏱️ Chế độ Timer linh hoạt:** Hỗ trợ tính giờ theo từng câu hỏi (Per-question) hoặc tổng thời gian cả bài (Total duration).
- **🔊 Âm thanh tương tác:** Hệ thống hiệu ứng âm thanh sống động cho mỗi phản hồi (đúng/sai, hết giờ, hoàn thành).
- **📊 Quản lý dữ liệu:** Nhập (Import) và Xuất (Export) dữ liệu bài thi dễ dàng thông qua tệp Excel (XLSX).
- **📱 Giao diện Adaptive:** Thiết kế tối giản, hiện đại, tối ưu hóa cho cả thiết bị di động và máy tính để bàn.

---

## 🛠 Công nghệ sử dụng (Tech Stack)

- **Frontend:** [React 19](https://react.dev/) (phiên bản mới nhất với hiệu suất tối ưu).
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) cho giao diện mượt mà và responsive.
- **AI Engine:** [@google/genai](https://www.npmjs.com/package/@google/genai) (Gemini 3 Pro & Gemini 3 Pro Image).
- **Icons:** [Lucide React](https://lucide.dev/).
- **Data Handling:** [SheetJS (XLSX)](https://sheetjs.com/) cho tính năng Import/Export.
- **Routing:** [React Router 7](https://reactrouter.com/).

---

## 🚀 Bắt đầu nhanh (Getting Started)

### 1. Yêu cầu hệ thống
Bạn cần có một **Google Gemini API Key** để sử dụng các tính năng AI.

### 2. Cấu hình
Đảm bảo biến môi trường `process.env.API_KEY` đã được thiết lập trong môi trường thực thi của bạn.

### 3. Chạy ứng dụng
Mở tệp `index.html` trực tiếp trên trình duyệt hoặc sử dụng một máy chủ local (ví dụ: Live Server trong VS Code).

---

## 📂 Cấu trúc thư mục (Project Structure)

- `components/`: Chứa các thành phần giao diện (UI Components).
- `services/`: Xử lý logic AI (Gemini), âm thanh (Web Audio) và dữ liệu Excel.
- `types.ts`: Định nghĩa các kiểu dữ liệu (TypeScript Interfaces).
- `App.tsx`: Thành phần gốc và quản lý trạng thái chính.

---

## 📄 Giấy phép (License)

Dự án này được phát hành dưới giấy phép **MIT**. Bạn hoàn toàn có thể sử dụng và phát triển thêm cho mục đích cá nhân hoặc thương mại.

---

**Quizly** - *Limitless learning. Powered by intelligence.*