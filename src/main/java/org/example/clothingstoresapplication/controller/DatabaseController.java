package org.example.clothingstoresapplication.controller;

import jakarta.persistence.EntityManagerFactory;
import org.example.clothingstoresapplication.database_configuration.DatabaseCredentials;
import org.example.clothingstoresapplication.database_configuration.DynamicDataSource;
import org.example.clothingstoresapplication.database_configuration.DynamicDatabaseConfig;
import org.example.clothingstoresapplication.repository.DatabaseActionsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/database")
public class DatabaseController {

    @Autowired
    private DatabaseActionsRepository actionsRepository;

    @RequestMapping("/connect")
    public String showConnectPage(){
        return "connect";
    }

    private DynamicDatabaseConfig dynamicDatabaseConfig;

    public static String currentUser = DynamicDatabaseConfig.DEFAULT_USER;
    private String lastUser;
    private String role;

    @Autowired
    public DatabaseController(DynamicDatabaseConfig dynamicDatabaseConfig){
        this.dynamicDatabaseConfig = dynamicDatabaseConfig;
    }

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @PostMapping("/connect")
    public String connect(@ModelAttribute("credentials") DatabaseCredentials credentials, Model model) {
        try {
            String userKey = credentials.getUsername();
            dynamicDatabaseConfig.addDataSource(userKey, credentials);
            DynamicDataSource.setCurrentDataSource(userKey);
            dynamicDatabaseConfig.reconfigureSessionFactoryAndTransactionManager(userKey);
            currentUser = userKey;
            return "redirect:/pages/categories";

        } catch (Exception e) {
            model.addAttribute("message", "Ошибка подключения: " + e.getMessage());
            return "result";
        }
    }


    @GetMapping("getRole")
    public @ResponseBody ResponseEntity<String> getRole(){
        if(!currentUser.equals(lastUser)) {
            lastUser = currentUser;
            String currentRole = actionsRepository.getUserRole();
            role = currentRole;
            return ResponseEntity.ok(currentRole);
        }
        return ResponseEntity.ok(role);
    }


}
