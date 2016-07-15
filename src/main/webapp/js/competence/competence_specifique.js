/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var param = window.location.search.substring(1).split("&");
var mode = param[0].split("=")[1];
var codeG = param[1].split("=")[1];
var codeS = null;
var anciennePond = 0;
var compS;

(function() {
    document.getElementById("valider").setAttribute("id", "valider_" + codeG + "_");
    document.getElementById("autres_comp").setAttribute("id", "comp_spec__" + codeG + "_");
    init();
}());

function init()
{
    if (mode === "modification")
    {
        codeS = param[2].split("=")[1];
        document.getElementById("valider_" + codeG + "_").innerHTML = '<span class="glyphicon glyphicon-check"></span> Valider les modifications';
        document.getElementById("annuler").innerHTML = '<span class="glyphicon glyphicon-remove"></span> Annuler les modifications';
        detailsCompS();
        detailsCompG();
    }
    else if (mode === "creation")
    {
        document.getElementById("code_comp").disabled = false;
        document.getElementById("valider_" + codeG + "_").innerHTML = '<span class="glyphicon glyphicon-check"></span> Créer la compétence';
        document.getElementById("annuler").innerHTML = '<span class="glyphicon glyphicon-remove"></span> Revenir aux compétences générales';
        detailsCompG();
        listerRegles();
        
        competences[0].compSpec.push(JSON.parse('{"code":null,"libelle":"","ponderation":0,"categorie":""}'));
        
        changerPonderation(0.2);
        
        afficherCompS(codeG, competences[0].compSpec, null);
    }
}

function detailsCompG()
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'infos',
            type: 'competence_generale',
            code: codeG
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        var c = data.obj;
        competences.push(c);
        if (mode !== "creation")
        {
            afficherCompS(codeG, c.compSpec, codeS);
        }
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

var param = window.location.search.substring(1).split("&");
var code_comp = param[0].split("=")[1];
var code_regle;
var liste_regles;

function placerTag(tag)
{
    var value = document.getElementById("libelle_comp").value;
    
    var value_tab = value.substring(0).split(" ");
    value = tag + " ";
    
    for (var i = 1; i < value_tab.length; i++)
    {
        value += value_tab[i];
        if (i !== value_tab.length - 1)
        {
            value += " ";
        }
    }
    
    document.getElementById("libelle_comp").value = value;
    
    $('#myModal').modal('hide');
}

