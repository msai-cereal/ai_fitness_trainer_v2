<div align="center">
<h1 align="center">
<img src="./frontend/public/logo512.png" width="100" />

<br>AI Fitness Trainer</h1>
<h3>실시간 자세 교정 AI 트레이너</h3>
<h3>MS AI SCHOOL </h3>

    
<p align="center">
<img src="https://img.shields.io/badge/Chart.js-FF6384.svg?style=flat&logo=chartdotjs&logoColor=white" alt="Chart.js" />
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript" />
<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=flat&logo=HTML5&logoColor=white" alt="HTML5" />
<img src="https://img.shields.io/badge/PostCSS-DD3A0A.svg?style=flat&logo=PostCSS&logoColor=white" alt="PostCSS" />
<img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white" alt="Vite" />

<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/Python-3776AB.svg?style=flat&logo=Python&logoColor=white" alt="Python" />
<img src="https://img.shields.io/badge/FastAPI-009688.svg?style=flat&logo=FastAPI&logoColor=white" alt="FastAPI" />

</p>
<img src="https://img.shields.io/github/license/msai-cereal/ai_fitness_trainer_v3?style=flat&color=5D6D7E" alt="GitHub license" />
<img src="https://img.shields.io/github/last-commit/msai-cereal/ai_fitness_trainer_v3?style=flat&color=5D6D7E" alt="git-last-commit" />
<img src="https://img.shields.io/github/commit-activity/m/msai-cereal/ai_fitness_trainer_v3?style=flat&color=5D6D7E" alt="GitHub commit activity" />
<img src="https://img.shields.io/github/languages/top/msai-cereal/ai_fitness_trainer_v3?style=flat&color=5D6D7E" alt="GitHub top language" />
</div>

---

