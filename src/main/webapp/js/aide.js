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
            contenu += "Sur cette page, vous pouvez visualiser ( <span class='glyphicon glyphicon-list'></span> ), ajouter ( <span class='glyphicon glyphicon-plus-sign'></span> ) ou supprimer ( <span class='glyphicon glyphicon-trash'></span> ) une formation, un apprenant ou une compétence générale.<br/><br/>";
            contenu += "Vous pouvez également donner une note ( <span class='glyphicon glyphicon-pencil'></span> ) à un apprenant.";
            
            break;
            
        case "notation.html" :
            titre = "Notation";
            contenu += "Pour l'étudiant que vous avez choisi, la liste des compétences générales de sa formation s'affiche. En déroulant l'une d'entre elles, vous pourrez voir toutes ses compétences spécifiques, avec leur mise en situation et la règle utilisée pour la notation.<br/><br/>";
            contenu += "Pour donner une note à l'apprenant, il suffit de cliquer sur l'un des scores disponibles dans la colonne \"Score\".<br/> <br/>";
            contenu += "Si l'apprenant obtient une note dans toutes les compétences spécifiques d'une compétence générale, le graphique (radar ou histogramme) pourra être affiché ( <span class='glyphicon glyphicon-stats'></span> ).";
            
            break;
    }
    
    document.getElementById("titre_aide").innerHTML = titre;
    document.getElementById("contenu_aide").innerHTML = contenu;
}());