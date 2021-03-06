
import alexandre.evalcomp.metier.modele.Apprenant;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import alexandre.evalcomp.metier.modele.CompetenceG;
import alexandre.evalcomp.metier.modele.CompetenceS;
import alexandre.evalcomp.metier.modele.Formation;
import alexandre.evalcomp.metier.modele.MiseEnSituation;
import alexandre.evalcomp.metier.modele.Regle;
import com.google.gson.JsonElement;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javafx.util.Pair;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author Alex-Laptop
 */
public class ActionModification extends Action
{
    @Override
    public void execute(HttpServletRequest request, HttpServletResponse response)
    {
        try
        {
            String type = request.getParameter("type");
            
            JsonObject obj = new JsonObject();
            
            switch(type)
            {
                case "formation" :
                    if (modifierFormation(request))
                    {
                        obj.addProperty("valide", Boolean.TRUE);
                    }
                    else
                    {
                        obj.addProperty("valide", Boolean.FALSE);
                    }
                    
                    break;
                    
                case "competence_generale" :
                    if (modifierCompetenceG(request))
                    {
                        obj.addProperty("valide", Boolean.TRUE);
                    }
                    else
                    {
                        obj.addProperty("valide", Boolean.FALSE);
                    }
                    
                    break;
                    
                case "competence_specifique" :
                    if (modifierCompetenceS(request))
                    {
                        obj.addProperty("valide", Boolean.TRUE);
                    }
                    else
                    {
                        obj.addProperty("valide", Boolean.FALSE);
                    }
                    
                    break;
                    
                case "apprenant" :
                    if (modifierApprenant(request))
                    {
                        obj.addProperty("valide", Boolean.TRUE);
                    }
                    else
                    {
                        obj.addProperty("valide", Boolean.FALSE);
                    }
                    
                    break;
            }
            
            PrintWriter out = response.getWriter();
            JsonObject container = new JsonObject();
            container.add("retour", obj);
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            String json = gson.toJson(container);
            out.println(json);
        }
        catch (Throwable ex)
        {
            Logger.getLogger(ActionModification.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public Boolean modifierFormation(HttpServletRequest request) throws Throwable
    {
        Formation f = servM.trouverFormationParId(request.getParameter("code"));
        
        if (f == null)
        {
            return false;
        }
        else
        {
            Boolean res = true;
            
            f.setLibelle(request.getParameter("libelle"));
            f.setDomaine(request.getParameter("domaine"));
            f.setUrl(request.getParameter("url"));
            f.setDuree(Integer.valueOf(request.getParameter("duree")));
            
            String date_s = request.getParameter("date");
            
            DateFormat format = new SimpleDateFormat("dd/MM/yyyy");
            
            Date date = format.parse(date_s);
            
            f.setDate(date);
            
            if (!servM.majObjet(f))
            {
                res = Boolean.FALSE;
            }
            
            if (request.getParameter("competences") != null)
            {
                List<CompetenceG> competences = f.getCompetences();
                
                JsonParser jsonParser = new JsonParser();
                JsonArray ja = (JsonArray)jsonParser.parse(request.getParameter("competences"));
                
                for (Iterator<CompetenceG> it = competences.listIterator(); it.hasNext();)
                {
                    CompetenceG c = it.next();
                    
                    Boolean trouve = Boolean.FALSE;
                    
                    for (JsonElement e : ja)
                    {
                        System.out.println(e.getAsJsonObject().get("code").getAsString());
                        if (e.getAsJsonObject().get("code").getAsString().equals(c.getId()))
                        {
                            System.out.println("trouvé");
                            trouve = Boolean.TRUE;
                            
                            break;
                        }
                    }
                    if (!trouve)
                    {
                    it.remove();

                        if (!servM.majObjet(f))
                        {
                            res = false;
                        }
                    }
                }
                
                for (JsonElement e : ja)
                {                    
                    if (competences.isEmpty())
                    {
                        CompetenceG aAjouter = servM.trouverCompetenceGParId(e.getAsJsonObject().get("code").toString().replace("\"", ""));

                        if (aAjouter != null)
                        {
                            competences.add(aAjouter);

                            if (!servM.majObjet(f))
                            {
                                res = false;
                            }
                        }
                        else
                        {
                            res = false;
                        }
                    }
                    else
                    {
                        Boolean trouve = false;
                        for (Iterator<CompetenceG> it = competences.listIterator(); it.hasNext();)
                        {
                            CompetenceG c = it.next();

                            if (c.getId().equals(e.getAsJsonObject().get("code").getAsString()))
                            {
                                System.out.println(c);
                                trouve = true;
                                break;
                            }
                        }
                        
                        if (!trouve)
                        {
                            System.out.println("pas trouvé");
                            CompetenceG aAjouter = servM.trouverCompetenceGParId(e.getAsJsonObject().get("code").toString().replace("\"", ""));

                            if (aAjouter != null)
                            {
                                competences.add(aAjouter);

                                if (!servM.majObjet(f))
                                {
                                    res = false;
                                }
                            }
                            else
                            {
                                res = false;
                            }
                        }
                    }
                    
                }
            }
            
            return res;
        }
    }
    
    public Boolean modifierCompetenceG(HttpServletRequest request) throws Throwable
    {
        CompetenceG c = servM.trouverCompetenceGParId(request.getParameter("code"));
        
        if (c == null)
        {
            return false;
        }
        else
        {
            Boolean valide = true;
            
            c.setLibelle(request.getParameter("libelle"));
            c.setType(request.getParameter("categorie"));
            c.setSeuilMin(Double.valueOf(request.getParameter("seuil_min")));
            c.setSeuilMax(Double.valueOf(request.getParameter("seuil_max")));
            
            if (!servM.majObjet(c))
            {
                valide = false;
            }
            
            List<CompetenceS> compSpec = c.getCompSpec();
            
            JsonParser jsonParser = new JsonParser();
            JsonArray ja = (JsonArray)jsonParser.parse(request.getParameter("compSpec"));
            
            for (Iterator<CompetenceS> it = compSpec.listIterator(); it.hasNext();)
            {
                CompetenceS cs = it.next();
                Boolean trouve = false;
                for (JsonElement e : ja)
                {
                    if (cs.getId().equals(e.getAsJsonObject().get("code").toString().replace("\"", "")))
                    {
                        trouve = true;
                        cs.setPonderation(e.getAsJsonObject().get("ponderation").getAsDouble());
                        if(!servM.majObjet(cs))
                        {
                            valide = false;
                        }
                        break;
                    }
                }
                
                if (!trouve)
                {
                    it.remove();
                    if(!servM.majObjet(c) || !servM.supprimerCompetenceS(cs))
                    {
                        valide = false;
                    }
                }
            }
            
            return valide;
        }
    }
    
    public Boolean modifierCompetenceS(HttpServletRequest request) throws Throwable
    {
        CompetenceS c = servM.trouverCompetenceSParId(request.getParameter("code"));
        
        if (c == null)
        {
            return false;
        }
        else
        {
            c.setLibelle(request.getParameter("libelle"));
            c.setFeminin(Boolean.valueOf(request.getParameter("feminin")));
            c.setPluriel(Boolean.valueOf(request.getParameter("pluriel")));
            c.setType(request.getParameter("categorie"));
            
            MiseEnSituation m = c.getMiseEnSituation();
            
            m.setContexte(request.getParameter("contexte"));
            m.setRessources(request.getParameter("ressources"));
            m.setAction(request.getParameter("actions"));
            
            servM.majObjet(m);
            
            List<CompetenceS> compSpec = c.getCompG().getCompSpec();
            
            JsonParser jsonParser = new JsonParser();
            JsonArray ja = (JsonArray)jsonParser.parse(request.getParameter("compSpec"));
            
            for (JsonElement e : ja)
            {
                for (CompetenceS cs : compSpec)
                {
                    if (cs.getId().equals(e.getAsJsonObject().get("code").getAsString()))
                    {   
                        cs.setPonderation(e.getAsJsonObject().get("ponderation").getAsDouble());
                        servM.majObjet(cs);
                        break;
                    }
                }
            }
            
            JsonArray cas_ja = (JsonArray)jsonParser.parse(request.getParameter("regle"));

            List<Pair<String, Integer>> cas = new ArrayList();
            for (JsonElement e : cas_ja)
            {
                Pair<String, Integer> p = new Pair(e.getAsJsonObject().get("condition").getAsString(), e.getAsJsonObject().get("score").getAsInt());
                cas.add(p);
            }
            
            Regle r = c.getRegle();
            
            if (r != null)
            {  
                r.setCas(cas);
                r.setPourcentages(Boolean.valueOf(request.getParameter("pourcentages")));
                
                servM.majObjet(r);
                
                System.out.println(c.getRegle().getCas());
            }
            else
            {
                Regle re = servM.creerRegle("R-" + c.getId(), "Regle_" + c.getId() + "_", servM.trouverRulePatternParId(request.getParameter("rule_pattern")), Boolean.valueOf(request.getParameter("pourcentages")), cas);
                c.setRegle(re);
            }
            
            return servM.majObjet(c) && servM.majObjet(c.getCompG());
        }
    }
    
    public Boolean modifierApprenant(HttpServletRequest request) throws Throwable
    {
        Apprenant a = servM.trouverApprenantParId(request.getParameter("code"));
        
        if (a == null)
        {
            return false;
        }
        else
        {
            a.setNom(request.getParameter("nom"));
            a.setFonction(request.getParameter("fonction"));
            a.setEntreprise(request.getParameter("entreprise"));
            
            Formation f = servM.trouverFormationParId(request.getParameter("formation"));
            
            if (f != null)
            {
                a.setFormation(f);
            }
            return servM.majObjet(a);
        }
    }
}
