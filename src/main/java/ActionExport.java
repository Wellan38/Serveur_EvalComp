
import alexandre.evalcomp.metier.modele.Apprenant;
import alexandre.evalcomp.metier.modele.CompetenceG;
import alexandre.evalcomp.metier.service.ServiceMetier;
import alexandre.evalcomp.metier.service.ServiceTechnique;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author alexa
 */
public class ActionExport
{
    ServiceMetier servM;
    ServiceTechnique servT;
    
    public void setServices(ServiceMetier servM, ServiceTechnique servT)
    {
        this.servM = servM;
        this.servT = servT;
    }
    
    public void execute(HttpServletRequest request, HttpServletResponse response) {
        try
        {
            String type = request.getParameter("type");
            
            JsonObject file = new JsonObject();
            String apprenant;
            String competence;
            Apprenant a;
            CompetenceG cg;
            
            switch(type)
            {
                case "autoevaluations":
                    apprenant = request.getParameter("apprenant");
                    
                    a = servM.trouverApprenantParId(apprenant);
                    
                    if (a != null)
                    {
                        HSSFWorkbook wb = servT.exporterAutoevaluations(a);
                        
                        File dir = new File(ActionServlet.path + "\\xls\\autoevaluations");
                        
                        if (!dir.exists())
                        {
                            dir.mkdirs();
                        }
                        
                        File f = new File(dir.getAbsolutePath() + "\\autoevaluations-" + a.getId() + ".xls");
                        
                        f.createNewFile();
                        
                        FileOutputStream fos = new FileOutputStream(f);
                        
                        wb.write(fos);
                        
                        fos.flush();
                        
                        fos.close();
                        
                        wb.close();
                        
                        PrintWriter out = response.getWriter();
                        JsonObject container = new JsonObject();
                        container.addProperty("url", "xls/autoevaluations/" + f.getName());

                        Gson gson = new GsonBuilder().setPrettyPrinting().create();
                        String json = gson.toJson(container);
                        out.println(json);
                    }
                    
                    break;
                    
                case "scores":
                    
                    String par = request.getParameter("par");
                    
                    switch(par)
                    {
                        case "apprenant":
                            apprenant = request.getParameter("apprenant");

                            a = servM.trouverApprenantParId(apprenant);

                            if (a != null)
                            {
                                HSSFWorkbook wb = servT.exporterResultats(a);

                                File dir = new File(ActionServlet.path + "\\xls\\scores");

                                if (!dir.exists())
                                {
                                    dir.mkdirs();
                                }

                                File f = new File(dir.getAbsolutePath() + "\\scores-" + a.getId() + ".xls");

                                f.createNewFile();

                                FileOutputStream fos = new FileOutputStream(f);

                                wb.write(fos);

                                fos.flush();

                                fos.close();

                                wb.close();

                                PrintWriter out = response.getWriter();
                                JsonObject container = new JsonObject();
                                container.addProperty("url", "xls/scores/" + f.getName());

                                Gson gson = new GsonBuilder().setPrettyPrinting().create();
                                String json = gson.toJson(container);
                                out.println(json);
                            }
                            
                            break;
                            
                        case "competence":
                            competence = request.getParameter("competence");

                            cg = servM.trouverCompetenceGParId(competence);

                            if (cg != null)
                            {
                                HSSFWorkbook wb = servT.exporterResultats(cg);

                                File dir = new File(ActionServlet.path + "\\xls\\scores");

                                if (!dir.exists())
                                {
                                    dir.mkdirs();
                                }

                                File f = new File(dir.getAbsolutePath() + "\\scores-" + cg.getId() + ".xls");

                                f.createNewFile();

                                FileOutputStream fos = new FileOutputStream(f);

                                wb.write(fos);

                                fos.flush();

                                fos.close();

                                wb.close();

                                PrintWriter out = response.getWriter();
                                JsonObject container = new JsonObject();
                                container.addProperty("url", "xls/scores/" + f.getName());

                                Gson gson = new GsonBuilder().setPrettyPrinting().create();
                                String json = gson.toJson(container);
                                out.println(json);
                            }
                            
                            break;
                    }
                    
                    break;
            }
        }
        catch (Throwable ex)
        {
            Logger.getLogger(ActionExport.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    private static byte[] loadFile(File file) throws IOException {
    InputStream is = new FileInputStream(file);

    long length = file.length();
    if (length > Integer.MAX_VALUE) {
        // File is too large
    }
    byte[] bytes = new byte[(int)length];

    int offset = 0;
    int numRead = 0;
    while (offset < bytes.length
           && (numRead=is.read(bytes, offset, bytes.length-offset)) >= 0) {
        offset += numRead;
    }

    if (offset < bytes.length) {
        throw new IOException("Could not completely read file "+file.getName());
    }

    is.close();
    return bytes;
}
    
}
