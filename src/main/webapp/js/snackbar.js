var snack = null;

function afficherRetour(type)
{
    if (snack !== null)
    {
        snack.snackbar("hide");
    }
    
    var contenu = "";
    switch (type)
    {
        case "modifs_en_cours" :
            contenu = '<div class="pull-left">Modifications en cours... </div><span class="pull-right fa fa-spinner fa-pulse"></span>';
            
            break;
            
        case "modifs_acceptees" :
            contenu = '<div class="pull-left">Modifications acceptées ! </div><span class="pull-right fa fa-check" style="color: #32CD32"></span>';
            
            break;
            
        case "modifs_refusees" :
            contenu = '<div class="pull-left">Modifications refusées ! </div><span class="pull-right fa fa-times" style="color: #FF6347"></span>';
            
            break;
            
        case "creation_formation_en_cours" :
            contenu = '<div class="pull-left">Création de la formation en cours... </div><span class="pull-right fa fa-spinner fa-pulse"></span>';
            
            break;
            
        case "creation_formation_acceptee" :
            contenu = '<div class="pull-left">La formation a bien été créée ! </div><span class="pull-right fa fa-check" style="color: #32CD32"></span>';
            
            break;
            
        case "creation_formation_refusee" :
            contenu = '<div class="pull-left">La formation n\'a pas pu être créée ! </div><span class="pull-right fa fa-times" style="color: #FF6347"></span>';
            
            break;
            
        case "creation_competence_g_en_cours" :
            contenu = '<div class="pull-left">Création de la compétence générale en cours... </div><span class="pull-right fa fa-spinner fa-pulse"></span>';
            
            break;
            
        case "creation_competence_g_acceptee" :
            contenu = '<div class="pull-left">La compétence générale a bien été créée ! </div><span class="pull-right fa fa-check" style="color: #32CD32"></span>';
            
            break;
            
        case "creation_competence_g_refusee" :
            contenu = '<div class="pull-left">La compétence générale n\'a pas pu être créée ! </div><span class="pull-right fa fa-times" style="color: #FF6347"></span>';
            
            break;
            
        case "creation_competence_s_en_cours" :
            contenu = '<div class="pull-left">Création de la compétence spécifique en cours... </div><span class="pull-right fa fa-spinner fa-pulse"></span>';
            
            break;
            
        case "creation_competence_s_acceptee" :
            contenu = '<div class="pull-left">La compétence spécifique a bien été créée ! </div><span class="pull-right fa fa-check" style="color: #32CD32"></span>';
            
            break;
            
        case "creation_competence_s_refusee" :
            contenu = '<div class="pull-left">La compétence spécifique n\'a pas pu être créée ! </div><span class="pull-right fa fa-times" style="color: #FF6347"></span>';
            
            break;
            
        case "creation_apprenant_en_cours" :
            contenu = '<div class="pull-left">Création de l\'apprenant en cours... </div><span class="pull-right fa fa-spinner fa-pulse"></span>';
            
            break;
            
        case "creation_apprenant_acceptee" :
            contenu = '<div class="pull-left">L\'apprenant a bien été créé ! </div><span class="pull-right fa fa-check" style="color: #32CD32"></span>';
            
            break;
            
        case "creation_apprenant_refusee" :
            contenu = '<div class="pull-left">L\'apprenant n\'a pas pu être créé ! </div><span class="pull-right fa fa-times" style="color: #FF6347"></span>';
            
            break;
            
        case "suppression_formation_en_cours" :
            contenu = '<div class="pull-left">Suppression de la formation en cours... </div><span class="pull-right fa fa-spinner fa-pulse"></span>';
            
            break;
            
        case "suppression_formation_acceptee" :
            contenu = '<div class="pull-left">La formation a bien été supprimée ! </div><span class="pull-right fa fa-check" style="color: #32CD32"></span>';
            
            break;
            
        case "suppression_formation_refusee" :
            contenu = '<div class="pull-left">La formation n\'a pas pu être supprimée ! </div><span class="pull-right fa fa-times" style="color: #FF6347"></span>';
            
            break;
            
        case "suppression_competence_g_en_cours" :
            contenu = '<div class="pull-left">Suppression de la compétence générale en cours... </div><span class="pull-right fa fa-spinner fa-pulse"></span>';
            
            break;
            
        case "suppression_competence_g_acceptee" :
            contenu = '<div class="pull-left">La compétence générale a bien été supprimée ! </div><span class="pull-right fa fa-check" style="color: #32CD32"></span>';
            
            break;
            
        case "suppression_competence_g_refusee" :
            contenu = '<div class="pull-left">La compétence générale n\'a pas pu être supprimée ! </div><span class="pull-right fa fa-times" style="color: #FF6347"></span>';
            
            break;
            
        case "suppression_competence_s_en_cours" :
            contenu = '<div class="pull-left">Suppression de la compétene spécifique en cours... </div><span class="pull-right fa fa-spinner fa-pulse"></span>';
            
            break;
            
        case "suppression_competence_s_acceptee" :
            contenu = '<div class="pull-left">La compétence spécifique a bien été supprimée ! </div><span class="pull-right fa fa-check" style="color: #32CD32"></span>';
            
            break;
            
        case "suppression_competence_s_refusee" :
            contenu = '<div class="pull-left">La compétence spécifique n\'a pas pu être supprimée ! </div><span class="pull-right fa fa-times" style="color: #FF6347"></span>';
            
            break;
            
        case "suppression_apprenant_en_cours" :
            contenu = '<div class="pull-left">Suppression de l\'apprenant en cours... </div><span class="pull-right fa fa-spinner fa-pulse"></span>';
            
            break;
            
        case "suppression_apprenant_acceptee" :
            contenu = '<div class="pull-left">L\'apprenant a bien été supprimé ! </div><span class="pull-right fa fa-check" style="color: #32CD32"></span>';
            
            break;
            
        case "suppression_apprenant_refusee" :
            contenu = '<div class="pull-left">L\'apprenant n\'a pas pu être supprimé ! </div><span class="pull-right fa fa-times" style="color: #FF6347"></span>';
            
            break;
        
        case "notation_en_cours" :
            contenu = '<div class="pull-left">Enregistrement des scores en cours... </div><span class="pull-right fa fa-times" style="color: #FF6347"></span>';
            
            break;
            
        case "notation_acceptee" :
            contenu = '<div class="pull-left">Les scores ont bien été enregistrés ! </div><span class="pull-right fa fa-check" style="color: #32CD32"></span>';
            
            break;
            
        case "notation_refusee" :
            contenu = '<div class="pull-left">Les scores n\'ont pas pu être enregistrés ! </div><span class="pull-right fa fa-times" style="color: #FF6347"></span>';
            
            break;
    }
    
    snack = $.snackbar({content: contenu, timeout: 1500, htmlAllowed: true});
}