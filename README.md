# 📌 Contest Tracker

A **MERN-based Contest Tracker** that helps users stay updated with upcoming and past contests from **Codeforces, CodeChef, and LeetCode**. It provides filtering options, bookmarking, and video solutions integration.

## 🚀 Features

- 📅 **Fetch upcoming and past contests** from Codeforces, CodeChef, and LeetCode.
- 🔍 **Filter contests** by platform.
- ⭐ **Bookmark** contests for easy access.
- 🎥 **Attach YouTube solutions** to contests.
- 🔗 **Auto-fetch YouTube links** for solutions (Bonus feature).
- 🌙 **Dark/Light mode toggle**.
- 📱 **Responsive UI** for seamless experience.
- 📖 **Well-documented and maintainable code**.

## 🛠️ Tech Stack

- **Frontend:** React.js (with Next.js), Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **APIs Used:** Codeforces API, CodeChef API, LeetCode API
- **Hosting:** Vercel (Frontend)

## 🎯 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/contest-tracker.git
cd contest-tracker
```

### 2️⃣ Install Dependencies
#### Frontend/Backend
```bash
npm install

```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the backend and frontend directories with the necessary API keys and database configurations.

#### Backend `.env`
```env
PORT=5000
MONGO_URI=your_mongodb_uri
CODEFORCES_API_KEY=your_api_key
CODEFORCES_API_SECRET=your_api_secret
```

### 4️⃣ Run the Application
#### Start Server
```bash

npm run dev
```


## 🛠️ API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/contests` | Fetch all contests |
| POST | `/api/bookmark` | Bookmark a contest |
| GET | `/api/bookmarks` | Get bookmarked contests |
| GET | `/api/solutions` | Fetch solution videos |

## 🤝 Contributing

Feel free to fork the repository and submit pull requests. Ensure your code follows best practices and is well-documented.

## 📝 License

This project is licensed under the **MIT License**.

## 🎯 Contact
For any queries, feel free to reach out:
- 📧 Email: [mr.aryan122@gmail.com](mailto:mr.aryan122@gmail.com)
- 🔗 LinkedIn: [Aryan Katiyar](https://www.linkedin.com/in/aryan-katiyar)
- 🚀 GitHub: [Aryan Katiyar](https://github.com/Katty020)
