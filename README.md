# ✏️ Sketch&Solve

Sketch&Solve is an Apple's new iOS18 Math notes inspired app in which we can draw/write and calculate or analyze whatever we draw using GEMINI API. The idea was to use canvas component of React and whatever we draw on that canvas would given as an input to api as an image where it assess the image and give you result with an expression which the app render it to the react app's frontend using LaTeX. 

## ✨ Features

- **✍️ Draw on Canvas**: Users can freely draw on the canvas using their mouse or trackpad.
- **🧮 Mathematical Expression Rendering**: The results from GEMINI API come as mathematical expressions, which are automatically rendered as LaTeX in the app for easy interpretation.
- **↩️ Undo and Reset Features**: Allows users to undo their previous drawing actions or reset the entire canvas, providing flexibility in the drawing process.
- **🎨 Canvas Integration**: Built using the React Canvas component, allowing users to draw freely on the app with the help of smooth drawing capabilities.
- **🖥️ LaTeX Expression Rendering**: Displays mathematical expressions returned from the GEMINI API using LaTeX rendering for clear visualization of results.
- **❤️ Interactive UI**: Smooth and responsive design for a seamless user experience.

## 🚀 Live App
**Try App**(For the first time reload the page 2-3 time if it doesnt work) -  
https://sketch-solve-react.onrender.com/

## 📸 Screenshots

<img src="https://github.com/user-attachments/assets/e2aafb90-b377-4799-8afe-fc5f6e0ea3c9" width=400 />
<img src="https://github.com/user-attachments/assets/d7c45e54-492c-4991-8124-e8bfb004714b" width=500 height=200 />
<img src="https://github.com/user-attachments/assets/6696a674-8a8e-4aff-ab02-78568bce85c9" width=400 />
<img src="https://github.com/user-attachments/assets/2b9fb898-62ae-4c07-bbd0-b19ae3f29472" width=500 height=200 />
<img src="https://github.com/user-attachments/assets/17181869-9444-4198-9e93-1dae6afece23" width=400 />
<img src="https://github.com/user-attachments/assets/39ad2720-cf3f-4878-9a19-ce35dd3ed817" width=600 height=200 />

## ⚙️ Installation

### 🧩 Deploy React App

- Navigate to the project folder.

- Create .env.local file in the root and add a variable VITE_API_URL with the backend api.

- Run this command
   ```bash
   npm i
   npm run dev
    
### ⚒️ Backend FastAPI

- Navigate to the project folder and open the backend folder separately.

- Create a .env file in root and add GEMINI_API_KEY variable with the api key as its value.

- Install all requirements
   ```bash
   pip install -r requirements.txt
   
- Create a virtusl enviroment using this command
   ```bash
   python3 -m venv .venv
   
- Activate the enviroment and run main.py
   ```bash
   ./.venv/Scripts/actiavte.ps1
   python main.py

## 🧰 Technology Stack

- **Frontend**: React, TypeScript, HTML Canvas Element, LaTeX (MathJax), TailwindCSS, React Router, React Draggable, etc
- **Backend**: Python, GEMINI API, FastApi, GenAi, Uvicorn, Pydantic, CORSMiddleware
- **Development Tools**: VSCode, Prettier, Vite, ESLint and Prompt Engineering
- **Deployement**: Render

## 📇 Contact

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ayoopriyanshu/)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:priyanshusharma3377@gmail.com)
