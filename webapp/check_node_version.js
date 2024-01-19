const execSync = require('child_process').execSync;

// Wymagana wersja Node.js
const requiredVersion = 'v20.10.0';

// Funkcja do sprawdzania wersji Node.js
function checkNodeVersion() {
    try {
        // Pobieranie zainstalowanej wersji Node.js
        const installedVersion = execSync('node -v').toString().trim();

        // Porównanie wersji
        if (installedVersion !== requiredVersion) {
            console.error(`Error: required version of Node.js: ${requiredVersion}, but currently installed: ${installedVersion}.`);
            process.exit(1);
        } else {
            console.log(`Node.js version correct: ${installedVersion}`);
        }
    } catch (error) {
        console.error('Error: cannot get Node.js version:', error);
        process.exit(1);
    }
}

checkNodeVersion();