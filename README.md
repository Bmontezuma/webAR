# ***WebAR***

# ***How to Download and Install Node.js and npm***

Follow these steps to install Node.js and npm on your system.

---

## **Step 1: Download Node.js**
1. Visit the official [Node.js website](https://nodejs.org).
2. Download the **LTS (Long-Term Support)** version for stability.
3. Select the appropriate installer for your operating system:
   - **Windows**: `.msi`
   - **macOS**: `.pkg`
   - **Linux**: Follow the installation instructions for your distribution.

---

## **Step 2: Install Node.js**
1. Run the installer you downloaded.
2. Follow the installation steps:
   - Accept the license agreement.
   - Choose the installation location.
   - Ensure the option to install npm is selected (this is the default).
3. Complete the installation process.

---

## **Step 3: Verify the Installation**
1. Open your terminal or command prompt.
2. Check the installed version of Node.js:
   ```bash
   node -v

   
***Check the installed version of npm:***
```bash

npm -v
```

### ***Follow these steps:***

Open PowerShell as Administrator.
Run the following command to change the execution policy:
powershell
Copy code
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
When prompted, type Y and press Enter.
Close and reopen PowerShell, then verify npm with:
bash
Copy code
npm -v
Step 5: Update npm (Optional)
To ensure you have the latest version of npm:

bash
Copy code
npm install -g npm@latest
Step 6: Start Using npm
Now you can use npm to manage packages in your projects:

Initialize a new project:
bash
Copy code
npm init
Install a package:
bash
Copy code
npm install <package-name>
Uninstall a package:
bash
Copy code
npm uninstall <package-name>

