// "use strict";
var couleurCaseSelectionnee = null; // Couleur de la case sélectionnée de la grille avant changement 
var couleurBoutonCourant = null; // Couleur en cours de sélection de la palette de couleurs
var coups = 0; // Nombre de coups joués
var nombreLimiteCoups = 0; // Limite de coups si le mode de jeu est défi
var estFinie = false; // Vérifie si la partie est finie

main();

function main(){
    let form = document.getElementById("initJeu");
    form.addEventListener("submit", initialiserPartie);
}

//Initialisation d'une partie après soumission du form "initJeu"
function initialiserPartie(event){
    event.preventDefault();
    estFinie = false;
    couleurBoutonCourant = null;
    coups = 0;
    let tailleGrille = parseInt(document.getElementById("tailleGrille").value);
    let nombreCouleurs = parseInt(document.getElementById("nbCouleurs").value);    
    let messageErreur = document.getElementById("message-erreur");
    let modeJeu = document.getElementById("mode-jeu").value;

    // Réinitialiser le message d'erreur
    messageErreur.style.display = "none";
    messageErreur.classList.remove("show");

    if (!isNaN(tailleGrille) && !isNaN(nombreCouleurs)){
        if (nombreCouleurs <= 1 || tailleGrille < 2 
            || tailleGrille*tailleGrille < nombreCouleurs){
                messageErreur.style.display = "block";
                messageErreur.classList.add("show");
                messageErreur.textContent = "Les données ne conviennent pas du tout ! Vérifiez la taille de la grille et le nombre de couleurs.";
        } else {
            if (modeJeu == "defi"){
                // Définit le nombre de coups dans le cas où le mode est défi
                nombreLimiteCoups = 2 * tailleGrille;
                let limiteCoups = document.getElementById("limite-coups");
                limiteCoups.textContent = nombreLimiteCoups;
            } else {
                let limiteCoups = document.getElementById("limite-coups");
                limiteCoups.textContent = "∞";
            }

            // Masquer le formulaire et afficher le jeu
            document.querySelector(".game-setup").style.display = "none";
            document.getElementById("jeu").style.display = "block";
            document.getElementById("jeu").classList.add("active");

            genererGrille(tailleGrille, nombreCouleurs);
        }

    } else if (isNaN(tailleGrille) && isNaN(nombreCouleurs)){
        messageErreur.style.display = "block";
        messageErreur.classList.add("show");
        messageErreur.textContent = "La taille de la grille et le nombre de couleurs doivent être des nombres !";
    } else if (isNaN(tailleGrille)) {
        messageErreur.style.display = "block";
        messageErreur.classList.add("show");
        messageErreur.textContent = "La taille de la grille doit être un nombre !";
    } else if (isNaN(nombreCouleurs)) {
        messageErreur.style.display = "block";
        messageErreur.classList.add("show");
        messageErreur.textContent = "Le nombre de couleurs doit être un nombre !";
    }
}

// Générateur aléatoire de couleurs
function genererCouleur() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return "rgb(" + r + ", " + g + ", " + b + ")";
}

// Génère la liste de couleurs de taille nombreCouleurs
function genererListeCouleurs(nombreCouleurs){
    let listeCouleurs = [];
    for(let i = 0; i < nombreCouleurs; i++)
        listeCouleurs.push(genererCouleur());

    return listeCouleurs;
}

/*Affichage de la palette de couleurs générée aléatoirement 
 * A partir de la liste de couleurs générée par le nombre de couleurs générées 
 * avec nombreCouleurs
 */
function afficherPaletteCouleurs(listeCouleurs){
    let palette = document.getElementById("palette");
    if (palette.children.length > 0){
        while(palette.firstChild)
            palette.firstChild.remove();
    }
    for(let i = 0; i < listeCouleurs.length; i++){
        let couleurEnCours = document.createElement("button");
        couleurEnCours.setAttribute("class", "couleur");
        couleurEnCours.addEventListener("click", selectionCouleur);
        couleurEnCours.style.backgroundColor = listeCouleurs[i];
        palette.appendChild(couleurEnCours);
    }
}

/**
 * Génère une grille de taille tailleGrille*tailleGrille
 * Et avec une liste aléatoire de couleurs de taille nombreCouleurs
 */
