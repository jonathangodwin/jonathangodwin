const consoRegion = "donnees-conso-region";
const consoSect = "donnees-conso-sect";
var loaded = false; // Pour éviter d'appeler maintes fois main
var btn = document.querySelector('button');

btn.onclick = function() {
    if (!loaded){    
        main();
        loaded = true;
    } 
}



function main() {
    
    let lines = getLinesFromHTML(CSVcontent.split('\n'));  
    let years = selectUniqueValuesFromColumn([...lines], "Année");
    let operatorsUniques = selectUniqueValuesFromColumn(lines, "OPERATEUR");
    let fieldsUniques = selectUniqueValuesFromColumn(lines, "CODE GRAND SECTEUR");
    let regionsUniques = selectUniqueValuesFromColumn(lines, "Nom Région");
            
    //Création du select pour la consommation par Région
    createSelect(years, "conso-region", "", "Sélectionnez une année", chooseYear);
    
    //Création du select pour la consommation selon le secteur
    createSelect(years, "conso-sect", "", "Sélectionnez une année", chooseYear);
    
    //Création du select pour la consommation selon le secteur
    createSelect(operatorsUniques, "conso-elec", "operateur", "Choisissez un opérateur", getGlobalValueConsumption);
    
    //Création du select pour la consommation selon le secteur
    createSelect(fieldsUniques, "conso-elec", "sect", "Choisissez un Secteur", getGlobalValueConsumption);

    //Création du select pour la consommation selon la région
    createSelect(regionsUniques, "conso-elec", "region", "Choisissez une Région", getGlobalValueConsumption);    
     
    //Affichage des graphiques pour la consommation par Secteur et par Nom Région
    displayGlobalMean(lines);
    displayFieldsConsumption(lines, "");
    displayGlobalConsumptionFromValue(lines, "", "");
    displayRegionsConsumption(lines, "");  
    displayYearPerYearVarations(lines, "", "");
    console.log(regionsUniques);
    //drawMap();
}

//Retourne toutes les valeurs d'une colonne donnée
function selectValuesFromColumn(lines, columnName) {
    let colValues = [];
    //let csvCols = lines;
    let columns = getCsvValuesFromLine(CSVcontent.split('\n')[0]);
    if (columns.includes(columnName)){
      lines.map((currentCol) => {
        if(currentCol["FILIERE"] == "Electricité")
            colValues.push(currentCol[columnName]);});
    }
    
    return colValues;
  }
  
/**
 * 
 * @param {Array} lines lignes du fichier CSV étudié
 * @param {String} columnName nom de la colonne sur laquelle on filtre les valeurs prises une fois
 * @returns Retourne toutes les valeurs prises une fois d'une colonne donnée
 */
function selectUniqueValuesFromColumn(lines, columnName){
    let uniqueValues =  [];
    let columnContent = selectValuesFromColumn(lines, columnName);
    if (columnContent != [] ) {
          let uniqueValuesSet = new Set(columnContent);
          uniqueValues = [...uniqueValuesSet]; 
    }



  
    return uniqueValues;
  }
  
  //Filtre une colonne selon columnValue
  function filterFromValue(lines, columnName, columnValue){
    //let extractedLines = getLinesFromHTML(lines); 
    return [...lines.filter((e) => {return e[columnName] == columnValue
                                                    && e["FILIERE"] == "Electricité";})];
  }
  
/**
 * 
 * @param {Array} lines lignes du fichier CSV étudié
 * @param {String} colName nom de la colonne sur laquelle on affiche la consommation
 * @returns Retourne la consommation sur toute la période considérée
 */
