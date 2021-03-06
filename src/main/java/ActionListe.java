
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import alexandre.evalcomp.metier.modele.*;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javafx.util.Pair;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author Alex-Laptop
 */
public class ActionListe extends Action
{

    @Override
    public void execute(HttpServletRequest request, HttpServletResponse response) {
        
        try
        {
            HttpSession session = request.getSession();
            
            String type = request.getParameter("type");
            
            JsonArray liste = new JsonArray();
            
            switch(type)
            {
                case "formation" :
                    Personne p = (Personne)session.getAttribute("personne");
                    
                    List<Formation> formations = new ArrayList();
                    
                    if (p.getType().equals(Personne.TypePersonne.Formateur))
                    {
                        formations = servM.listerFormationsParPersonne(p);
                    }
                    else if (p.getType().equals(Personne.TypePersonne.Coordonateur) || p.getType().equals(Personne.TypePersonne.Administrateur))
                    {
                        formations = servM.listerFormations();
                    }
                    else if (p.getType().equals(Personne.TypePersonne.Apprenant))
                    {
                        formations.add(servM.trouverApprenantParCompte(p).getFormation());
                    }
                    
                    for (Formation f : formations)
                    {
                        JsonObject form = new JsonObject();
                        form.addProperty("code", f.getId());
                        form.addProperty("libelle", f.getLibelle());
                        form.addProperty("domaine", f.getDomaine());
                        
                        liste.add(form);
                    }
                    
                    break;
                    
                case "competence_generale" :
                    
                    String formation = request.getParameter("formation");
                    
                    if (formation != null)
                    {
                        Formation f = servM.trouverFormationParId(formation);
                    
                        if (f != null)
                        {                        
                            for (CompetenceG c : f.getCompetences())
                            {
                                JsonObject comp = new JsonObject();
                                
                                comp.addProperty("libelle_formation", f.getLibelle());
                                comp.addProperty("code", c.getId());
                                comp.addProperty("libelle", c.getLibelle());
                                comp.addProperty("seuil_min", c.getSeuilMin());
                                comp.addProperty("seuil_max", c.getSeuilMax());
                                comp.addProperty("nb_comp", c.getCompSpec().size());
                                comp.addProperty("categorie", c.getType());
                                
                                JsonArray compSpec = new JsonArray();

                                for (CompetenceS cs : c.getCompSpec())
                                {
                                    JsonObject comps = new JsonObject();

                                    comps.addProperty("code", cs.getId());
                                    comps.addProperty("libelle", cs.getLibelle());
                                    comps.addProperty("ponderation", cs.getPonderation());
                                    System.out.println(cs.getPonderation());
                                    comps.addProperty("categorie", cs.getType());

                                    compSpec.add(comps);
                                }

                                comp.add("compSpec", compSpec);

                                liste.add(comp);
                            }
                        }
                    }
                    else
                    {
                        List<CompetenceG> competencesG = servM.listerCompetenceG();
                        
                        for (CompetenceG c : competencesG)
                        {                          
                            JsonObject co = new JsonObject();
                            
                            co.addProperty("code", c.getId());
                            co.addProperty("libelle", c.getLibelle());
                            co.addProperty("seuil_min", c.getSeuilMin());
                            co.addProperty("seuil_max", c.getSeuilMax());
                            co.addProperty("nb_comp", c.getCompSpec().size());
                            co.addProperty("categorie", c.getType());
                            
                            liste.add(co);
                        }
                    }
                    
                    break;
                    
                case "rule_pattern" :
                    System.out.println("Listing de rule patterns !");
                    List<RulePattern> patterns = servM.listerRulePatterns();
                    
                    for (RulePattern pat : patterns)
                    {
                        JsonObject pa = new JsonObject();
                        pa.addProperty("code", pat.getId());
                        pa.addProperty("libelle", pat.getLibelle());
                        pa.addProperty("ajout", pat.getAjoutCas());
                        pa.addProperty("nombre", pat.getNombre());
                        
                        JsonArray texte = new JsonArray();

                        for (Pair<String, Integer> cas : pat.getCas())
                        {
                            JsonObject o = new JsonObject();

                            o.addProperty("condition", cas.getKey());
                            o.addProperty("score", cas.getValue());

                            texte.add(o);
                        }

                        pa.add("cas", texte);
                        
                        liste.add(pa);
                    }
                    
                    break;
                    
                case "regle" :
                    System.out.println("Listing de règles !");
                    List<Regle> regles = servM.listerRegles();
                    
                    for (Regle r : regles)
                    {
                        JsonObject re = new JsonObject();
                        re.addProperty("code", r.getId());
                        re.addProperty("libelle", r.getLibelle());
                        
                        JsonArray texte = new JsonArray();

                        for (Pair<String, Integer> cas : r.getCas())
                        {
                            JsonObject o = new JsonObject();

                            o.addProperty("condition", cas.getKey());
                            o.addProperty("score", cas.getValue());

                            texte.add(o);
                        }

                        re.add("texte", texte);
                        
                        liste.add(re);
                    }
                    
                    break;
                    
                case "apprenant" :
                    System.out.println("Listing d'apprenants !");
                    
                    List<Apprenant> apprenants;
                    
                    String form = request.getParameter("formation");
                    
                    if (form != null)
                    {
                        Formation f = servM.trouverFormationParId(form);
                        
                        if ((apprenants = servM.listerApprenantsParFormation(f)) == null)
                        {
                            apprenants = new ArrayList();
                        }
                    }
                    else
                    {
                        apprenants = servM.listerApprenants();
                    }
                    
                    for (Apprenant a : apprenants)
                    {
                        JsonObject ap = new JsonObject();
                        ap.addProperty("code", a.getId());
                        ap.addProperty("nom", a.getNom());
                        ap.addProperty("fonction", a.getFonction());
                        ap.addProperty("entreprise", a.getEntreprise());
                        if (a.getFormation() != null)
                        {
                            ap.addProperty("formation", a.getFormation().getId());
                        }
                        
                        liste.add(ap);
                    }
                    
                    break;
                    
                case "score":
                    Apprenant a = servM.trouverApprenantParId(request.getParameter("apprenant"));
                    CompetenceG c = servM.trouverCompetenceGParId(request.getParameter("competence"));
                    if (a != null && c != null)
                    {
                        List<Score> scores = servM.listerScoresParCompetenceG(a, c);
                        
                        for (Score sc : scores)
                        {
                            JsonObject o = new JsonObject();
                            
                            o.addProperty("apprenant", a.getId());
                            o.addProperty("competence", sc.getCompetence().getId());
                            o.addProperty("note", sc.getScore());
                            o.addProperty("ponderation", sc.getCompetence().getPonderation());
                            
                            liste.add(o);
                        }
                    }
                    break;
                    
                case "autoevaluation":
                    Apprenant ap = servM.trouverApprenantParId(request.getParameter("apprenant"));
                    CompetenceG cg = servM.trouverCompetenceGParId(request.getParameter("competence"));
                    if (ap != null && cg != null)
                    {
                        List<AutoEvaluation> evals = servM.listerAutoevaluationsParCompetenceG(ap, cg);
                        
                        for (AutoEvaluation e : evals)
                        {
                            JsonObject o = new JsonObject();
                            
                            o.addProperty("apprenant", ap.getId());
                            o.addProperty("competence", e.getCompetence().getId());
                            o.addProperty("valeur", e.getValeur());
                            o.addProperty("ponderation", e.getCompetence().getPonderation());
                            
                            liste.add(o);
                        }
                    }
                    
                    break;
            }
            
            PrintWriter out = response.getWriter();
            JsonObject container = new JsonObject();
            container.add("liste", liste);
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            String json = gson.toJson(container);
            out.println(json);
        }
        catch (Throwable ex) {
            Logger.getLogger(ActionListe.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
}