function genererGrille(tailleGrille, nombreCouleurs) {
    // Grille qui va contenir tailleGrille * tailleGrille elements
    let pixelGrid = document.getElementById("grid");
    let listeCouleurs = genererListeCouleurs(nombreCouleurs);

    // Configurer la grille CSS
    pixelGrid.style.gridTemplateColumns = `repeat(${tailleGrille}, 1fr)`;
    pixelGrid.style.gridTemplateRows = `repeat(${tailleGrille}, 1fr)`;
    
    //Vide la grille au cas où elle contient des noeuds
    if (pixelGrid.children.length > 0){
        while(pixelGrid.firstChild)
            pixelGrid.firstChild.remove();
    }
    
    afficherPaletteCouleurs(listeCouleurs);
    
    for(let i = 0; i < tailleGrille; i++){
        for(let j = 0; j < tailleGrille; j++){
            //Creation de chacune des cases de la grille
            let currentCol = document.createElement("div");
            currentCol.setAttribute("cell", "" + i + "-" + j);
            currentCol.setAttribute("class", "col");
            currentCol.addEventListener("click", sauvegarderCouleur);
            currentCol.addEventListener("click", affecterCouleur);
            currentCol.addEventListener("click", colorierVoisinage);
            colorierCase(currentCol, listeCouleurs);
            pixelGrid.appendChild(currentCol);
        }
    }

    // Réinitialiser les compteurs affichés
    document.getElementById("coupsJoues").textContent = "0";
}

//Coloriage d'une case
function colorierCase(caseGrille, listeCouleurs){
    let nombreCouleurs = listeCouleurs.length;
    let positionCouleur = Math.floor(Math.random() * (nombreCouleurs));
    let couleur = listeCouleurs[positionCouleur];
    caseGrille.style.backgroundColor = couleur;
}

//Selection d'une couleur sur la palette et l'affecte à la variable globale couleurBoutonCourant
function selectionCouleur(event) {
    let boutonCourant = document.getElementById("couleur-courante");
    couleurBoutonCourant = event.target.style.backgroundColor;
    boutonCourant.style.display = "block";
    boutonCourant.style.backgroundColor = couleurBoutonCourant;
    
    // Ajouter un effet visuel pour montrer la sélection
    document.querySelectorAll(".couleur").forEach(btn => btn.classList.remove("selected"));
    event.target.classList.add("selected");
}

// Affecte couleurBoutonCourant à la case qui appelle cette fonction
function affecterCouleur(event) {
    if(couleurBoutonCourant != null && !estFinie){
        event.target.style.backgroundColor = couleurBoutonCourant;
    }
}

// Permet d'enregistrer la couleur au moment de l'appel de la fonction dans couleurCaseSelectionnee
// Avant de changer la couleur 
function sauvegarderCouleur(event){
    couleurCaseSelectionnee = event.target.style.backgroundColor;
}

// Determiner les voisins de l'element passé en paramètres
function obtenirVoisinage(element) {
    let voisins = [];
    //A partir de l'attribut cell, on récupère cell qui contient les coordonnées de l'element dans la grille
    let [i, j] = element.getAttribute("cell").split("-").map(Number);
    let directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    
    // Et là, on recherche les voisins 
    directions.forEach(([di, dj]) => {
        let voisin = document.querySelector(`[cell='${i + di}-${j + dj}']`);
        if (voisin) {
            voisins.push(voisin);
        }
    });

    return voisins;
}

//Fonction de coloriage du voisinage de l element event.target
function colorierVoisinage(event) {
    let message = "";
    let nombreCoupsJoues = document.getElementById("coupsJoues");
    
    if (event.target.style.backgroundColor != couleurCaseSelectionnee){ 
        let voisins = obtenirVoisinage(event.target);
        colorierVoisinageAux(event.target, voisins);
        coups++;
    }
    
    nombreCoupsJoues.textContent = coups;
    let estRemplie = grilleEstRemplie();
    let modeJeu = document.getElementById("mode-jeu").value;
    
    if (modeJeu == "defi") {
        if(coups > nombreLimiteCoups && !estRemplie){
            estFinie = true;
            message = "Oups ! Vous avez perdu ! Vous avez dépassé la limite de " + nombreLimiteCoups + " coups.";
        } 
    } 

    if (estRemplie) { 
        message = "🎉 Félicitations ! Vous avez gagné la partie en " + coups + " coups !";
        estFinie = true;
    }

    if (estFinie){
        setTimeout(() => {
            alert(message);
            // Proposer de rejouer
            if (confirm("Voulez-vous rejouer ?")) {
                location.reload();
            }
        }, 100);
    }
}

//Fonction auxiliaire appelée pour colorier les cases adjacentes et leurs adjacents
function colorierVoisinageAux(element, voisins){
    if (voisins.length > 0){
        voisins.forEach(voisin => {
            if (voisin.style.backgroundColor == couleurCaseSelectionnee){
                voisin.style.backgroundColor = element.style.backgroundColor;
                let mesVoisins = obtenirVoisinage(voisin);
                colorierVoisinageAux(voisin, mesVoisins);
            } 
        });
    }
}

//Vérifie si la grille est remplie
function grilleEstRemplie(){
    let cols = document.getElementsByClassName("col");
    let couleur = null;
    let estRemplie = true;
    let i = 1;
    if (cols.length > 0){
        couleur = cols[0].style.backgroundColor;
        while(i < cols.length && estRemplie){
            if (cols[i].style.backgroundColor != couleur)
                estRemplie = false;
            i++;
        }
    }

    return estRemplie;
}