/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var url_array = window.location.href.split("?")[0].split("/");
var url = url_array[url_array.length - 1];
    
var competences = [];

function afficherCompS(code, compS, codeS)
{
    var contenuHtml = '';
    
    if (compS.length > 0)
    {
        var w = 585;
        var h = 453;

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

            contenuHtml += '<div id="cercle_' + compS[0].code + '_" class="clickable full-circle" style="height:' + d_max + 'px; width:' + d_max + 'px; top:' + (h/2 - d_max/2) + 'px; left:' + (w/2 - d_max/2) + 'px" data-toggle="tooltip" title="' + compS[0].libelle + '\nCatégorie : ' + compS[0].categorie + '\nPondération : ' + compS[0].ponderation + '" onclick="voirCompS(\'' + code + '\', \'' + compS[0].code + '\')">';
            contenuHtml += '<p style="font-size:35px; padding-top:40%; margin-bottom: 29%">' + libelle + '</p>';
            contenuHtml += '<p style="font-size:10px;">' + compS[0].ponderation + '</p>';
            
            if (url === "liste_competences_generales.html")
            {
                var w_trash = d_max/2 - 11;

                contenuHtml += '<span id="icone_trash_' + compS[0].code + '_" class="clickable glyphicon glyphicon-trash" style="top:-25px; left:' + w_trash + 'px" onmouseover="disableClick(\'' + compS[0].code + '\')" onmouseout="enableClick(\'' + compS[0].code + '\')" onclick="retirerCompS(\'' + code + '\', \'' + compS[0].code + '\')" data-toggle="tooltip" title="Supprimer cette compétence"></span>';
            }
            
            if (url === "liste_competences_generales.html")
            {
                var w_ajout = w/2;
                var h_ajout = h/2;
                
                contenuHtml += '<button class="btn btn-md btn-primary" id="ajouterCompS_' + code + '_" style="top:' + h_ajout + 'px; left:' + w_ajout + 'px" onclick="ajouterCompS(\'' + code + '\')" onmouseover="disableClick(\'' + compS[0].code + '\')" onmouseout="enableClick(\'' + compS[0].code + '\')"><i class="fa fa-plus"></i></button>';
            }
            
            contenuHtml += '</div></div>';
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

                if (compS[i].code == codeS)
                {
                    if (document.getElementById("ponderation_comp") !== null)
                    {
                        document.getElementById("ponderation_comp").value = compS[i].ponderation;
                    }
                    
                    contenuHtml += '<div id="cercle_' + compS[i].code + '_" class="clickable full-circle" style="background-color: #A2B5BF;height:' + d + 'px; width:' + d + 'px; top:' + (h_circle) + 'px; left:' + (w_circle) + 'px" data-toggle="tooltip" title="' + compS[i].libelle + '\nCatégorie : ' + compS[i].categorie + '\nPondération : ' + compS[i].ponderation + '" onclick="voirCompS(\'' + code + '\', \'' + compS[i].code + '\')">';
                }
                else
                {
                    contenuHtml += '<div id="cercle_' + compS[i].code + '_" class="clickable full-circle" style="height:' + d + 'px; width:' + d + 'px; top:' + (h_circle) + 'px; left:' + (w_circle) + 'px" data-toggle="tooltip" title="' + compS[i].libelle + '\nCatégorie : ' + compS[i].categorie + '\nPondération : ' + compS[i].ponderation + '" onclick="voirCompS(\'' + code + '\', \'' + compS[i].code + '\')">';
                }
                contenuHtml += '<p style="font-size:' + 25 * compS[i].ponderation / pond_max + 'px; padding-top:38%">' + libelle + '</p>';
                contenuHtml += '<p style="font-size:10px; position:absolute; top:' + h_pond + 'px; left:' + w_pond + 'px">' + compS[i].ponderation + '</p>';
                
                if (url === "liste_competences_generales.html")
                {
                    contenuHtml += '<span id="icone_trash_' + compS[i].code + '_" class="clickable glyphicon glyphicon-trash" style="top:-25px; left:' + w_trash + 'px" onmouseover="disableClick(\'' + compS[i].code + '\')" onmouseout="enableClick(\'' + compS[i].code + '\')" onclick="retirerCompS(\'' + code + '\', \'' + compS[i].code + '\')" data-toggle="tooltip" title="Supprimer cette compétence"></span>';
                }
                
                if (url === "liste_competences_generales.html")
                {
                    contenuHtml += '<span id="icone_plus_' + compS[i].code + '_" class="clickable glyphicon glyphicon-plus-sign" style="top:' + h_plus_minus + 'px; left:' + w_plus + 'px" onmouseover="disableClick(\'' + compS[i].code + '\')" onmouseout="enableClick(\'' + compS[i].code + '\')" onclick="augmenterPond(\'' + code + '\', \'' + compS[i].code + '\', ' + JSON.stringify(compS).replace(/"/g, "&quot;").replace(/'/g, "&#039;") + ')" data-toggle="tooltip" title="Augmenter la pondération de cette compétence"></span>';
                    contenuHtml += '<span id="icone_minus_' + compS[i].code + '_" class="clickable glyphicon glyphicon-minus-sign" style="top:' + h_plus_minus + 'px; left:' + w_minus + 'px" onmouseover="disableClick(\'' + compS[i].code + '\')" onmouseout="enableClick(\'' + compS[i].code + '\')" onclick="diminuerPond(\'' + code + '\', \'' + compS[i].code + '\', ' + JSON.stringify(compS).replace(/"/g, "&quot;").replace(/'/g, "&#039;") + ')" data-toggle="tooltip" title="Diminuer la pondération de cette compétence"></span>';
                }
                
                if (url === "competence_specifique.html" && compS[i].code == codeS)
                {
                    contenuHtml += '<span id="icone_plus" class="clickable glyphicon glyphicon-plus-sign" style="top:' + h_plus_minus + 'px; left:' + w_plus + 'px" onmouseover="disableClick(\'' + compS[i].code + '\')" onmouseout="enableClick(\'' + compS[i].code + '\')" onclick="changerPonderation(document.getElementById(\'ponderation_comp\').value -(-0.1))" data-toggle="tooltip" title="Augmenter la pondération de cette compétence"></span>';
                    contenuHtml += '<span id="icone_minus" class="clickable glyphicon glyphicon-minus-sign" style="top:' + h_plus_minus + 'px; left:' + w_minus + 'px" onmouseover="disableClick(\'' + compS[i].code + '\')" onmouseout="enableClick(\'' + compS[i].code + '\')" onclick="changerPonderation(document.getElementById(\'ponderation_comp\').value - 0.1)" data-toggle="tooltip" title="Diminuer la pondération de cette compétence"></span>';
                }
                
                contenuHtml += '</div>';
            }
            
            if (url === "liste_competences_generales.html")
            {
                var w_ajout = w/2 - 15;
                var h_ajout = h/2 + 15;
                
                contenuHtml += '<button class="btn btn-md btn-primary" id="ajouterCompS_' + code + '_" style="top:' + h_ajout + 'px; left:' + w_ajout + 'px" onclick="ajouterCompS(\'' + code + '\')"><i class="fa fa-plus"></i></button>';
            }
            
            contenuHtml += '</div>';
        }
    }
    document.getElementById("comp_spec__" + code + "_").innerHTML = contenuHtml;
}