function getConsumptionBy(lines, colName) {
    let consumptionLines = lines;
    // let consumptionLines = getLinesFromHTML(lines);
    let regionsConsumption = {};
    let electricity = "Electricité";
    let totalConsumptionName = "Conso totale (MWh)";
      
      consumptionLines.forEach((currentLine) => {
        let region = currentLine[colName];
          if (region !== undefined
            && !Object.keys(regionsConsumption).includes(region))
              regionsConsumption[region] = 0.0;
          if (!isNaN(parseFloat(currentLine[totalConsumptionName]))
              && currentLine["FILIERE"] == electricity)
              regionsConsumption[region] = regionsConsumption[region] + parseFloat(currentLine[totalConsumptionName]);
          });
  
    return regionsConsumption;
  }
  
/**
 * getConsumptionFromColumnByYear
 * @param {Array} fileLines lignes du fichier CSV
 * @param {String} colName  nom de la colonne sur laquelle on affiche la consommation par région
 * @param {String} year année à afficher sur le graphique
 * @returns Retourne la consommation d'éléctricité par région selon une année donnée
 */
function getConsumptionFromColumnByYear(fileLines, colName, year) {
      let consumptionLines = fileLines; //getLinesFromHTML(fileLines);
      let electricity = "Electricité";
      let regionsConsumption = Object();
      let totalConsumptionName = "Conso totale (MWh)";
      
    consumptionLines.forEach((currentLine) => {
        let region = currentLine[colName];
        if (!Object.keys(regionsConsumption).includes(region) 
          && region !== undefined){
              regionsConsumption[currentLine[colName]] = 0.0;
        } else if (Object.keys(regionsConsumption).includes(region)
                    && !isNaN(parseFloat(currentLine[totalConsumptionName]))
                    && currentLine["FILIERE"] == electricity
                    && currentLine["Année"] == year) {
                    
                    regionsConsumption[region] = regionsConsumption[region] +  parseFloat(currentLine[totalConsumptionName]);
        }	
    });
      
        return regionsConsumption;
  }
  

/**
 * Affiche avec Plotly la consommation par Region sous forme de camembert
 * @param {Array} fileLines lignes du fichier CSV
 * @param {string} year année à afficher sur le graphique
 */
function displayRegionsConsumption(fileLines, year) {
      let xArr = [];
      let yArr = [];
      let tit = "";
      let titleSection = document.getElementById("titre-region");
      let regionsData = {};
      if (year == ""){
          regionsData = getConsumptionBy(fileLines, "Nom Région");
          tit = "Consommation d'électricité par région sur la période 2011-2023 (MWh)";
      } else{ 
            regionsData = getConsumptionFromColumnByYear(fileLines, "Nom Région", year);
            tit = "Consommation d'électricité par région en " + year + " (MWh)";
      }
      
      if(Object.keys(regionsData).length != 0){
          for (const [key, value] of Object.entries(regionsData)) {
              xArr.push(key);
              yArr.push(value);
          }
          // On vérifie si les valeurs des ordonnées sont nulles pour s'épargner un affichage inutile
          if(!yArr.every((e) => {return e == 0;})){
            const data = [{
                labels: xArr,
                values: yArr,
                type: "pie"
            }];
            titleSection.textContent = tit;
            let layout = {title: tit};
            Plotly.react(consoRegion, data, layout);
        }
      }
  }
  
/**
 * Affiche avec Plotly la consommation par Secteur sous forme de bar chart
 * @param {Array} fileLines lignes du fichier CSV
 * @param {string} year année à afficher sur le graphique
 */
function displayFieldsConsumption(fileLines, year) {
      let xArr = [];
      let yArr = [];
      let tit = "";
      let regionsData = {};
      let titleSection = document.getElementById("titre-sect");
      if (year == ""){
          regionsData = getConsumptionBy(fileLines, "CODE GRAND SECTEUR");
          tit = "Consommation d'électricité par secteur sur la période 2011-2023 (MWh)";
      }
  
      else{ 
            regionsData = getConsumptionFromColumnByYear(fileLines, "CODE GRAND SECTEUR", year);
            tit = "Consommation d'électricité par secteur en " + year + " (MWh)";
      }
      
      if(Object.keys(regionsData).length != 0){
          for (const [key, value] of Object.entries(regionsData)) {
              xArr.push(key);
              yArr.push(value);
          }

          // On vérifie si les valeurs des ordonnées sont nulles pour s'épargner un affichage inutile
          if(!yArr.every((e) => {return e == 0;})){ 
            const data = [{
                x: xArr,
                y: yArr,
                type: "bar",
                orientation:"v"
                //marker: {color:"rgba(0,0,255)"}
            }];

            titleSection.textContent = tit;
            let layout = {title: tit};
            Plotly.react(consoSect, data, layout);
        }
      }
}

