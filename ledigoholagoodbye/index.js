const { exec } = require("child_process");
const packageJson = require("./package.json");

function checkForUpdates() {
    const dependencies = packageJson.dependencies;
    let allUpToDate = true;

    Object.keys(dependencies).forEach(packageName => {
        exec(`npm show ${packageName} version`, (error, latestVersion) => {
            if (error) {
                console.error(`❌ Error al verificar la versión de ${packageName}:`, error);
                return;
            }

            latestVersion = latestVersion.trim();
            const installedVersion = dependencies[packageName].replace("^", "");

            if (installedVersion !== latestVersion) {
                console.log(`Nueva versión disponible de ${packageName}: ${latestVersion} (actualmente tienes ${installedVersion})`);
                console.log(`Para actualizar ${packageName}, ejecuta: npm update ${packageName}`);
                allUpToDate = false;
            }

            if (Object.keys(dependencies).indexOf(packageName) === Object.keys(dependencies).length - 1) {
                if (allUpToDate) {
                    console.log("✅ Todos los paquetes están actualizados");
                    setTimeout(() => {
                        require('./examples/script');
                        require('./examples/discord/iniciar');
                    }, 2000);
                }
            }
        });
    });
}

checkForUpdates();