function voirCompS(codeG, codeS)
{
    window.location.href="./competence_specifique.html?mode=modification&codeG=" + codeG + "&codeS=" + codeS;
}

function disableClick(id)
{
    document.getElementById("cercle_" + id + "_").setAttribute("onclick", "");
}

function enableClick(id)
{
    document.getElementById("cercle_" + id + "_").setAttribute("onclick", "voirCompS(" + id + ")");
}

function ajouterCompS(code)
{
    window.location.href = "./competence_specifique.html?mode=creation&code=" + code;
}

function retirerCompS(codeG, codeS)
{
    var compS;
    var index;
    
    for (index = 0; index < competences.length; index++)
    {
        if (competences[index].code == codeG)
        {
            compS = competences[index].compSpec;
            break;
        }
    }
    
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
    
    competences[index].compSpec = compS;
    
    afficherCompS(codeG, compS, codeS);
}

function augmenterPond(codeG, codeS)
{
    var compS;
    var index;
    
    for (index = 0; index < competences.length; index++)
    {
        if (competences[index].code == codeG)
        {
            compS = competences[index].compSpec;
            break;
        }
    }
    
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
    
    competences[index].compSpec = compS;
    
    afficherCompS(codeG, compS, codeS);
}

function diminuerPond(codeG, codeS)
{
    var compS;
    var index;
    
    for (index = 0; index < competences.length; index++)
    {
        if (competences[index].code == codeG)
        {
            compS = competences[index].compSpec;
            break;
        }
    }
    
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
    
    competences[index].compSpec = compS;
    
    afficherCompS(codeG, compS, codeS);
}