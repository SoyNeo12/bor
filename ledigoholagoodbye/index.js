const { exec } = require("child_process");
const packageJson = require("./package.json");

let allUpToDate = true;

function checkForUpdates() {
    const dependencies = packageJson.dependencies;

    console.log("\n🔍 Verificando versiones de los paquetes...");
    showProgress(0, Object.keys(dependencies).length);

    checkDependencies(dependencies, () => {
        if (allUpToDate) {
            console.log("\nTodos los paquetes están actualizados. Iniciando scripts...");
            require('./examples/script');
        } else {
            console.log("\nActualizando paquetes desactualizados...");
            showProgress(0, 100);
            simulateProgress(() => {
                updateOutdatedPackages(() => {
                    console.log("\nPaquetes actualizados correctamente. Iniciando scripts...");
                    require('./examples/script');
                });
            });
        }
    });
}

function checkDependencies(dependencies, callback) {
    let pending = Object.keys(dependencies).length;
    let completed = 0;

    Object.keys(dependencies).forEach((packageName) => {
        exec(`npm show ${packageName} version`, (error, latestVersion) => {
            if (error) return;
            latestVersion = latestVersion.trim();
            const installedVersion = dependencies[packageName].replace("^", "");

            if (installedVersion !== latestVersion) {
                allUpToDate = false;
            }

            completed++;
            showProgress(completed, Object.keys(dependencies).length);

            if (--pending === 0) callback();
        });
    });
}

function updateOutdatedPackages(callback) {
    let updated = 0;
    const dependencies = packageJson.dependencies;
    Object.keys(dependencies).forEach((packageName) => {
        exec(`npm install ${packageName}@latest --save`, (error) => {
            if (error) console.error(`Error al actualizar ${packageName}`);
            updated++;

            if (updated === Object.keys(dependencies).length) {
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
