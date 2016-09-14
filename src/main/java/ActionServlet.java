/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import alexandre.evalcomp.metier.service.ServiceMetier;
import alexandre.evalcomp.metier.service.ServiceTechnique;
import java.io.IOException;
import java.io.PrintWriter;
import static java.lang.System.out;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Alex-Laptop
 */
@WebServlet(urlPatterns = {"/ActionServlet"})
public class ActionServlet extends HttpServlet {
    
    public static String path = "C:\\Users\\alexa\\OneDrive\\Documents\\NetBeansProjects\\Serveur_EvalComp\\src\\main\\webapp";
    
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException
    {
        response.setCharacterEncoding("UTF-8");
        
        String todo = request.getParameter("action");

        ServiceMetier servM = new ServiceMetier();
        ServiceTechnique servT = new ServiceTechnique();
        response.setCharacterEncoding("UTF-8");
        
        
        System.out.println("Action !");
        
        if (request.getSession(false) == null && !request.getParameter("action").equals("connexion"))
        {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
        else
        {
            switch(todo)
            {
                case "infos" :
                    System.out.println("Action d'infos !");
                    ActionInfos acInfos = new ActionInfos();
                    acInfos.setServices(servM, servT);
                    acInfos.execute(request, response);

                    break;

                case "modification" :
                    System.out.println("Action de modification !");
                    ActionModification acModif = new ActionModification();
                    acModif.setServices(servM, servT);
                    acModif.execute(request, response);

                    break;

                case "liste" :
                    System.out.println("Action de listing !");
                    ActionListe acListe = new ActionListe();
                    acListe.setServices(servM, servT);
                    acListe.execute(request, response);

                    break;

                case "creation" :
                    System.out.println("Action de création !");
                    ActionCreation acCreation = new ActionCreation();
                    acCreation.setServices(servM, servT);
                    acCreation.execute(request, response);

                    break;

                case "notation" :
                    System.out.println("Action de notation !");
                    ActionNotation acNotation = new ActionNotation();
                    acNotation.setServices(servM, servT);
                    acNotation.execute(request, response);

                    break;
                    
                case "autoevaluation" :
                    System.out.println("Action d'autoévaluation !");
                    ActionAutoevaluation acAutoevaluation = new ActionAutoevaluation();
                    acAutoevaluation.setServices(servM, servT);
                    acAutoevaluation.execute(request, response);

                    break;

                case "suppression" :
                    System.out.println("Action de suppression !");
                    ActionSuppression acSuppression = new ActionSuppression();
                    acSuppression.setServices(servM, servT);
                    acSuppression.execute(request, response);

                    break;

                case "connexion" :
                    System.out.println("Action de connexion !");
                    ActionConnexion acConnexion = new ActionConnexion();
                    acConnexion.setServices(servM, servT);
                    acConnexion.execute(request, response);

                    break;

                case "deconnexion" :
                    System.out.println("Action de déconnexion !");
                    ActionDeconnexion acDeconnexion = new ActionDeconnexion();
                    acDeconnexion.setServices(servM, servT);
                    acDeconnexion.execute(request, response);

                    break;
                    
                case "historique" :
                    System.out.println("Action d'historique !");
                    ActionHistorique acHistorique = new ActionHistorique();
                    acHistorique.setServices(servM, servT);
                    acHistorique.execute(request, response);

                    break;
                    
                case "export" :
                    System.out.println("Action d'export !");
                    ActionExport acExport = new ActionExport();
                    acExport.setServices(servM, servT);
                    acExport.execute(request, response);

                    break;
            }
        }
    }
    

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet ActionServlet</title>");            
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet ActionServlet at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
