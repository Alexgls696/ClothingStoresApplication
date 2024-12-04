package org.example.clothingstoresapplication.controller;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import org.example.clothingstoresapplication.database_configuration.DatabaseCredentials;
import org.example.clothingstoresapplication.database_configuration.DatabaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/database")
public class DatabaseController {
    private DatabaseService databaseService;
    @RequestMapping("/connect")
    public String showConnectPage(){
        return "connect";
    }

    @PostMapping("/connect")
    public String connect(@ModelAttribute("credentials") DatabaseCredentials credentials, Model model) {
        try {
            databaseService.configureDatabase(credentials);
            model.addAttribute("message", "Подключение успешно!");
        } catch (Exception e) {
            model.addAttribute("message", "Ошибка подключения: " + e.getMessage());
        }
        return "result"; // Страница результата
    }

    @Autowired
    public void setDatabaseService(DatabaseService databaseService) {
        this.databaseService = databaseService;
    }
}
