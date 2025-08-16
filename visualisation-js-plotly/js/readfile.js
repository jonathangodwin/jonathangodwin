const sep = ';';

// Nom du fichier CSV à charger en dur - MODIFIEZ CE CHEMIN SELON VOTRE FICHIER
const CSV_FILE_PATH = '../jeu-de-donnees/consommation-annuelle-d-electricite-et-gaz-par-region.csv';

/* Renvoie sous forme d'une liste les valeurs contenues 
 dans une chaîne de caractère en utilisant le séparateur
 défini en constante.
Param :   line : String
return :  values : list of String 
*/
function getCsvValuesFromLine(line) {
	let values = line.split(sep);
	value = values.map(function(value){
		return value.replace(/\"/g, '');
	});
	return values;
}

/*Renvoie sous forme d'une liste d'Object 
 (voir doc : Object key-values)les informations
 contenues dans un fichier CSV passé sous la forme
 d'une liste de chaînes de caractères.
Param :   lines : list of String
return :  people : list of String 
*/
function getLinesFromHTML(lines){
  //on récupère la première ligne comme header et on la retire
  let headers = getCsvValuesFromLine(lines[0]);
  lines.shift();
  //On crée un tableau pour contenir les individus du dataset
  let people = [];
  for(let i=0; i<lines.length; i+=1){
	//chaque case est un Object rempli avec les paires clé/valeur
	people[i] = {};
	let lineValues = getCsvValuesFromLine(lines[i]);
	for (let j=0; j<lineValues.length; j+=1){
	  people[i][headers[j]] = lineValues[j];
	}
  }

  return people;
}

//variable globale pour le contenu (texte) du CSV
var CSVcontent;
var loaded = false; // Pour éviter d'appeler maintes fois main

// Fonction pour charger le fichier CSV en dur
async function loadHardcodedCSV() {
    try {
        const response = await fetch(CSV_FILE_PATH);
        
        if (!response.ok) {
            throw new Error(`Impossible de charger le fichier: ${CSV_FILE_PATH}`);
        }
        
        CSVcontent = await response.text();
        console.log('CSV chargé avec succès:', CSV_FILE_PATH);
        
        // Afficher un message de succès
        showLoadMessage('✓ Fichier chargé avec succès !', 'success');
        
        // Appeler la fonction main du fichier main.js après chargement
        if (!loaded && typeof main === 'function') {
            main();
            loaded = true;
        }
        
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        showLoadMessage('✗ Erreur: ' + error.message, 'error');
    }
}

// Fonction pour afficher les messages de statut
function showLoadMessage(message, type) {
    const loadDiv = document.getElementById('load');
    
    // Supprimer l'ancien message s'il existe
    const oldMessage = loadDiv.querySelector('.load-status');
    if (oldMessage) {
        oldMessage.remove();
    }
    
    // Créer le nouveau message
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('load-status');
    messageDiv.style.marginTop = '15px';
    messageDiv.style.padding = '10px';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.fontWeight = 'bold';
    
    if (type === 'success') {
        messageDiv.style.color = '#27ae60';
        messageDiv.style.backgroundColor = '#d5f4e6';
        messageDiv.style.border = '1px solid #27ae60';
    } else {
        messageDiv.style.color = '#e74c3c';
        messageDiv.style.backgroundColor = '#fadbd8';
        messageDiv.style.border = '1px solid #e74c3c';
    }
    
    messageDiv.textContent = message;
    loadDiv.appendChild(messageDiv);
}

// Associer la fonction au bouton Load quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    const loadButton = document.querySelector('#load button');
    if (loadButton) {
        // Remplacer l'événement onclick existant par le nouveau
        loadButton.onclick = function() {
            if (!loaded) {
                loadHardcodedCSV();
            } else {
                showLoadMessage('⚠ Données déjà chargées !', 'error');
            }
        }
    }
});

// Garder l'ancien système de file input en option
const fileInput = document.getElementById('csv');
const readFile = () => {
    const reader = new FileReader();
    reader.onload = () => {
        CSVcontent = reader.result;
        showLoadMessage('✓ Fichier local chargé avec succès !', 'success');
        
        // Appeler main après chargement du fichier local
        if (!loaded && typeof main === 'function') {
            main();
            loaded = true;
        }
    }
    reader.readAsText(fileInput.files[0]);
}

if (fileInput) {
    fileInput.addEventListener('change', readFile);
}