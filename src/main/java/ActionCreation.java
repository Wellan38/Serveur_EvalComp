
import alexandre.evalcomp.metier.modele.Apprenant;
import alexandre.evalcomp.metier.modele.CompetenceG;
import alexandre.evalcomp.metier.modele.CompetenceS;
import alexandre.evalcomp.metier.modele.Formation;
import alexandre.evalcomp.metier.modele.Regle;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
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
public class ActionCreation extends Action
{
    @Override
    public void execute(HttpServletRequest request, PrintWriter out)
    {
        try
        {
            String type = request.getParameter("type");
            
            JsonObject obj = new JsonObject();
        
            switch(type)
            {
                case "competence_specifique" :
                    CompetenceS cs = creerCompetenceS(request);
                    if (cs != null)
                    {
                        obj.addProperty("valide", Boolean.TRUE);
                        obj.addProperty("code", cs.getId());
                    }
                    else
                    {
                        obj.addProperty("valide", Boolean.FALSE);
                    }
                    
                    break;
                    
                case "formation" :
                    Formation f = creerFormation(request);
                    
                    if (f != null)
                    {
                        obj.addProperty("valide", Boolean.TRUE);
                        obj.addProperty("code", f.getId());
                    }
                    else
                    {
                        obj.addProperty("valide", Boolean.FALSE);
                    }
                    
                    break;
                    
                case "apprenant" :
                    Apprenant a = creerApprenant(request);
                    
                    if (a != null)
                    {
                        obj.addProperty("valide", Boolean.TRUE);
                        obj.addProperty("code", a.getId());
                    }
                    else
                    {
                        obj.addProperty("valide", Boolean.FALSE);
                    }
                    
                    break;
                    
                case "competence_generale" :
                    CompetenceG c = creerCompetenceG(request);
                    
                    if (c != null)
                    {
                        obj.addProperty("valide", Boolean.TRUE);
                        obj.addProperty("code", c.getId());
                    }
                    else
                    {
                        obj.addProperty("valide", Boolean.FALSE);
                    }
                    
                    break;
            }
            
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
    
    public CompetenceS creerCompetenceS(HttpServletRequest request) throws Throwable
    {        
        String code = request.getParameter("code");
        String libelle = request.getParameter("libelle");
        String categorie = request.getParameter("categorie");
        Double ponderation = Double.valueOf(request.getParameter("ponderation"));
        Regle regle = servM.trouverRegleParId(request.getParameter("regle"));
        
        if (regle != null)
        {
            CompetenceS cs = servM.creerCompetenceS(code, libelle, categorie, ponderation, regle);
            
            if (cs != null)
            {
                CompetenceG cg = servM.trouverCompetenceGParId(request.getParameter("competence_generale"));
                
                if (cg != null)
                {
                    List<CompetenceS> compSpec = cg.getCompSpec();
            
                    JsonParser jsonParser = new JsonParser();
                    JsonArray ja = (JsonArray)jsonParser.parse(request.getParameter("compSpec"));
                    
                    for (JsonElement e : ja)
                    {
                        JsonObject o = e.getAsJsonObject();
                        
                        if (o.get("code").toString().equals("null"))
                        {
                            compSpec.add(cs);
                        }
                        else
                        {
                            for (CompetenceS c : compSpec)
                            {
                                if (c.getId().equals(o.get("code").toString().replace("\"", "")))
                                {
                                    c.setPonderation(o.get("ponderation").getAsDouble());
                                    servM.majObjet(c);
                                    break;
                                }
                            }
                        }
                    }
                    
                    servM.majObjet(cg);
                }
                return cs;
            }
        }
        
        return null;
    }
    
    public Formation creerFormation(HttpServletRequest request) throws ParseException, Throwable
    {
        String code = request.getParameter("code");
        String libelle = request.getParameter("libelle");
        String domaine = request.getParameter("domaine");
        String url = request.getParameter("url");
        
        Integer duree;
        
        if (!request.getParameter("duree").equals(""))
        {
            duree = Integer.valueOf(request.getParameter("duree"));
        }
        else
        {
            duree = null;
        }
        
        Date date;
        
        if (!request.getParameter("date").equals(""))
        {
            String date_s = request.getParameter("date");

            DateFormat format = new SimpleDateFormat("dd/MM/yyyy");

            date = format.parse(date_s);
        }
        else
        {
            date = null;
        }
        
        Formation f = servM.creerFormation(code, libelle, domaine, url, duree, date);
        
        return f;
    }
    
    public Apprenant creerApprenant(HttpServletRequest request) throws Throwable
    {
        String code = request.getParameter("code");
        String nom = request.getParameter("nom");
        String fonction = request.getParameter("fonction");
        String entreprise = request.getParameter("entreprise");
        String id_form = request.getParameter("formation");
        
        Formation f = servM.trouverFormationParId(id_form);
        
        if (f != null)
        {
            Apprenant a = servM.creerApprenant(code, nom, fonction, entreprise);
            
            if (a != null)
            {
                servM.assignerFormation(a, f);

                return a;
            }
            else
            {
                return null;
            }
        }
        else
        {
            return null;
        }
    }
    
    public CompetenceG creerCompetenceG(HttpServletRequest request) throws Throwable
    {
        String code = request.getParameter("code");
        String libelle = request.getParameter("libelle");
        String categorie = request.getParameter("categorie");
        Double seuil_min = Double.valueOf(request.getParameter("seuil_min"));
        Double seuil_max = Double.valueOf(request.getParameter("seuil_max"));
        
        CompetenceG c = servM.creerCompetenceG(code, libelle, categorie, seuil_min, seuil_max, new ArrayList());
        
        if (!request.getParameter("formation").equals(""))
        {
            Formation f = servM.trouverFormationParId(request.getParameter("formation"));
            
            if (f != null)
            {
                servM.ajouterCompetenceG(f, c);
            }
        }
        
        return c;
    }
}
