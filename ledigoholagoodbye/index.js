require('./examples/script');
require('./examples/discord/iniciar');

const { exec } = require("child_process");
const packageName = "haxball.js";

function checkForUpdates() {
    exec(`npm show ${packageName} version`, (error, latestVersion) => {
        if (error) {
            console.error("❌ Error al verificar la versión:", error);
            return;
        }

        latestVersion = latestVersion.trim();
        const installedVersion = require("./examples/node_modules/haxball.js/package.json").version;

        if (installedVersion !== latestVersion) {
            console.log(`🚀 Nueva versión disponible: ${latestVersion} (actualmente tienes ${installedVersion})`);
            console.log("Para actualizar, ejecuta: npm update haxball.js");
        } else {
            console.log("✅ Estás usando la última versión de haxball.js");
        }
    });
}

checkForUpdates();
