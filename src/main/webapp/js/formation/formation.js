/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var param = window.location.search.substring(1).split("&");
var mode = param[0].split("=")[1];
var code;
var essai_submit = false;

(function()
{
    $.material.init();
    $('#date_formation').bootstrapMaterialDatePicker
    ({
        format: 'DD/MM/YYYY',
        time: false,
        clearButton: true,
        weekStart: 1
        
    }).on("change", checkDate());
    
    if (mode === "modification")
    {
        document.getElementById("code_formation").disabled = "true";
        code = param[1].split("=")[1];
        document.getElementById("annuler").innerHTML += ' Annuler les modifications';
        document.getElementById("valider").innerHTML += ' Valider les modifications';
        afficherInfos();
    }
    if (mode === "creation")
    {
        document.getElementById("annuler").innerHTML += ' Retour aux formations';
        document.getElementById("valider").innerHTML += ' Créer la formation';
    }
    
}());

function afficherInfos()
{    
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'infos',
            type: 'formation',
            code: code
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        var formation = data.obj;

        $('#legende').html("Formation : " + formation.libelle);
        $('#code_formation').attr("value", formation.code).trigger("change");
        $('#libelle_formation').attr("value", formation.libelle).trigger("change");
        $('#domaine_formation').attr("value", formation.domaine).trigger("change");
        $('#url_formation').attr("value", formation.url).trigger("change");
        $('#duree_formation').attr("value", formation.duree).trigger("change");
        $('#date_formation').attr("value", formation.date).trigger("change");
        
        document.getElementById("legende").innerHTML = 'Formation : ' + formation.libelle;
        
        if (mode === "modification")
        {            
            document.getElementById("annuler").innerHTML = '<span class="fa fa-times"></span> Annuler les modifications';
            document.getElementById("valider").innerHTML = '<span class="fa fa-check"></span> Valider les modifications';
        }
        
        if (mode === "creation")
        {
            document.getElementById("annuler").innerHTML = '<span class="fa fa-times"></span> Revenir aux formations';
            document.getElementById("valider").innerHTML = '<span class="fa fa-check"></span> Créer la formation';
        }
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function validerModifs()
{
    essai_submit = true;
    
    var valide = checkData();

    if (mode === "modification")
    {
        if (!valide)
        {
            afficherRetour("modifs_refusees");          
        }
        else
        {
            $.ajax({
                url: './ActionServlet',
                type: 'POST',
                data: {
                    action: 'modification',
                    type: 'formation',
                    code: document.getElementById('code_formation').value,
                    libelle: document.getElementById('libelle_formation').value,
                    domaine: document.getElementById('domaine_formation').value,
                    url: document.getElementById('url_formation').value,
                    duree: document.getElementById('duree_formation').value,
                    date: document.getElementById('date_formation').value
                },
                async:false,
                dataType: 'json'
            })
            .done(function(data) {

                var retour = data.retour;

                if (retour.valide)
                {
                    afficherRetour("modifs_acceptees");
                    afficherInfos();
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
    }
    else if (mode === "creation")
    {
        if (!valide)
        {
            afficherRetour("creation_refusee");          
        }
        else
        {
            var code_f = document.getElementById('code_formation');
            var libelle_f = document.getElementById('libelle_formation');
            var domaine_f = document.getElementById('domaine_formation');
            var url_f = document.getElementById('url_formation');
            var duree_f = document.getElementById('duree_formation');
            var date_f = document.getElementById('date_formation');

            $.ajax({
                url: './ActionServlet',
                type: 'POST',
                data: {
                    action: 'creation',
                    type: 'formation',
                    code: code_f.value,
                    libelle: libelle_f.value,
                    domaine: domaine_f.value,
                    url: url_f.value,
                    duree: duree_f.value,
                    date: date_f.value
                },
                async:false,
                dataType: 'json'
            })
            .done(function(data) {

                var retour = data.retour;

                if (retour.valide)
                {
                    afficherRetour("creation_formation_acceptee");
                    setTimeout(function() {
                        window.location.href = "formation.html?mode=modification&code=" + retour.code;
                    }, 1000);
                }
                else
                {
                    afficherRetour("creation_formation_refusee");
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

function voirCompetences()
{
    window.location.href = './liste_competences_generales.html?code=' + code;
}

function checkCode()
{
    if (essai_submit)
    {
        var code_f = document.getElementById("code_formation");

        var valide = true;

        if (code_f.value === "")
        {
            valide = false;
            $('#code_formation').attr('data-original-title', 'Le code ne peut pas être vide').tooltip('fixTitle').tooltip('show');
        }
        else
        {
            for (var i = 0; i < code_f.value.length; i++)
            {
                if (!code_f.value[i].match(/[a-z]/i) && !code_f.value[i].match(/[0-9]/i) && code_f.value[i] !== "-" && code_f.value[i] !== "_")
                {
                    valide = false;
                    $('#code_formation').attr('data-original-title', 'Le code ne doit contenir que des caractères alphanumériques, des tirets ou des undersocres').tooltip('fixTitle').tooltip('show');
                    break;
                }
            }
        }

        if (!valide)
        {
            code_f.style = "border: 1px solid red; box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0, 0.6);";
        }
        else
        {
            $('#code_formation').attr('data-original-title', '').tooltip('fixTitle').tooltip('hide');
            code_f.style = "border-color: #66afe9; box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);";
        }
    }
    
    return valide;
}

function checkLibelle()
{
    if (essai_submit)
    {
        var libelle_f = document.getElementById("libelle_formation");

        var valide = true;

        if (libelle_f.value === "")
        {
            valide = false;
            $('#libelle_formation').attr('data-original-title', 'Le libellé ne peut pas être vide').tooltip('fixTitle').tooltip('show');
        }
        else
        {
            for (var i = 0; i < libelle_f.value.length; i++)
            {
                if (libelle_f.value[i] === '"')
                {
                    valide = false;
                    $('#libelle_formation').attr('data-original-title', 'Le libellé ne doit pas contenir de guillemets').tooltip('fixTitle').tooltip('show');
                    break;
                }
            }
        }

        if (!valide)
        {
            libelle_f.style = "border: 1px solid red; box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0, 0.6);";
        }
        else
        {
            $('#libelle_formation').attr('data-original-title', '').tooltip('fixTitle').tooltip('hide');
            libelle_f.style = "border-color: #66afe9; box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);";
        }
    }
    
    return valide;
}

function checkDomaine()
{
    if (essai_submit)
    {
        var domaine_f = document.getElementById("domaine_formation");

        var valide = true;

        if (domaine_f.value === "")
        {
            valide = false;
            $('#domaine_formation').attr('data-original-title', 'Le domaine ne peut pas être vide').tooltip('fixTitle').tooltip('show');
        }
        else
        {
            for (var i = 0; i < domaine_f.value.length; i++)
            {
                if (domaine_f.value[i] === '"')
                {
                    valide = false;
                    $('#domaine_formation').attr('data-original-title', 'Le domaine ne doit pas contenir de guillemets').tooltip('fixTitle').tooltip('show');
                    break;
                }
            }
        }

        if (!valide)
        {
            domaine_f.style = "border: 1px solid red; box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0, 0.6);";
        }
        else
        {
            $('#domaine_formation').attr('data-original-title', '').tooltip('fixTitle').tooltip('hide');
            domaine_f.style = "border-color: #66afe9; box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);";
        }
    }
    
    return valide;
}

function checkDuree()
{
    if (essai_submit)
    {
        var duree_f = document.getElementById("duree_formation");

        var valide = true;

        if (duree_f.value === "")
        {
            valide = false;
            $('#help_duree').html('La durée doit être précisée');
        }
        else
        {
            if (isNaN(duree_f.value))
            {
                valide = false;
                $('#help_duree').html('La durée doit être un nombre valide');
                //$('#duree_formation').attr('data-original-title', 'La durée doit être un nombre valide').tooltip('fixTitle').tooltip('show');
            }
            else if (duree_f.value < 1)
            {
                console.log("ok");
                valide = false;
                $('#help_duree').html('La durée doit être un nombre >= 1');
                //$('#duree_formation').attr('data-original-title', 'La durée doit être un nombre >= 1').tooltip('fixTitle').tooltip('show');
            }
            else if ((parseFloat(duree_f.value) | 0) !== parseFloat(duree_f.value))
            {
                valide = false;
                $('#help_duree').html('La durée doit être un nombre entier');
                //$('#duree_formation').attr('data-original-title', 'La durée doit être un nombre entier').tooltip('fixTitle').tooltip('show');
            }
        }

        if (!valide)
        {
            $('#form_duree').addClass("has-error");
            //duree_f.style = "border: 1px solid red; box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0, 0.6);";
        }
        else
        {
            $('#help_duree').html("");
            //$('#duree_formation').attr('data-original-title', '').tooltip('fixTitle').tooltip('hide');
            if ($('#form_duree').hasClass("has-error"))
            {
                $('#form_duree').removeClass("has-error");
            }
            //duree_f.style = "border-color: #66afe9; box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);";
        }
    }
    
    return valide;
}

function checkDate()
{
    if (essai_submit)
    {
        var date_f = document.getElementById("date_formation");

        var valide = true;

        if (date_f.value === "")
        {
            console.log("ok");
            valide = false;
            $('#date_formation').attr('data-original-title', 'La date doit être précisée').tooltip('fixTitle').tooltip('show');
        }
        else
        {
            if (!testDate(date_f.value))
            {
                valide = false;
                $('#date_formation').attr('data-original-title', 'La date doit suivre le format jj/mm/aaaa').tooltip('fixTitle').tooltip('show');
            }
        }

        if (!valide)
        {
            //date_f.style = "border: 1px solid red; box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0, 0.6);";
            $('#form_date').addClass("has-error");
        }
        else
        {
            $('#date_formation').attr('data-original-title', '').tooltip('fixTitle').tooltip('hide');
            //date_f.style = "border: 1px solid #66afe9; box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);";
            $('#form_date').removeClass("has-error");
        }
    }
    
    return valide;
}

function testDate(str)
{
    var t = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    
    if (t === null)
    {
        return false;
    }
    var d = parseInt(t[1]), m = parseInt(t[2],10), y = parseInt(t[3],10);
    
    if(m >= 1 && m <= 12 && d >= 1 && d <= 31)
    {
        return true;   
    }
    return false;
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
    if (!checkDomaine())
    {
        valide = false;
    }

    if (!checkDuree())
    {
        valide = false;
    }

    if (!checkDate())
    {
        valide = false;
    }
    
    return valide;
}