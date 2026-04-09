# Multi-System Development Guide

This guide explains how to set up the Train Obstacle Detection system when two or more people are working on different computers (one running the Frontend and the other running the Backend + PostgreSQL).

## 1. Network Requirements
- Both computers must be on the **same local network** (same Wi-Fi or Ethernet LAN).
- The Firewall on the **Backend Computer** must allow incoming connections on port **8000** (or whatever port the FastAPI server is running on).

---

## 2. Backend Person Setup (Machine A)

### A. Install & Configure PostgreSQL
1. Install PostgreSQL on your machine.
2. Create a new database named `train_obstacle_db`.
3. Ensure the `postgres` user (or your custom user) has a password.

### B. Find your LAN IP Address
You need to provide your IP address to the Frontend Person.
- **Windows**: Open Command Prompt, type `ipconfig`, and look for `IPv4 Address` (e.g., `192.168.1.15`).
- **Mac/Linux**: Open Terminal, type `ifconfig` or `ip addr`, and look for `inet` under your Wi-Fi interface.

### C. Configure `.env`
Create a file named `.env` in the `backend/` directory:
```env
# Example connection string
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/train_obstacle_db
```

### D. Run the Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*Note: The backend is configured to run on `0.0.0.0:8000`, which means it is visible to other devices on your network.*

---

## 3. Frontend Person Setup (Machine B)

### A. Configure `.env.local`
Create a file named `.env.local` in the `frontend/` directory. Replace `[BACKEND_IP]` with the IP address provided by the Backend Person.

```env
NEXT_PUBLIC_API_URL=http://192.168.1.15:8000
```
*(Example: If the backend IP is 192.168.1.15)*

### B. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 4. Troubleshooting
- **Cannot connect?** Try to ping the backend machine from the frontend machine: `ping 192.168.1.15`.
- **CORS Errors?** The backend is currently configured with `allow_origins=["*"]`, so it should accept requests from any IP. If you see CORS errors, double-check the URL protocol (HTTP vs HTTPS).
- **Postgres Connection?** Ensure the `DATABASE_URL` in the backend `.env` is correct and the PostgreSQL service is running.
