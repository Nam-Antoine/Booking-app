# 1. Development Mode: <br/>
  Navigate to your project directory:<br/> Open your terminal or command prompt and use the cd command to navigate to the root directory of your Next.js project.  
  Code:
  ```
    cd your-nextjs-app
  ```
  Start the development server: Run the following command:
  Code:
  ```
    npm run dev
    #or if you using yarn
    yarn dev
  ```
  This command starts a development server, typically on http://localhost:3000, with features like hot module replacement (HMR), allowing you to see changes in real-time as you modify your code.  
  Then you hold ctrl + click on the link in the cmd or powershell (Ex: http://localhost:3000 or http://localhost:3001) -->The website will automatically open on the web browser.

# 2. Production Mode:
- Build the application: Before running in production, you need to build your Next.js application for optimized performance.
Code:
```
  npm run build
  # or if using Yarn
  yarn build
```
This command creates an optimized production build in the .next directory.  
- Start the production server: After building, you can start the production server:
Code:
```
  npm run start
  # or if using Yarn
  yarn start
```
This command serves the pre-built production version of your Next.js application.