## 📖 Table of Contents
- [📖 Table of Contents](#-table-of-contents)
- [📍 Overview](#-overview)
- [📦 Features](#-features)
- [📂 repository Structure](#-repository-structure)
- [⚙️ Modules](#modules)
- [🚀 Getting Started](#-getting-started)
    - [🔧 Installation](#-installation)
    - [🤖 Running ai_fitness_trainer_v3](#-running-ai_fitness_trainer_v3)
    - [🧪 Tests](#-tests)
- [🛣 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👏 Acknowledgments](#-acknowledgments)

---


## 📍 Overview

AI 피트니스 트레이너는 AI와 피트니스 트레이닝 분야를 결합하여 실시간 사용자별 운동 피드백을 제공하는 멀티모달 AI 웹 애플리케이션입니다. React로 제작된 애플리케이션 프론트엔드는 접근 가능한 사용자 인터페이스와 경로와 같은 기능을 제공하며, 전반적인 디자인은 TailwindCSS와 같은 파일을 통해 처리됩니다. Python으로 구축된 백엔드는 운동 형태를 평가하고, 반복 횟수를 계산하며, WebSocket을 통해 실시간 피드백을 제공하는 YOLO 모델과 유틸리티 스크립트를 배포합니다. 이 애플리케이션은 실시간으로 운동 자세 교정 및 맞춤형 피드백을 통해 사용자의 운동 경험을 향상시킵니다.

---

## 📦 Features

|    | Feature            | Description                                                                                                        |
|----|--------------------|--------------------------------------------------------------------------------------------------------------------|
| ⚙️ | **Architecture**   | The architecture follows a separation of concerns; the frontend is a React app, while the backend is a Python-FastAPI app utilizing a YOLO PyTorch model.|
| 📄 | **Documentation**  | There is no explicit documentation, which makes understanding the system hard for new developers and users. Only inline comments are provided. |
| 🔗 | **Dependencies**   | Dependencies include Python modules like FastAPI, Pydantic, and PyTorch for backend, and frontend libraries such as React and TailwindCSS. |
| 🧩 | **Modularity**     | The system shows modularity with its division into front and back ends. Further, the frontend and backend are divided into various logical components or modules. |
| 🧪 | **Testing**        | Only a single file for frontend testing is present. No backend tests are provided nor CI/CD setup, reducing the reliability of the result. |
| ⚡️  | **Performance**    | Performance is implicitly determined by the efficiency of the YOLO model and the FastAPI backend. The frontend uses web-vitals for performance measurement. |
| 🔐 | **Security**       | No specific security measures could be identified. There are interactions over unencrypted websockets and data validation is not apparent.  |
| 🔀 | **Version Control**| Usage of Git for version control, but there's no evidence of branch strategies or commit message principles, making code changes difficult to track.|
| 🔌 | **Integrations**   | The system interacts with frontend via HTTP and websockets. The frontend appears to call backend exercise endpoints based on user interactions. |
| 📶 | **Scalability**    | Scalability of the system can be hindered due to the absence of stateless backend or containerization. Frontend portion seems scalable because of React. |


---


## 📂 Repository Structure

```sh
└── ai_fitness_trainer_v3/
    ├── backend/
    │   ├── main.py
    │   ├── s_6_best.pt
    │   └── utils/
    │       ├── condition_check.py
    │       ├── countings.py
    │       └── yolo_model.py
    ├── frontend/
    │   ├── .eslintrc.cjs
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── postcss.config.js
    │   ├── public/
    │   ├── src/
    │   │   ├── App.css
    │   │   ├── App.jsx
    │   │   ├── App.test.jsx
    │   │   ├── components/
    │   │   ├── index.css
    │   │   ├── main.jsx
    │   │   ├── reportWebVitals.jsx
    │   │   ├── routes/
    │   │   └── setupTests.js
    │   ├── tailwind.config.js
    │   └── vite.config.js
    └── requirements.txt

```

---


## ⚙️ Modules

<details closed><summary>Root</summary>

| File                                                                                                | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---                                                                                                 | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| [requirements.txt](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/requirements.txt) | The code provides a project structure for an AI Fitness Trainer application. The backend handles the main functionality and utilities with modules for condition checking, counting, and a Yolo model. The frontend, perhaps employing JavaScript or TypeScript, contains files for setting up testing, routes, components, and style. The `requirements.txt` file outlines the necessary Python packages including ultralytics, dill, uvicorn, fastapi, and pydantic, along with instructions for installing PyTorch and CUDA support. |

</details>

<details closed><summary>Frontend</summary>

| File                                                                                                             | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---                                                                                                              | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| [index.html](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/frontend/index.html)                 | The provided code describes the structure of an AI fitness trainer application, consisting of a frontend designed in JavaScript, and a Python backend utilizing the PyTorch YOLO model for object detection. The backend performs condition-checking and counting activities, while the frontend contains an interface in an HTML file that houses the JS main script root. App styling and testing procedures are also outlined.                                                                                                                          |
| [vite.config.js](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/frontend/vite.config.js)         | The code belongs to an AI fitness trainer application. It comprises backend code involving main execution, utility scripts, and a pretrained model; and frontend code, including configuration files, source files, testing files, and packages. The particular file vite.config.js configures Vite for the application's frontend. It includes the React plugin and also optimizes dependencies for better performance, specifically targeting web-vitals.                                                                                                |
| [package-lock.json](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/frontend/package-lock.json)   | The ai_fitness_trainer_v3 directory contains two subdirectories ‘frontend’ and ‘backend’. Backend includes a main python file, a PyTorch model file (s_6_best.pt), and utility files. It presumably oversees AI functionalities such as processing fitness data. Frontend covers the user interface, including configurations, component files, and routing files for display. Notably, dependencies such as React and various packages including daisyui and flowbite are denoted in the package-lock.json file.                                          |
| [tailwind.config.js](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/frontend/tailwind.config.js) | The directory structure reflects a two-part AI fitness trainer app, segregated into a backend and frontend. The backend includes a main python script, a model file, and utility files for the model. The frontend is written in JavaScript and includes application and test scripts, routing logic, and various configuration files. Specifically, the tailwind.config.js is part of the frontend design, configuring the TailwindCSS library to apply styles based on the content of HTML and JSX files. It additionally extends plugins using daisyui. |
| [.eslintrc.cjs](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/frontend/.eslintrc.cjs)           | The code belongs to an AI fitness trainer application. The backend handles AI processes, including condition checks and counting, with a YOLO model for object detection. The frontend is a React app with particular configurations for JavaScript and React linting to ensure code quality. Overall, it's an app that uses AI for fitness training and a well-structured frontend for user interaction.                                                                                                                                                  |
| [package.json](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/frontend/package.json)             | The code is a directory structure and configuration file for an AI Fitness Trainer application. The backend directory contains a model file and Python scripts for various utilities, including a condition checker and a YOLO model. The frontend directory contains various configuration and JavaScript files for frontend development using React. It includes scripts for development, build, and lint operations, as well as dependency configurations for various libraries like React, flowbite, DaisyUI, Chart.js and more.                       |
| [postcss.config.js](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/frontend/postcss.config.js)   | The ai_fitness_trainer_v3 project consists of a frontend and backend. The backend features the main application logic, a PyTorch model named s_6_best.pt, and utility scripts handling conditions, countings, and YOLO model functions. The frontend is built with React, employing various configuration files including PostCSS configuration for Tailwind CSS and Autoprefixer. It also consists of components, routes, and various test setups.                                                                                                        |

</details>

<details closed><summary>Src</summary>

| File                                                                                                                   | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---                                                                                                                    | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| [main.jsx](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/frontend/src/main.jsx)                       | The provided codebase represents an AI fitness trainer application. The backend consists of the main application file, a pre-trained model (s_6_best.pt), and utilities for condition checks, counting, and a YOLO (object detection) model. The frontend has a React-based architecture with components, styling, routing, testing, and web vitals reporting. The code snippet runs the main frontend React app, tracking web vitals while wrapping the app within React.StrictMode for highlighting potential issues in components. |
| [App.test.jsx](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/frontend/src/App.test.jsx)               | The provided code is a unit test for a file within a front-end application, specifically testing whether a learn react link renders correctly in the App component. This setup is part of a wider fitness AI application with a frontend built in React (containing components, routes, and tests) and a backend containing scripts, a model, and utility functions (for conditions, counting, and the Yolo model).                                                                                                                   |
| [reportWebVitals.jsx](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/frontend/src/reportWebVitals.jsx) | The provided code is part of an AI fitness application. Its main function, reportWebVitals, in frontend reportWebVitals.jsx, dynamically imports web-vitals library to measure important web vitals like CLS, FID, FCP, LCP, and TTFB, then invokes them using an input callback function. This enables tracking and improving application performance by providing metrics about real-time user experience.                                                                                                                          |
| [App.jsx](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/frontend/src/App.jsx)                         | The provided code is for an AI Fitness training application. The backend implements a YOLO model, and utilizes utility scripts for condition checks and countings. The frontend is a React application with a Home route and a TestPage route accepting exerciseTypeParams. The setup has been configured with ESLint, PostCSS, Tailwind, Vite, and unit testing.                                                                                                                                                                     |
| [index.css](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/frontend/src/index.css)                     | The code introduces a directory structure for an AI Fitness Trainer application. It contains frontend and backend directories, with the backend for main actions, utilities and model training files. The frontend handles the website's UI, routing, and test cases. The provided CSS code excerpt employs Tailwind directives for inserting base, component, and utility styles, and contains (commented out) settings for the HTML root element, concerning aspects like font, color scheme, and rendering optimizations.          |
| [setupTests.js](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/frontend/src/setupTests.js)             | The directory tree depicts a codebase for an AI fitness trainer application with two main parts: backend responsible for running the core logic, AI modeling and utils functions, and frontend which includes configuration files, source code, and test setups. The specific JavaScript file `setupTests.js` uses `jest-dom` library to add custom jest matchers, providing advanced assertions on DOM nodes in testing.                                                                                                             |
| [App.css](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/frontend/src/App.css)                         | The code provided designs a wave and pulse CSS animations. The wave animation is assigned to individual spans in the loading-animation classes with different start delays, creating an animated flow effect. The pulse animation causes elements in the audio-animation class to periodically scale up and down, generating a pulsing effect. The #root selector ensures the root element's content is centered. The file resides in the frontend part of an Ai Fitness Trainer program.                                             |

</details>

<details closed><summary>Components</summary>

| File                                                                                                                | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---                                                                                                                 | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| [Feedback.jsx](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/frontend/src/components/Feedback.jsx) | The code represents a Feedback component in a fitness web app. The component renders training statistics in a series of charts, leveraging Chart.js and react-chartjs-2 libraries. The statistics include exercise count, achievement rate, feedback count and an overall performance summary. The component updates charts based on user-specific data fetched from a backend server and information stored in the local storage. The handleRefresh function ensures the user can refresh the view manually. |
| [Footer.jsx](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/frontend/src/components/Footer.jsx)     | The code defines a React component for the footer of a web application. The footer is styled using Tailwind CSS and includes a grid navigation with an About us link, copyright information, and a visible Github link. Placeholder code suggests potential links for Contact, Jobs, Press Kit, and social media icons. This Footer component can be imported and used in other parts of the application to maintain a consistent site layout.                                                                |
| [Header.jsx](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/frontend/src/components/Header.jsx)     | This code is part of the frontend for an AI Fitness Trainer application. It defines the `Header` component, which displays a navigation bar containing the application's logo. This logo, when clicked, redirects users back to the homepage. The code also prepares for implementing a button labeled AI Fitness Trainer, which is currently commented out.                                                                                                                                                  |

</details>

<details closed><summary>Routes</summary>

| File                                                                                                            | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---                                                                                                             | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| [Home.jsx](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/frontend/src/routes/Home.jsx)         | The Home.jsx file, part of a larger AI fitness trainer application, creates the homepage of the web application. It includes an event handler for a button press, which navigates the user to an exercise test page when clicked. The JSX returned contains structured elements for the homepage, including an AI fitness trainer title, a start exercise button, and a footer.                                                                                                                                                                                                 |
| [TestPage.jsx](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/frontend/src/routes/TestPage.jsx) | The TestPage functional component in the React-based frontend of the AI fitness trainer application facilitates real-time, user-specific exercise feedback. It handles webcam feed broadcasting, exercising status management, and includes options for manually starting, submitting, and stopping exercises. Real-time analysis is achieved through WebSocket communication with the backend AI model. Feedback and suggestions are given auditorily and as text renderings. The component also allows restarting an exercise and managing user-specific exercise statistics. |

</details>

<details closed><summary>Backend</summary>

| File                                                                                      | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---                                                                                       | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| [main.py](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/backend/main.py) | The provided code handles a FastAPI server for an AI fitness application. It includes endpoints to receive and process exercise data, reset global data, retrieve statistics, and a WebSocket for real-time interaction. Condition check and counting functions for different exercises are mapped to an exercise_functions dictionary. It utilizes the YOLO model for pose recognition and pose visualization. The server handles data reception through WebSocket, processes frames for pose recognition, and provides statistics about the performance and frequency of different conditions during the exercises. |

</details>

<details closed><summary>Utils</summary>

| File                                                                                                                  | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---                                                                                                                   | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| [condition_check.py](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/backend/utils/condition_check.py) | The Python code provides various functions to assess the user's form during physical exercises such as burpees, push-ups, pull-ups, lunges and squats. The code utilizes numpy for operations like variance calculation and angle determination based on cosine law. Given spyder data of human body keypoints (like shoulder, elbow, etc.), it checks how well the exercise was executed, comparing current and past states, assessing angles, and distances in-between keypoints. It has functions to report error messages if the form isn't correct, and returns feedback for each exercise. |
| [countings.py](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/backend/utils/countings.py)             | The code implements functions to calculate distances and angles between given body keypoints and to count specific exercise reps including burpees, push-ups, side-lateral raises, pull-ups, cross-lunges and barbell squats. Each exercise function evaluates the position of relevant keypoints, and based on these positions, counts reps and sets flags when a correct form is detected. The countings.py script is presumably part of a larger AI-powered fitness trainer application.                                                                                                      |
| [yolo_model.py](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/backend/utils/yolo_model.py)           | The given code belongs to an AI fitness trainer application, specifically for the backend part. It uses the YOLO (a real-time object detection system) model to detect poses in a given image frame and visualizes these detected keypoints on the frame. It omits the visualization of eyes, nose, and ears, focusing on the rest of the body. The color scheme for visualization is predefined. The exception handling ensures the program doesn't crash if keypoints are missing.                                                                                                             |

</details>

---

## 🚀 Getting Started

***Dependencies***

Please ensure you have the following dependencies installed on your system:

`- ℹ️ Dependency 1`

`- ℹ️ Dependency 2`

`- ℹ️ ...`

### 🔧 Installation

1. Clone the ai_fitness_trainer_v3 repository:
```sh
git clone https://github.com/msai-cereal/ai_fitness_trainer_v3
```

2. Change to the project directory:
```sh
cd ai_fitness_trainer_v3
```

3. Install the dependencies:
```sh
npm install
```

### 🤖 Running ai_fitness_trainer_v3

```sh
node app.js
```

### 🧪 Tests
```sh
npm test
```

---


## 🛣 Project Roadmap

> - [X] `ℹ️  Task 1: Implement X`
> - [ ] `ℹ️  Task 2: Implement Y`
> - [ ] `ℹ️ ...`


---

## 🤝 Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Submit Pull Requests](https://github.com/msai-cereal/ai_fitness_trainer_v3/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.
- **[Join the Discussions](https://github.com/msai-cereal/ai_fitness_trainer_v3/discussions)**: Share your insights, provide feedback, or ask questions.
- **[Report Issues](https://github.com/msai-cereal/ai_fitness_trainer_v3/issues)**: Submit bugs found or log feature requests for MSAI-CEREAL.

#### *Contributing Guidelines*

<details closed>
<summary>Click to expand</summary>

1. **Fork the Repository**: Start by forking the project repository to your GitHub account.
2. **Clone Locally**: Clone the forked repository to your local machine using a Git client.
   ```sh
   git clone <your-forked-repo-url>
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear and concise message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to GitHub**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.

Once your PR is reviewed and approved, it will be merged into the main branch.

</details>

---

## 📄 License


This project is protected under the [SELECT-A-LICENSE](https://choosealicense.com/licenses) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.

---

## 👏 Acknowledgments

- AI Hub의 피트니스 데이터셋을 YOLOv8 모델 학습에 사용하였습니다.

[**Return**](#Top)


---

Made with ❤️ by Team Cereal
