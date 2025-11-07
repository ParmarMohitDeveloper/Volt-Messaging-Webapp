# ⚡ Volt - Real-Time Messaging Web App

Volt is a **real-time messaging platform** built using the **MERN stack** (MongoDB, Express.js, React, Node.js) with **Socket.IO** for instant communication.

It allows users to chat live with anyone registered on the platform, update their profiles, and enjoy smooth and responsive chatting — all through a clean and intuitive UI.

---

## 🌐 Live Demo

🔗 [https://voltmessage.netlify.app](https://voltmessage.netlify.app)

> ⚠️ *Note: Volt is hosted on free domains and servers, so it may occasionally crash. An upgraded deployment is planned soon.*

---

## 🚀 Features

- 💬 **Real-time one-to-one chat** using Socket.IO  
- 👥 **View all registered users** and start chatting instantly  
- ✏️ **Edit and delete messages** in real time  
- 🕒 **Timestamps** for every message  
- 🖼️ **Profile image and name customization**  
- 📱 **Responsive design** for all screen sizes  

---

## 🧠 What I Learned

Building Volt taught me the **complexities of WebSocket integration**, managing multiple live connections, message syncing, and state handling between frontend and backend.  
It also deepened my understanding of **authentication, backend architecture**, and how to make real-time communication feel effortless.

---

## 🛠️ Tech Stack

**Frontend:** React + Tailwind CSS  
**Backend:** Node.js + Express.js  
**Database:** MongoDB (Mongoose)  
**Real-time:** Socket.IO  
**Hosting:** Netlify (Frontend) & Vercel (Backend)  

---

## ⚙️ Environment Variables

Before running the app locally, create a `.env` file in the backend directory with the following fields:

```env
PORT=your_port
JWT_SECRET=your_jwt_secret_key
MONGODB_URL=your_mongodb_connection_string
EMAIL_USERNAME=your_email_address(your real email address)
EMAIL_PASSWORD=your_email_app_password
📨 The EMAIL_USERNAME and EMAIL_PASSWORD are used for sending OTPs during signup.
🔐 Important: EMAIL_PASSWORD should be an app password (for example, a Google App Password) — not your main email account password.
You can generate an app password from your email provider (for Google: Google Account → Security → App passwords).
Using an app password is more secure and ensures the OTP emails are delivered correctly.

🧩 Installation & Setup

Clone the repository

git clone https://github.com/yourusername/volt.git
cd volt


Install dependencies for both backend and frontend 

cd backend
npm install
cd frontend
npm install


Add your .env file in the backend folder.

Run the backend

cd backend
npm start


Run the frontend

cd frontend
npm run dev


Open your browser and navigate to:

http://localhost:5173

🧑‍💻 Developer

Developed by: Parmar Mohit
For any queries or feedback, reach out to me at: mohitparmardeveloper@gmail.com
❤️ A personal learning project built with passion and countless debugging hours.

✨ Future Improvements:
Group chats
Media/file sharing
Improved hosting performance
Message notifications
Typing indicators

📄 License
This project is open-source and available under the MIT License.

⭐ If you like this project, give it a star! It motivates me to build more cool stuff like Volt.
