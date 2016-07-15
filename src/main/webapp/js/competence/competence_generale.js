/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var param = window.location.search.substring(1).split("&");
var mode = param[0].split("=")[1];
var code;
var competence = null;
var formation = null;
var anciennePond;
var compS;
var essai_submit = false;

(function() {
    init();
}());

function init()
{
    if (mode === "creation")
    {
        document.getElementById("btn_annuler").innerHTML = '<span class="fa fa-times"></span> Retour aux compétences';
        document.getElementById("btn_valider").innerHTML = '<span class="fa fa-check"></span> Créer la compétence';
        formation = param[1].split("=")[1];
    }
    else if (mode === "modification")
    {
        code = param[1].split("=")[1];
        $('#code_competence').attr("disabled", "true");
        document.getElementById("btn_annuler").innerHTML = '<span class="fa fa-times"></span> Annuler les modifications';
        document.getElementById("btn_valider").innerHTML = '<span class="fa fa-check"></span> Valider les modifications';
        $("#infos").attr("class", "col-md-6").attr("style", "padding: 0px");
        $("#comp_spec").attr("class", "col-md-6").attr("style", "padding: 0px; height: 453px;");
        
        detailsCompetence();
    }   
}

function detailsCompetence()
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'infos',
            type: 'competence_generale',
            code: code
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        var c = data.obj;

        compS = c.compSpec;

        document.getElementById("code_competence").value = c.code;
        document.getElementById("categorie_competence").value = c.categorie;
        document.getElementById("libelle_competence").value = c.libelle;
        document.getElementById("seuil_min_competence").value = c.seuil_min;
        document.getElementById("seuil_max_competence").value = c.seuil_max;
        
        afficherCompS();
    })
    .fail(function() {
        console.log('Erreur dans le chargement des incompetences.');
    })
    .always(function() {
        //
    });
}

