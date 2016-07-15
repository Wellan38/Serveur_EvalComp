var url_array = window.location.href.split("?")[0].split("/");
var url = url_array[url_array.length - 1];

(function()
{
    
    var titre = "";
    var contenu = "";
    
    switch(url)
    {
        case "index.html" :
            titre = "Page d'accueil";
            contenu += "Pour commencer, sélectionnez une des formations dont vous êtes responsable. La liste des apprenants suivant cette formation, et la liste des compétences générales apparaîtront alors.<br/><br/>";
            contenu += "Sur cette page, vous pouvez visualiser ( <span class='fa fa-list'></span> ), ajouter ( <span class='fa fa-plus-circle'></span> ) ou supprimer ( <span class='glyphicon glyphicon-trash'></span> ) une formation, un apprenant ou une compétence générale.<br/><br/>";
            contenu += "Vous pouvez également donner une note ( <span class='fa fa-pencil'></span> ) à un apprenant.";
            
            break;
            
        case "notation.html" :
            titre = "Notation";
            contenu += "Pour l'étudiant que vous avez choisi, la liste des compétences générales de sa formation s'affiche. En déroulant l'une d'entre elles, vous pourrez voir toutes ses compétences spécifiques, avec leur mise en situation et la règle utilisée pour la notation.<br/><br/>";
            contenu += "Pour donner une note à l'apprenant, il suffit de cliquer sur l'un des scores disponibles dans la colonne \"Score\".<br/> <br/>";
            contenu += "Si l'apprenant obtient une note dans toutes les compétences spécifiques d'une compétence générale, le graphique (radar ou histogramme) pourra être affiché ( <span class='fa fa-bar-chart'></span> ).<br/><br/>";
            contenu += "Chaque compétence spécifique peut également être visualisée et modifiée ( <span class='fa fa-list'></span> ).";
            
            break;
            
        case "competence_specifique.html" :
            titre = "Compétence spécifique";
            contenu += "<p align='justify'>Sur cette page, vous pouvez créer ou modifier une compétence spécifique.<br/><br/>";
            contenu += "Les compétences spécifiques se basent sur le <a href='https://fr.wikipedia.org/wiki/Taxonomie_de_Bloom' target='_blank'>modèle de Bloom</a>. Il se décompose en 6 familles de compétences : Connaissance, Compréhension, Application, Analyse, Synthèse, et Évaluation. Pour chacune de ces catégories, une liste de verbes typiquement significatifs est associée. Ces verbes doivent être à l'origine du libellé de la compétence.<br/><br/></p>";
            
            contenu += "<div class='container-fluid' style='padding:0px'><div class='col-sm-6'><h4>Partie gauche de la page</h4>";
            contenu += "<p align='justify'>La partie gauche de la page vous montre les informations principales de la compétence (libellé, type, etc.). La création du libellé est facilitée par un nuage de tags, adapté au type de compétence que vous avez choisi, et que vous pouvez faire apparaître en cliquant sur l'icône <span class='fa fa-tags'></span> . Lorsque vous cliquez sur l'un des tags, celui-ci remplacera le premier mot du libellé de la compétence.<br><br/>";
            contenu += "Une règle de notation doit s'appliquer à la compétence spécifique. Pour vous aider à créer cette règle, il existe trois modèles de règles prédéfinis (exlusif, par comptage, et progressif), que vous pouvez préciser en ajoutant des paramètres.<br/><br/>";
            contenu += "Par ailleurs, une compétence spécifique comprend une mise en situation, qui est décrite par une liste d'actions à réaliser par l'apprenant pour être évalué dans la compétence.</p></div>";
            
            contenu += "<div class='col-sm-6'><h4>Partie droite de la page</h4>";
            contenu += "<p align='justify'>Sur la partie droite de la page, vous pouvez voir la liste de toutes les compétences spécifiques représentant la même compétence générale. Cela permet d'avoir un ordre d'idée de leur poids au sein de la compétence générale.<br/><br/>";
            contenu += "Vous pouvez ajuster la pondération de la compétence spécifique avec les boutons <span class='fa fa-plus-circle'></span> et <span class='fa fa-minus-circle'></span>, mais aussi avec le sélecteur sur la partie gauche de la page, tout en voyant directement les changements par rapport aux autres compétences spécifiques.";
            contenu += "</p></div></div>";
            
            break;
    }
    
    document.getElementById("titre_aide").innerHTML = titre;
    document.getElementById("contenu_aide").innerHTML = contenu;
}());