/**
 * 
 * @param {array} options liste des options du select à créer
 * @param {string} parentNodeId id du parent contenant le select à créer
 * @param {string} defaultValue textContent de la valeur par défaut du select
 * @param {s: void} eventListener Listener des différentes options pour changer le graphique
 */
function createSelect(options, parentNodeId, opt, defaultValue, eventListener){
    let select = document.createElement("select");
    let parentNode = document.getElementById(parentNodeId);
    let currentOption = document.createElement("option");
    if(opt == "")
      select.setAttribute("id", "select-" + parentNodeId);
    else 
      select.setAttribute("id", "select-" + opt + "-"+ parentNodeId);
    currentOption.setAttribute("value", "");
    currentOption.textContent = defaultValue;
    select.appendChild(currentOption);
    for (option of options){  
        currentOption = document.createElement("option");
        currentOption.setAttribute("value", option);
        currentOption.textContent = option;
        currentOption.addEventListener("click", eventListener);
        select.appendChild(currentOption);
    }
    
    if(options.length > 0) 
        parentNode.appendChild(select);
}

/**
 * Change le contenu du graphique et le met à l'année de correspondant à la valeur de event.target
 * @param {Event} event evènement 
 */
function chooseYear(event){
    let lines = getLinesFromHTML(CSVcontent.split('\n'));
    //let selectParent = event.target.parentNode.parentNode;
    let selectId = event.target.parentNode.getAttribute("id");
    let selectValue = document.getElementById(selectId).value;
    if (selectId == "select-conso-region"){
        displayRegionsConsumption(lines, selectValue);
    } else if(selectId == "select-conso-sect"){
        displayFieldsConsumption(lines, selectValue);
    }
}

/**
 * Met à jour l'affichage de la consommation globale en fonction de la sélection de l'utilisateur.
 * 
 * Cette fonction récupère les lignes de données du fichier CSV, identifie l'élément `<select>` 
 * déclencheur de l'événement et met à jour le graphique correspondant en fonction de la 
 * catégorie sélectionnée (opérateur, secteur ou région).
 * 
 * @param {Event} event - L'événement déclenché par l'interaction avec un élément `<select>`.
 * 
 * @returns {void}
 */
function getGlobalValueConsumption(event) {
  let lines = getLinesFromHTML(CSVcontent.split('\n'));
  let selectId = event.target.parentNode.getAttribute("id");
  let selectValue = document.getElementById(selectId).value;

  if (selectId === "select-operateur-conso-elec") {
      displayGlobalConsumptionFromValue(lines, "OPERATEUR", selectValue);
  } else if (selectId === "select-sect-conso-elec") {
      displayGlobalConsumptionFromValue(lines, "CODE GRAND SECTEUR", selectValue);
  } else if (selectId === "select-region-conso-elec") {
      displayGlobalConsumptionFromValue(lines, "Nom Région", selectValue);
  }
}