function listerTags()
{
    var categorie = document.getElementById("categorie_comp").value;
    var tags;
    switch(categorie)
    {
        case "Connaissance" :
            tags = [
                {text: "Définir", weight: 7, html: {onclick: "placerTag(\"Définir\")", style: "cursor: pointer"}},
                {text: "Lister", weight: 6, html: {onclick: "placerTag(\"Lister\")", style: "cursor: pointer"}},
                {text: "Nommer", weight: 5, html: {onclick: "placerTag(\"Nommer\")", style: "cursor: pointer"}},
                {text: "Identifier", weight: 4, html: {onclick: "placerTag(\"Identifier\")", style: "cursor: pointer"}}
            ];

            break;
            
        case "Compréhension" :
            tags = [
                {text: "Classifier", weight: 7, html: {onclick: "placerTag(\"Classifier\")", style: "cursor: pointer"}},
                {text: "Décrire", weight: 6, html: {onclick: "placerTag(\"Décrire\")", style: "cursor: pointer"}},
                {text: "Expliquer", weight: 5, html: {onclick: "placerTag(\"Expliquer\")", style: "cursor: pointer"}},
                {text: "Reformuler", weight: 4, html: {onclick: "placerTag(\"Reformuler\")", style: "cursor: pointer"}}
            ];
            
            break;
            
        case "Application" :
            tags = [
                {text: "Appliquer", weight: 7, html: {onclick: "placerTag(\"Appliquer\")", style: "cursor: pointer"}},
                {text: "Utiliser", weight: 6, html: {onclick: "placerTag(\"Utiliser\")", style: "cursor: pointer"}},
                {text: "Employer", weight: 5, html: {onclick: "placerTag(\"Employer\")", style: "cursor: pointer"}},
                {text: "Résoudre", weight: 4, html: {onclick: "placerTag(\"Résoudre\")", style: "cursor: pointer"}}
            ];
            
            break;
            
        case "Analyse" :
            tags = [
                {text: "Analyser", weight: 7, html: {onclick: "placerTag(\"Analyser\")", style: "cursor: pointer"}},
                {text: "Estimer", weight: 6, html: {onclick: "placerTag(\"Estimer\")", style: "cursor: pointer"}},
                {text: "Comparer", weight: 5, html: {onclick: "placerTag(\"Comparer\")", style: "cursor: pointer"}},
                {text: "Différencier", weight: 4, html: {onclick: "placerTag(\"Différencier\")", style: "cursor: pointer"}}
            ];
            
            break;
            
        case "Synthèse" :
            tags = [
                {text: "Concevoir", weight: 7, html: {onclick: "placerTag(\"Concevoir\")", style: "cursor: pointer"}},
                {text: "Développer", weight: 6, html: {onclick: "placerTag(\"Développer\")", style: "cursor: pointer"}},
                {text: "Planifier", weight: 5, html: {onclick: "placerTag(\"Planifier\")", style: "cursor: pointer"}},
                {text: "Proposer", weight: 4, html: {onclick: "placerTag(\"Proposer\")", style: "cursor: pointer"}}
            ];
            
            break;
            
        case "Évaluation" :
            tags = [
                {text: "Évaluer", weight: 7, html: {onclick: "placerTag(\"Évaluer\")", style: "cursor: pointer"}},
                {text: "Comparer", weight: 6, html: {onclick: "placerTag(\"Comparer\")", style: "cursor: pointer"}},
                {text: "Chiffrer", weight: 5, html: {onclick: "placerTag(\"Chiffrer\")", style: "cursor: pointer"}},
                {text: "Juger", weight: 4, html: {onclick: "placerTag(\"Juger\")", style: "cursor: pointer"}}
            ];
            
            break;
            
        default:
            tags = [];
            
            break;
    }

    $("#tags_cloud").empty();
    $("#tags_cloud").jQCloud(tags, {width: 200, height: 200, delayedMode: true, shape: "rectangular"});
}

function afficherTags()
{
    listerTags();
    $('#myModal').modal('show');
}

function listerRegles()
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'liste',
            type: 'regle'
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        var regles = data.liste;
        
        afficherListeRegles(regles);
    })
    .fail(function() {
        console.log('Erreur dans le chargement de la liste.');
    })
    .always(function() {
        //
    });
}

function afficherListeRegles(regles)
{
    var contenuHtml = "";

    for (var i = 0; i < regles.length; i++)
    {
        contenuHtml += '<div class="radio">';
        contenuHtml += '<label><input type="radio" name="regle" id="regle_' + regles[i].code + '_" value="_' + regles[i].code + '_" onclick="changerRegle(\'' + regles[i].code + '\')" >' + regles[i].libelle + '</label>';
        contenuHtml += '</div>';
    }
    
    $('#liste_regles').html(contenuHtml);
}