function valider()
{
    essai_submit = true;
    
    var valide = checkData();
    
    if (mode === "creation")
    {
        if (!valide)
        {
            afficherRetour("creation_competence_g_refusee");
        }   
        else
        {
            afficherRetour("creation_competence_g_en_cours");
            
            $.ajax({
                url: './ActionServlet',
                type: 'POST',
                data: {
                    action: 'creation',
                    type: 'competence_generale',
                    code: document.getElementById("code_competence").value,
                    categorie: document.getElementById("categorie_competence").value,
                    seuil_min: document.getElementById("seuil_min_competence").value,
                    seuil_max: document.getElementById("seuil_max_competence").value,
                    formation: formation
                },
                async:false,
                dataType: 'json'
            })
            .done(function(data) {
                var retour = data.retour;

                if (retour.valide)
                {
                    afficherRetour("creation_competence_g_acceptee");
                    setTimeout(function() {
                        window.location.href = "competence_generale.html?mode=modification&code=" + document.getElementById("code_competence").value;
                    }, 2000);
                }
                else
                {
                    afficherRetour("creation_competence_g_refusee");
                }

            })
            .fail(function() {
                console.log('Erreur dans le chargement des incompetences.');
            })
            .always(function() {
                //
            });
        }
    }
    else if (mode === "modification")
    {
        if (!valide)
        {
            afficherRetour("modifs_refusees");
        }   
        else
        {
            afficherRetour("modifs_en_cours");
            
            $.ajax({
                url: "./ActionServlet",
                type: "POST",
                data: {
                    action: "modification",
                    type: "competence_generale",
                    code: document.getElementById("code_competence").value,
                    libelle: document.getElementById("libelle_competence").value,
                    categorie: document.getElementById("categorie_competence").value,
                    seuil_min: document.getElementById("seuil_min_competence").value,
                    seuil_max: document.getElementById("seuil_max_competence").value,
                    compSpec: JSON.stringify(compS)
                },
                async:false,
                dataType: "json"
            })
            .done(function(data) {

                var retour = data.retour;

                if (retour.valide)
                {
                    afficherRetour("modifs_acceptees");
                }
                else
                {
                    afficherRetour("modifs_refusees");
                }
            })
            .fail(function() {
                console.log("Erreur dans le chargement des incompetences.");
            })
            .always(function() {
                //
            });
        }
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

function afficherCompS()
{
    var contenuHtml = '';
    
    var w = 585;
    var h = 453;
    
    if (compS.length > 0)
    {
        var d_max; 

        if (compS.length === 1)
        {
            if (h > w)
            {
                d_max = w / 2;
            }
            else
            {
                d_max = h / 2;
            }
            
            var libelle = compS[0].libelle.substring(0).split(" ")[0];

            contenuHtml += '<div id="cercle\'' + compS[0].code + '\'" class="clickable full-circle" style="height:' + d_max + 'px; width:' + d_max + 'px; top:' + (h/2 - d_max/2) + 'px; left:' + (w/2 - d_max/2) + 'px" data-toggle="tooltip" title="' + compS[0].libelle + '\nCatégorie : ' + compS[0].categorie + '\nPondération : ' + compS[0].ponderation + '" onclick="voirCompS(\'' + compS[0].code + '\')">';
            contenuHtml += '<p style="font-size:35px; padding-top:40%; margin-bottom: 29%">' + libelle + '</p>';
            contenuHtml += '<p style="font-size:10px;">' + compS[0].ponderation + '</p>';
            
            var w_trash = d_max/2 - 11;

            contenuHtml += '<span id="icone_trash\'' + compS[0].code + '\'" class="clickable glyphicon glyphicon-trash" style="top:-25px; left:' + w_trash + 'px" onmouseover="disableClick(\'' + compS[0].code + '\')" onmouseout="enableClick(\'' + compS[0].code + '\')" onclick="retirerCompS(\'' + compS[0].code + '\')" data-toggle="tooltip" title="Supprimer cette compétence"></span>';
            
            var w_ajout = w/2;
            var h_ajout = h/2;
            
            contenuHtml += '</div>';
        }
        else
        {            
            if (h > w)
            {
                d_max = w / 3;
            }
            else
            {
                d_max = h / 3;
            }

            var pond_max = 0;

            for (var i = 0; i < compS.length; i++)
            {
                if (compS[i].ponderation > pond_max)
                {
                    pond_max = compS[i].ponderation;
                }
            }

            for (var i = 0; i < compS.length; i++)
            {
                var d = d_max * compS[i].ponderation / pond_max;

                var libelle = compS[i].libelle.substring(0).split(" ")[0];

                var h_pond = d - 20;
                var w_pond = d/2 - 10;

                var r = h/2 - d/2;

                var h_circle = h/2 + 30 - d/2 + r * (- Math.cos(i * 2 * Math.PI / compS.length));
                var w_circle = w/2 - d/2 + r * (Math.sin(i * 2 * Math.PI / compS.length));

                var w_trash = d/2 - 11;
                var h_plus_minus = d/2 + d/2 * Math.sqrt(2)/2;
                var w_plus = d/2 + d/2 * Math.sqrt(2)/2;
                var w_minus = d/2 - d/2 * Math.sqrt(2)/2 - 20;

                contenuHtml += '<div id="cercle\'' + compS[i].code + '\'" class="clickable full-circle" style="height:' + d + 'px; width:' + d + 'px; top:' + (h_circle) + 'px; left:' + (w_circle) + 'px" data-toggle="tooltip" title="' + compS[i].libelle + '\nCatégorie : ' + compS[i].categorie + '\nPondération : ' + compS[i].ponderation + '" onclick="voirCompS(\'' + compS[i].code + '\')">';
                contenuHtml += '<p style="font-size:' + 25 * compS[i].ponderation / pond_max + 'px; padding-top:38%">' + libelle + '</p>';
                contenuHtml += '<p style="font-size:10px; position:absolute; top:' + h_pond + 'px; left:' + w_pond + 'px">' + compS[i].ponderation + '</p>';
                
                contenuHtml += '<span id="icone_trash\'' + compS[i].code + '\'" class="clickable glyphicon glyphicon-trash" style="top:-25px; left:' + w_trash + 'px" onmouseover="disableClick(\'' + compS[i].code + '\')" onmouseout="enableClick(\'' + compS[i].code + '\')" onclick="retirerCompS(\'' + compS[i].code + '\')" data-toggle="tooltip" title="Supprimer cette compétence"></span>';
                
                contenuHtml += '<span id="icone_plus\'' + compS[i].code + '\'" class="clickable fa fa-plus-circle" style="top:' + h_plus_minus + 'px; left:' + w_plus + 'px" onmouseover="disableClick(\'' + compS[i].code + '\')" onmouseout="enableClick(\'' + compS[i].code + '\')" onclick="augmenterPond(\'' + compS[i].code + '\', ' + JSON.stringify(compS).replace(/"/g, "&quot;").replace(/'/g, "&#039;") + ')" data-toggle="tooltip" title="Augmenter la pondération de cette compétence"></span>';
                contenuHtml += '<span id="icone_minus\'' + compS[i].code + '\'" class="clickable fa fa-minus-circle" style="top:' + h_plus_minus + 'px; left:' + w_minus + 'px" onmouseover="disableClick(\'' + compS[i].code + '\')" onmouseout="enableClick(\'' + compS[i].code + '\')" onclick="diminuerPond(\'' + compS[i].code + '\', ' + JSON.stringify(compS).replace(/"/g, "&quot;").replace(/'/g, "&#039;") + ')" data-toggle="tooltip" title="Diminuer la pondération de cette compétence"></span>';
                
                contenuHtml += '</div>';
            }
            
            var w_ajout = w/2 - 15;
            var h_ajout = h/2 + 15;
        }
    }
    else
    {
        var w_ajout = w/2 - 15;
        var h_ajout = h/2 + 15;
    }
    
    contenuHtml += '<h2><i class="clickable fa fa-plus-circle" id="ajouterCompS" style="top:' + h_ajout + 'px; left:' + w_ajout + 'px" onclick="ajouterCompS()"></i></h2>';
    
    contenuHtml += '</div>';
    
    $('#comp_spec').html(contenuHtml);
}

function voirCompS(codeS)
{
    window.location.href='./competence_specifique.html?mode=modification&code=' + code + '&codeS=' + codeS;
}

function disableClick(id)
{
    document.getElementById("cercle'" + id + "'").setAttribute('onclick', '');
}

function enableClick(id)
{
    document.getElementById("cercle'" + id + "'").setAttribute('onclick', 'voirCompS(\'' + id + '\')');
}

function retirerCompS(codeS)
{
    if (compS.length > 1)
    {
        var pond;

        for (var i = 0; i < compS.length; i++)
        {
            if (compS[i].code === codeS)
            {
                pond = compS[i].ponderation;
                compS.splice(compS.indexOf(compS[i]), 1);
                break;
            }
        }

        var old_compS = [];

        for (var i = 0; i < compS.length; i++)
        {
            old_compS.push(compS[i]);
        }

        compS.sort(function(a,b){return a.ponderation - b.ponderation;});

        var cpt = 0;
        var i = 0;

        while (cpt < pond * 10)
        {
            if (i === compS.length)
            {
                i = 0;
            }
            var code = compS[i].code;

            i++;

            for (var j = 0; j < old_compS.length; j++)
            {
                if (old_compS[j].code === code)
                {
                    old_compS[j].ponderation = Math.round(10 * (old_compS[j].ponderation + 0.1)) / 10;
                    break;
                }
            }

            cpt++;
        }

        compS = old_compS;
    }
    else
    {
        compS = [];
    }
    
    afficherCompS();
}

function augmenterPond(codeS)
{
    var pond_max = 0;
    var comp_max;
    
    var compAug;
    
    for (var i = 0; i < compS.length; i++)
    {
        if (compS[i].code === codeS)
        {
            compAug = compS[i];
        }
        else if (compS[i].ponderation > pond_max)
        {
            pond_max = compS[i].ponderation;
            comp_max = compS[i];
        }
    }
    
    compAug.ponderation = Math.round(10 * (compAug.ponderation + 0.1)) / 10;
    comp_max.ponderation = Math.round(10 * (comp_max.ponderation - 0.1)) / 10;
    
    afficherCompS();
}

function diminuerPond(codeS)
{
    var pond_min = 1;
    var comp_min;
    
    var compDim;
    
    for (var i = 0; i < compS.length; i++)
    {
        if (compS[i].code === codeS)
        {
            compDim = compS[i];
        }
        else if (compS[i].ponderation < pond_min)
        {
            pond_min = compS[i].ponderation;
            comp_min = compS[i];
        }
    }
    
    compDim.ponderation = Math.round(10 * (compDim.ponderation - 0.1)) / 10;
    comp_min.ponderation = Math.round(10 * (comp_min.ponderation + 0.1)) / 10;
    
    afficherCompS();
}

function ajouterCompS()
{
    window.location.href = './competence_specifique.html?mode=creation&code=' + code;
}

function checkCode()
{
    if (essai_submit)
    {
        var code_g = document.getElementById("code_competence");

        var valide = true;

        if (code_g.value === "")
        {
            valide = false;
            $('#code_competence').attr('data-original-title', 'Le code ne peut pas être vide').tooltip('fixTitle').tooltip('show');
        }
        else
        {
            for (var i = 0; i < code_g.value.length; i++)
            {
                if (!code_g.value[i].match(/[a-z]/i) && !code_g.value[i].match(/[0-9]/i) && code_g.value[i] !== "-" && code_g.value[i] !== "_")
                {
                    valide = false;
                    $('#code_competence').attr('data-original-title', 'Le code ne doit contenir que des caractères alphanumériques, des tirets ou des undersocres').tooltip('fixTitle').tooltip('show');
                    break;
                }
            }
        }

        if (!valide)
        {
            code_g.style = "border: 1px solid red; box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0, 0.6);";
        }
        else
        {
            $('#code_competence').attr('data-original-title', '').tooltip('fixTitle').tooltip('hide');
            code_g.style = "border-color: #66afe9; box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);";
        }
    }
    
    return valide;
}

function checkData()
{
    var valide = true;
    
    if (!checkCode())
    {
        valide = false;
    }
    if (!checkLibelle())
    {
        valide = false;
    }
    if (!checkCategorie())
    {
        valide = false;
    }
    if (!checkCategorie())
    {
        valide = false;
    }
    if (!checkSeuilMin())
    {
        valide = false;
    }
    if (!checkSeuilMax())
    {
        valide = false;
    }
    
    return valide;
}

function checkLibelle()
{
    if (essai_submit)
    {
        var libelle_c = document.getElementById("libelle_competence");

        var valide = true;

        if (libelle_c.value === "")
        {
            valide = false;
            $('#libelle_competence').attr('data-original-title', 'Le libellé ne peut pas être vide').tooltip('fixTitle').tooltip('show');
        }
        else
        {
            for (var i = 0; i < libelle_c.value.length; i++)
            {
                if (libelle_c.value[i] === '"')
                {
                    valide = false;
                    $('#libelle_competence').attr('data-original-title', 'Le libellé ne doit pas contenir de guillemets').tooltip('fixTitle').tooltip('show');
                    break;
                }
            }
        }

        if (!valide)
        {
            libelle_c.style = "border: 1px solid red; box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0, 0.6);";
        }
        else
        {
            $('#libelle_competence').attr('data-original-title', '').tooltip('fixTitle').tooltip('hide');
            libelle_c.style = "border-color: #66afe9; box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);";
        }
    }
    
    return valide;
}

function checkCategorie()
{
    if (essai_submit)
    {
        var categorie_c = document.getElementById("categorie_competence");

        var valide = true;

        if (categorie_c.value === "")
        {
            valide = false;
            $('#categorie_competence').attr('data-original-title', 'La catégorie ne peut pas être vide').tooltip('fixTitle').tooltip('show');
        }
        else
        {
            for (var i = 0; i < categorie_c.value.length; i++)
            {
                if (categorie_c.value[i] === '"')
                {
                    valide = false;
                    $('#categorie_competence').attr('data-original-title', 'La catégorie ne doit pas contenir de guillemets').tooltip('fixTitle').tooltip('show');
                    break;
                }
            }
        }

        if (!valide)
        {
            categorie_c.style = "border: 1px solid red; box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0, 0.6);";
        }
        else
        {
            $('#categorie_competence').attr('data-original-title', '').tooltip('fixTitle').tooltip('hide');
            categorie_c.style = "border-color: #66afe9; box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);";
        }
    }
    
    return valide;
}

function checkSeuilMin()
{
    if (essai_submit)
    {
        var seuil_min_c = document.getElementById("seuil_min_competence");

        var valide = true;

        if (seuil_min_c.value === "")
        {
            valide = false;
            $('#seuil_min_competence').attr('data-original-title', 'Le seuil minimal doit être précisé').tooltip('fixTitle').tooltip('show');
        }
        else
        {
            if (isNaN(seuil_min_c.value))
            {
                valide = false;
                $('#seuil_min_competence').attr('data-original-title', 'Le seuil minimal doit être un nombre valide').tooltip('fixTitle').tooltip('show');
            }
            else if (seuil_min_c.value <= 0)
            {
                valide = false;
                $('#seuil_min_competence').attr('data-original-title', 'Le seuil minimal doit être un nombre strictement positif').tooltip('fixTitle').tooltip('show');
            }
        }

        if (!valide)
        {
            seuil_min_c.style = "border: 1px solid red; box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0, 0.6);";
        }
        else
        {
            $('#seuil_min_competence').attr('data-original-title', '').tooltip('fixTitle').tooltip('hide');
            seuil_min_c.style = "border-color: #66afe9; box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);";
        }
    }
    
    return valide;
}

function checkSeuilMax()
{
    if (essai_submit)
    {
        var seuil_max_c = document.getElementById("seuil_max_competence");

        var valide = true;

        if (seuil_max_c.value === "")
        {
            valide = false;
            $('#seuil_max_competence').attr('data-original-title', 'Le seuil maximal doit être précisé').tooltip('fixTitle').tooltip('show');
        }
        else
        {
            if (isNaN(seuil_max_c.value))
            {
                valide = false;
                $('#seuil_max_competence').attr('data-original-title', 'Le seuil maximal doit être un nombre valide').tooltip('fixTitle').tooltip('show');
            }
            else if (seuil_max_c.value <= 0)
            {
                valide = false;
                $('#seuil_max_competence').attr('data-original-title', 'Le seuil maximal doit être un nombre strictement positif').tooltip('fixTitle').tooltip('show');
            }
        }

        if (!valide)
        {
            seuil_max_c.style = "border: 1px solid red; box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0, 0.6);";
        }
        else
        {
            $('#seuil_max_competence').attr('data-original-title', '').tooltip('fixTitle').tooltip('hide');
            seuil_max_c.style = "border-color: #66afe9; box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);";
        }
    }
    
    return valide;
}