/**
 * Calcule la consommation totale d'électricité par année en fonction d'un critère donné.
 * 
 * Cette fonction filtre les données selon la colonne et la valeur spécifiées, puis agrège 
 * la consommation totale annuelle en MWh. Elle met également à jour le titre affiché 
 * en fonction du critère sélectionné.
 * 
 * @param {Object[]} lines - Tableau d'objets représentant les lignes du fichier CSV.
 * @param {string} columnName - Nom de la colonne utilisée pour filtrer les données (ex: "OPERATEUR", "Nom Région").
 * @param {string} columnValue - Valeur associée à `columnName` pour le filtrage.
 * 
 * @returns {Object} - Un objet contenant la consommation totale par année, sous forme de paires clé-valeur (année -> consommation en MWh).
 */
function getGlobalConsumptionFromValue(lines, columnName, columnValue) {
  let values = [];
  
  if (columnName === "" && columnValue === "") {
    values = lines;
  } else {
    values = filterFromValue(lines, columnName, columnValue);
  }

  let valuesPerYear = {};
  let title = "";
  let totalConsumptionName = "Conso totale (MWh)";

  values.forEach((value) => {
    if (!Object.keys(valuesPerYear).includes(value["Année"])) {
      valuesPerYear[value["Année"]] = 0.0;
    } else if (Object.keys(valuesPerYear).includes(value["Année"])) {
      if (!isNaN(parseFloat(value[totalConsumptionName]))) {
        valuesPerYear[value["Année"]] += parseFloat(value[totalConsumptionName]);
      }
    }
  });

  if (Object.keys(valuesPerYear).length > 0) {
    let titleElement = document.getElementById("titre-elec");
    
    if (columnName === "OPERATEUR") {
      title = "Consommation totale pour l'opérateur " + columnValue + " (MWh)";
    } else if (columnName === "Nom Région") {
      title = "Consommation totale pour la région " + columnValue + " (MWh)";
    } else if (columnName === "CODE GRAND SECTEUR") {
      title = "Consommation totale pour le secteur " + columnValue + " (MWh)";
    } else if (columnName === "" && columnValue === "") {
      title = "Consommation totale par année sur la période 2011-2023 (MWh)";
    }

    titleElement.textContent = title;
  }

  return valuesPerYear;
}

/**
 * Affiche la consommation d'électricité sous forme de graphique interactif.
 * 
 * Cette fonction récupère les données de consommation totale par année en fonction du critère spécifié,
 * puis les affiche sous forme de graphique à l'aide de la bibliothèque Plotly.
 * 
 * @param {Object[]} lines - Tableau d'objets représentant les lignes du fichier CSV.
 * @param {string} columnName - Nom de la colonne utilisée pour filtrer les données (ex: "OPERATEUR", "Nom Région").
 * @param {string} columnValue - Valeur associée à `columnName` pour le filtrage.
 */
function displayGlobalConsumptionFromValue(lines, columnName, columnValue) {
  let xArr = [];
  let yArr = [];
  let globalConsumptionData = getGlobalConsumptionFromValue(lines, columnName, columnValue);

  if (Object.keys(globalConsumptionData).length > 0) {
    for ([key, value] of Object.entries(globalConsumptionData)) {
      xArr.push(parseInt(key));
      yArr.push(value);
    }

    let data = [{ x: xArr, y: yArr, mode: "markers" }];
    let layout = { title: "Consommation sur la période 2011-2013 (MWh)" };

    Plotly.react("donnees-conso-elec", data, layout);
  }
}


/**
 * Affiche la variation de consommation d'électricité entre deux années spécifiées.
 * 
 * Cette fonction calcule la variation de la consommation d'électricité entre deux années
 * et affiche le résultat sous forme d'indicateur avec Plotly.
 * 
 * @param {Object[]} lines - Tableau contenant les données de consommation.
 * @param {string} y1 - Année de départ pour le calcul de variation.
 * @param {string} y2 - Année de fin pour le calcul de variation.
 */
function displayVariations(lines, y1, y2) {
  let consumptionPerYear = getConsumptionPerYear(lines);
  let variations;

  if (y1 == "" || y2 == "") {
    variations = variation(consumptionPerYear["2011"], consumptionPerYear["2023"]);
  }

  let data = [{
    type: "indicator",
    mode: "delta",
    value: variations,
    domain: { row: 1, column: 1 },
  }];
}