function detailsCompS()
{
    listerRegles();
    
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'infos',
            type: 'competence_specifique',
            code: codeS
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        var comp = data.obj;
        
        document.getElementById("legende").innerHTML = 'Compétence spécifique : ' + comp.libelle;
        document.getElementById("code_comp").value = comp.code;
        document.getElementById("categorie_comp").value = comp.categorie;
        document.getElementById("libelle_comp").value = comp.libelle;
        document.getElementById("ponderation_comp").value = comp.ponderation;
        anciennePond = comp.ponderation;
        code_regle = comp.regle;
        checkRegle();        
        document.getElementById('mise_en_situation').value = comp.miseensituation;
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function checkRegle()
{
    if (document.getElementById("regle_" + code_regle + "_") !== null)
    {
        document.getElementById("regle_" + code_regle + "_").setAttribute("checked", "checked");

        var worker = new Worker("js/competence/RuleChecker.js");
    
        worker.postMessage([code_regle, 'stop']);
        
        worker.onmessage = function(e)
        {
            var regle = JSON.parse(e.data).obj;
            var newline = String.fromCharCode(13, 10);
            document.getElementById('texte_regle').value = regle.texte.replace(/\\n/g, newline);
        };
    }
}

function valider()
{
    var code_regle = $("input[type='radio'][name='regle']:checked").val();
    
    if (code_regle == null)
    {
        afficherRetour("modifs_refusees");
    }
    else
    {
        code_regle = code_regle.replace(/_/g, "");
        if (mode === "modification")
        {
            afficherRetour("modifs_en_cours");
            
            $.ajax({
                url: './ActionServlet',
                type: 'POST',
                data: {
                    action: 'modification',
                    type: 'competence_specifique',
                    code: codeS,
                    categorie: document.getElementById("categorie_comp").value,
                    libelle: document.getElementById("libelle_comp").value,
                    compSpec: JSON.stringify(competences[0].compSpec),
                    regle: code_regle,
                    miseensituation: document.getElementById("mise_en_situation").value
                },
                async:false,
                dataType: 'json'
            })
            .done(function(data) {
                var retour = data.retour;

                if (retour.valide)
                {
                    afficherRetour("modifs_acceptees");
                    setTimeout(function() {
                        location.replace(document.referrer);
                    }, 1000);
                }
                else
                {
                    afficherRetour("modifs_refusees");
                }
                
            })
            .fail(function() {
                console.log('Erreur dans le chargement des informations.');
            })
            .always(function() {
                //
            });
        }
        else if (mode === "creation")
        {
            afficherRetour("creation_competence_s_en_cours");
            $.ajax({
                url: './ActionServlet',
                type: 'POST',
                data: {
                    action: 'creation',
                    type: 'competence_specifique',
                    code: document.getElementById("code_comp").value,
                    competence_generale: codeG,
                    categorie: document.getElementById("categorie_comp").value,
                    libelle: document.getElementById("libelle_comp").value,
                    ponderation: document.getElementById("ponderation_comp").value,
                    compSpec: JSON.stringify(competences[0].compSpec),
                    regle: code_regle,
                    miseensituation: document.getElementById("mise_en_situation").value
                },
                async:false,
                dataType: 'json'
            })
            .done(function(data) {
                var retour = data.retour;

                if (retour.valide)
                {
                    afficherRetour("creation_competence_s_acceptee");
                }
                else
                {
                    afficherRetour("creation_competence_s_refusee");
                }
                
            })
            .fail(function() {
                console.log('Erreur dans le chargement des informations.');
            })
            .always(function() {
                //
            });
        }
    }
}

function rechercherRegle()
{  
    var xmlhttp=new XMLHttpRequest();
    
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState===4 && xmlhttp.status===200)
        {
            var regles = JSON.parse(xmlhttp.responseText).liste;

            afficherListeRegles(regles);

            checkRegle();
        }
    };
    
    xmlhttp.open("GET","./ActionServlet?action=recherche&objet=regle&type=libelle&libelle="+document.getElementById('recherche_regle').value,true);
    xmlhttp.send();
}

function changerRegle(id)
{
    code_regle = id;
    checkRegle();
}

function changerPonderation(val)
{
    if (competences[0].compSpec.length > 1)
    {
        var diff = 10 * (val - anciennePond);

        if (diff > 0)
        {
            for (var i = 0; i < diff; i++)
            {
                augmenterPond(codeG, codeS);
            }
        }
        else
        {
            for (var i = 0; i < -diff; i++)
            {
                diminuerPond(codeG, codeS);
            }
        }

        anciennePond = document.getElementById("ponderation_comp").value;
    }
    else
    {
        competences[0].compSpec[0].ponderation = 1;
        document.getElementById("ponderation_comp").value = 1;
        document.getElementById("ponderation_comp").disabled = "true";
    }
}

function annuler()
{
    if (mode === "modification")
    {
        init();
    }
    else if (mode === "creation")
    {
        location.replace(document.referrer);
    }
}