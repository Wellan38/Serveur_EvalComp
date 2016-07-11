
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import alexandre.evalcomp.metier.modele.*;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import com.google.gson.JsonObject;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import javax.servlet.http.HttpServletRequest;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author Alex-Laptop
 */
public class ActionInfos extends Action {
    
    @Override
    public void execute(HttpServletRequest request, PrintWriter out)
    {
        try {
            System.out.println("Entrée dans le try !");
            String type = request.getParameter("type");
            
            JsonObject obj = null;

            switch(type)
            {
                case "formation" :
                {
                    System.out.println("Infos de formation !");
                    try {
                        obj = printFormation(request);
                    }
                    catch (Throwable ex) {
                        Logger.getLogger(ActionInfos.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
                    break;
                    
                case "competence_generale" :
                {
                    System.out.println("Infos de compétence générale !");
                    try {
                        obj = printCompetenceG(request);
                    }
                    catch (Throwable ex) {
                        Logger.getLogger(ActionInfos.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
                    break;
                    
                case "competence_specifique" :
                {
                    System.out.println("Infos de compétence spécifique !");
                    try {
                        obj = printCompetenceS(request);
                    }
                    catch (Throwable ex) {
                        Logger.getLogger(ActionInfos.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
                    break;
                    
                case "regle" :
                {
                    System.out.println("Infos de règle");
                    try {
                        obj = printRegle(request);
                    }
                    catch (Throwable ex) {
                        Logger.getLogger(ActionInfos.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
                    break;
                    
                case "apprenant" :
                    System.out.println("Infos d'apprenant !");
                    try {
                        obj = printApprenant(request);
                    }
                    catch (Throwable ex) {
                        Logger.getLogger(ActionInfos.class.getName()).log(Level.SEVERE, null, ex);
                    }
                    
                    break;
            }
            
            JsonObject container = new JsonObject();
            container.add("obj", obj);
            
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            String json = gson.toJson(container);
            out.println(json);
        }
        catch(Exception e) {
            throw e;
        }
    }
    
    public JsonObject printFormation(HttpServletRequest request) throws Throwable
    {
        String code = request.getParameter("code");
        
        System.out.println(code);
        
        Formation f = servM.trouverFormationParId(code);
        
        JsonObject formation = new JsonObject();
        
        if (f != null)
        {
            formation.addProperty("code", f.getId());
            formation.addProperty("libelle", f.getLibelle());
            formation.addProperty("domaine", f.getDomaine());
            formation.addProperty("url", f.getUrl());
            formation.addProperty("duree", f.getDuree());
            
            DateFormat format = new SimpleDateFormat("dd/MM/yyyy");
            String date = format.format(f.getDate());
            formation.addProperty("date", date);
            
            JsonArray seuils_min = new JsonArray();
            JsonArray seuils_max = new JsonArray();

            for (CompetenceG cg : f.getCompetences())
            {
                JsonObject s_min = new JsonObject();
                JsonObject s_max = new JsonObject();

                s_min.addProperty("competence_generale", cg.getId());
                s_min.addProperty("seuil", cg.getSeuilMin());

                s_max.addProperty("competence_generale", cg.getId());
                s_max.addProperty("seuil", cg.getSeuilMax());

                seuils_min.add(s_min);
                seuils_max.add(s_max);
            }
            
            formation.add("seuils_min", seuils_min);
            formation.add("seuils_max", seuils_max);
        }
        
        return formation;
    }
    
    public JsonObject printCompetenceG(HttpServletRequest request) throws Throwable
    {
        String code = request.getParameter("code");
        
        System.out.println(code);
        
        CompetenceG c = servM.trouverCompetenceGParId(code);
        
        JsonObject competence = new JsonObject();
        
        if (c != null)
        {
            competence.addProperty("code", c.getId());
            competence.addProperty("libelle", c.getLibelle());
            competence.addProperty("categorie", c.getType());
            competence.addProperty("seuil_min", c.getSeuilMin());
            competence.addProperty("seuil_max", c.getSeuilMax());
            
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
            
            competence.add("compSpec", compSpec);
        }
        
        return competence;
    }
    
    public JsonObject printCompetenceS(HttpServletRequest request) throws Throwable
    {
        String code = request.getParameter("code");
        
        CompetenceS c = servM.trouverCompetenceSParId(code);
        
        JsonObject competence = new JsonObject();
        
        if (c != null)
        {
            competence.addProperty("code", c.getId());
            competence.addProperty("libelle", c.getLibelle());
            competence.addProperty("categorie", c.getType());
            competence.addProperty("ponderation", c.getPonderation());
            competence.addProperty("regle", c.getRegle().getId());
            
            System.out.println(c.getMiseEnSituation());
            
            if (c.getMiseEnSituation() != null)
            {
                System.out.println("ok");
                List<String> actions = c.getMiseEnSituation().getActions();

                JsonArray ac = new JsonArray();

                for (String s : actions)
                {
                    ac.add(s);
                }

                competence.add("miseensituation", ac);
            }
        }
        
        return competence;
    }
    
    public JsonObject printRegle(HttpServletRequest request) throws Throwable
    {
        Regle r = servM.trouverRegleParId(request.getParameter("code"));
        
        JsonObject regle = new JsonObject();
        
        if (r != null)
        {
            regle.addProperty("code", r.getId());
            regle.addProperty("libelle", r.getLibelle());
            
            JsonArray texte = new JsonArray();
            
            for (String s : r.getTexte())
            {
                texte.add(s);
            }
            
            regle.add("texte", texte);
        }
        
        return regle;
    }
    
    public JsonObject printApprenant(HttpServletRequest request) throws Throwable
    {
        Apprenant a = servM.trouverApprenantParId(request.getParameter("code"));
        
        JsonObject apprenant = new JsonObject();

        if (a != null)
        {
            apprenant.addProperty("code", a.getId());
            apprenant.addProperty("nom", a.getNom());
            apprenant.addProperty("fonction", a.getFonction());
            apprenant.addProperty("entreprise", a.getEntreprise());
            if (a.getFormation() != null)
            {
                apprenant.addProperty("formation", a.getFormation().getId());
            }

            List<Score> sc = servM.listerScoresParApprenant(a);
            JsonArray scores = new JsonArray();

            for (Score s : sc)
            {
                JsonObject sco = new JsonObject();
                sco.addProperty("code_competence", s.getCompetence().getId());
                sco.addProperty("libelle_competence", s.getCompetence().getLibelle());
                sco.addProperty("valeur", s.getScore());
                
                scores.add(sco);
            }

            apprenant.add("scores", scores);

            List<Grade> gr = servM.listerGradesParApprenant(a);
            JsonArray grades = new JsonArray();

            for (Grade g : gr)
            {
                if (g.getGrade() != null)
                {
                    JsonObject gra = new JsonObject();
                    
                    gra.addProperty("code_competence", g.getCompetence().getId());
                    gra.addProperty("libelle_competence", g.getCompetence().getLibelle());
                    gra.addProperty("grade", g.getGrade().toString());
                    gra.addProperty("moyenne", servM.calculerMoyenneCompetenceG(a, g.getCompetence()));
                    System.out.println(servM.calculerMoyenneCompetenceG(a, g.getCompetence()));

                    grades.add(gra);
                }
            }

            apprenant.add("grades", grades);
        }

        return apprenant;
    }
}