/**
 * Calcule et affiche la consommation d'électricité moyenne sur l'ensemble de la période 2011-2023.
 * 
 * La consommation est affichée sous forme d'indicateur numérique avec Plotly.
 * 
 * @param {Object[]} lines - Tableau contenant les données de consommation.
 */
function displayGlobalMean(lines) {
  let consumptionPerYear = getGlobalConsumptionFromValue(lines, "", "");
  console.log(consumptionPerYear);
  
  let globalMean = 0.0;
  Object.keys(consumptionPerYear).forEach((e) => globalMean += consumptionPerYear[e]);
  console.log(globalMean);

  let data = [
    {
      type: "indicator",
      mode: "number",
      value: globalMean,
      domain: { row: 0, column: 1 }
    }
  ];

  let layout = { 
    width: 400,
    height: 400
  };

  document.getElementById("titre-moyenne-generale").textContent = "Moyenne de consommation d'électricité sur la période 2011-2023 (MWh)";
  Plotly.react("donnees-moyenne-generale", data, layout);
}



/**
 * Récupère les années sélectionnées et affiche la variation de consommation correspondante.
 * 
 * Cette fonction récupère l'intervalle d'années sélectionné dans le menu déroulant et 
 * appelle `displayYearPerYearVarations` pour afficher la variation de consommation.
 * 
 * @param {Event} event - Événement déclenché par le changement de sélection.
 */
function getYearPerYearVaration(event) {
  let yearsVariations = document.getElementById("select-conso-variations").value.split('-');
  let lines = getLinesFromHTML(CSVcontent.split('\n'));
  displayYearPerYearVarations(lines, yearsVariations[0], yearsVariations[1]);
}


/**
 * Affiche les variations annuelles de la consommation d'électricité.
 * 
 * Cette fonction récupère les données de consommation annuelle et affiche l'évolution
 * entre les années sélectionnées à l'aide d'un indicateur Plotly.
 * 
 * @param {Object[]} lines - Tableau contenant les données de consommation.
 * @param {string} y1 - Année de départ pour la comparaison.
 * @param {string} y2 - Année de fin pour la comparaison.
 */
function displayYearPerYearVarations(lines, y1, y2) {
  let annualVarations = getGlobalConsumptionFromValue(lines, "", "");
  let annualVarationsKeys = Object.keys(annualVarations);
  let yearPerYear = [];

  for (let i = 0; i < annualVarationsKeys.length - 1; i++) {
    console.log(annualVarationsKeys[i], annualVarationsKeys[i + 1]);
    if (annualVarationsKeys[i + 1] !== "undefined") {
      yearPerYear.push(annualVarationsKeys[i] + "-" + annualVarationsKeys[i + 1]);
    }
  }

  if (y1 == "" && y2 == "") {
    document.getElementById("titre-variations").textContent = "Variations de la consommation d'électricité entre 2011 et 2023 (MWh)";
    y1 = parseFloat(annualVarations["2011"]);
    y2 = parseFloat(annualVarations["2023"]);
    createSelect(yearPerYear, "conso-variations", "", "Choisissez une année", getYearPerYearVaration);
  } else {
    document.getElementById("titre-variations").textContent = `Variations de la consommation d'électricité entre ${y1} et ${y2} (MWh)`;
    y1 = parseFloat(annualVarations[y1]);
    y2 = parseFloat(annualVarations[y2]);
  }

  let data = [
    {
      type: "indicator",
      mode: "number+gauge+delta",
      gauge: { shape: "bullet" },
      delta: { reference: y1 },
      value: y2,
      domain: { x: [0, 1], y: [0, 1] },
    }
  ];

  let layout = { width: 600, height: 250 };
  Plotly.react('donnees-conso-variations', data, layout);
  console.log(yearPerYear);
}
