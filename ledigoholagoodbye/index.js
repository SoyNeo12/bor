const { exec } = require("child_process");
const packageJson = require("./package.json");

function checkForUpdates() {
    const dependencies = packageJson.dependencies;
    let allUpToDate = true;

    console.log("Verificando versiones de los paquetes...");
    showProgress(0, Object.keys(dependencies).length);

    checkDependencies(dependencies, () => {
        if (allUpToDate) {
            console.log("\nTodos los paquetes están actualizados, iniciando los scripts...");
            simulateProgress(() => {
                require('./examples/script');
                require('./examples/discord/iniciar');
            });
        }
    });
}

function checkDependencies(dependencies, callback) {
    let pending = Object.keys(dependencies).length;
    let completed = 0;

    Object.keys(dependencies).forEach((packageName) => {
        exec(`npm show ${packageName} version`, (error, latestVersion) => {
            if (error) {
                console.error(`Error al verificar la versión de ${packageName}:`, error);
                process.exit(1);
            }

            latestVersion = latestVersion.trim();
            const installedVersion = dependencies[packageName].replace("^", "");

            if (installedVersion !== latestVersion) {
                console.log(`Nueva versión disponible de ${packageName}: ${latestVersion} (actualmente tienes ${installedVersion})`);
                console.log(`Para actualizar ${packageName}, ejecuta: npm update ${packageName}`);
                allUpToDate = false;
                process.exit(1);
            }

            completed++;
            showProgress(completed, Object.keys(dependencies).length);

            if (--pending === 0) {
                callback();
            }
        });
    });
}

function showProgress(completed, total) {
    const percentage = Math.round((completed / total) * 100);
    const progressBar = "█".repeat(Math.max(0, Math.floor(percentage / 10))) + "▒".repeat(Math.max(0, 10 - Math.floor(percentage / 10)));
    process.stdout.write(`\r${progressBar} ${percentage}%`);
}

function simulateProgress(callback) {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        showProgress(progress, 100);
        if (progress >= 100) {
            clearInterval(interval);
            callback();
        }
    }, 400);
}

checkForUpdates();
