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
            contenu += "<p align='justify'>Pour commencer, sélectionnez une des formations dont vous êtes responsable. La liste des apprenants suivant cette formation, et la liste des compétences générales apparaîtront alors.<br/><br/>";
            contenu += "Sur cette page, vous pouvez visualiser ( <span class='fa fa-list'></span> ), ajouter ( <span class='fa fa-plus-circle'></span> ) ou supprimer ( <span class='glyphicon glyphicon-trash'></span> ) une formation, un apprenant ou une compétence générale.<br/><br/>";
            contenu += "Vous pouvez également donner une note ( <span class='fa fa-pencil'></span> ) à un apprenant, ou à tous les apprenants pour une certaine compétence générale.</p>";
            
            break;
            
        case "notation_apprenant.html" :
            titre = "Notation";
            contenu += "<p align='justify'>Pour l'étudiant que vous avez choisi, la liste des compétences générales de sa formation s'affiche. En déroulant l'une d'entre elles, vous pourrez voir toutes ses compétences spécifiques, avec leur mise en situation et la règle utilisée pour la notation.<br/><br/>";
            contenu += "Pour donner une note à l'apprenant, il suffit de cliquer sur l'un des scores disponibles dans la colonne <b>Score</b>.<br/> <br/>";
            contenu += "Si l'apprenant obtient une note dans toutes les compétences spécifiques d'une compétence générale, le graphique (radar ou histogramme) pourra être affiché ( <span class='fa fa-bar-chart'></span> ). Un icône indiquera également si la compétence est acquise ( <span class='fa fa-check-circle-o' style='color: #00FF00;'></span> ), en cours d'acquisition ( <span class='fa fa-clock-o'></span> ) ou non-acquise ( <span class='fa fa-times-circle-o' style='color: #FF0000;'></span> ).<br/><br/>";
            contenu += "Chaque compétence spécifique peut également être visualisée et modifiée ( <span class='fa fa-list'></span> ).</p>";
            
            break;
            
        case "competence_specifique.html" :
            titre = "Compétence spécifique";
            contenu += "<p align='justify'>Sur cette page, vous pouvez créer ou modifier une compétence spécifique.<br/><br/>";
            contenu += "Les compétences spécifiques se basent sur le <a href='https://fr.wikipedia.org/wiki/Taxonomie_de_Bloom' target='_blank'>modèle de Bloom</a>. Il se décompose en 6 familles de compétences : Connaissance, Compréhension, Application, Analyse, Synthèse, et Évaluation. Pour chacune de ces catégories, une liste de verbes typiquement significatifs est associée. Ces verbes doivent être à l'origine du libellé de la compétence.<br/><br/></p>";
            
            contenu += "<div class='container-fluid' style='padding:0px'><div class='col-sm-6'><h4>Informations principales</h4>";
            contenu += "<p align='justify'>La première partie de la page vous montre les informations principales de la compétence (libellé, type, etc.). Le libellé se compose d'un verbe (correspondant au type que vous avez choisi) et d'un complément. Les sélecteurs de genre correspondent au complément du libellé (par exemple, pour le libellé \"Définir les caractéristiques d'un projet\", ils doivent être positionnés sur <b>Féminin</b> et <b>Pluriel</b>.<br><br/>";
            contenu += "La pondération correspond à l'importance de la compétence par rapport aux autres compétences spécifiques d'une même compétence générale Sa modification influera sur les autres compétences spécifiques Pour avoir un visuel de l'importance de chaque compétence, il vaut mieux faire cette modification depuis la page de la compétence générale associée.<br/><br/></p></div>";
            
            contenu += "<div class='col-sm-6'><h4>Mise en situation et règle appliquée</h4>";
            contenu += "<p align='justify'>Sur la deuxième partie de la page, vous pouvez tout d'abord voir la mise en situation. Cette dernière se décompose en 3 parties : le contexte (une description de la situation dans laquelle l'apprenant se trouve), les ressources dont il dispose, et l'action qu'il doit effectuer.<br/>";
            contenu += "Cette action s'inspire du libellé de la compétence, et est mise à jour à chaque changement dans le libellé. Elle peut être complétée pour décrire plus précisément ce que l'apprenant doit faire.<br/><br/>";
            contenu += "Le contenu de la règle appliquée à la compétence s'inspire directement du libellé. Suivant Le genre du complément du libellé, différents modèles de règles seront proposés : le modèle exlusif (Soit une condition est validée, soit elle ne l'est pas), progressif (comme son nom l'indique, il permet d'ajouter plus de conditions), et le modèle libre (champ de saisie libre). Si le modèle de règle inclut des nombres à compléter, cela pourra être fait avec des pourcentages ou par simple comptage (avec le sélecteur associé).<br/><br/>";
            contenu += "Par ailleurs, il est possible d'ajuster le contenu de la règle avec le slider de ce type :";
            contenu += "</p><br/>";
            contenu += "<div class='slider shor'id='slider_aide'></div>";
            contenu += "<p align='justify'>Ce sélecteur permet de choir les mots à inclure dans le contenu de la règle.</p>";
            contenu += "</div></div>";
            
            break;
    }
    
    document.getElementById("titre_aide").innerHTML = titre;
    document.getElementById("contenu_aide").innerHTML = contenu;
    
    switch (url)
    {
        case "competence_specifique.html" :
            var slider = document.getElementById("slider_aide");
            noUiSlider.create(slider, {
                start: 20,
                connect: "lower",
                range: {
                    'min': 0,
                    20: 20,
                    40: 40,
                    60: 60,
                    80: 80,
                    'max': 100
                },
                snap: true
            });
            
            break;
    }
}());