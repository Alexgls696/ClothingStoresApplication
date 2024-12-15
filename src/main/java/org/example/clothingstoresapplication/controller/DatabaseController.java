package org.example.clothingstoresapplication.controller;

import lombok.RequiredArgsConstructor;
import org.example.clothingstoresapplication.database_configuration.ApplicationContextProvider;
import org.example.clothingstoresapplication.database_configuration.DatabaseCredentials;
import org.example.clothingstoresapplication.database_configuration.DynamicDataSource;
import org.example.clothingstoresapplication.database_configuration.DynamicDatabaseConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/database")
public class DatabaseController {

    @RequestMapping("/connect")
    public String showConnectPage(){
        return "connect";
    }

    private DynamicDatabaseConfig dynamicDatabaseConfig;

    @Autowired
    public DatabaseController(DynamicDatabaseConfig dynamicDatabaseConfig){
        this.dynamicDatabaseConfig = dynamicDatabaseConfig;
    }
    @PostMapping("/connect")
    public String connect(@ModelAttribute("credentials") DatabaseCredentials credentials, Model model) {
        try {
            String userKey = credentials.getUsername();
            dynamicDatabaseConfig.addDataSource(userKey, credentials);
            DynamicDataSource.setCurrentDataSource(userKey);
            dynamicDatabaseConfig.reconfigureSessionFactoryAndTransactionManager(userKey);

            model.addAttribute("message", "Подключение успешно!");
        } catch (Exception e) {
            model.addAttribute("message", "Ошибка подключения: " + e.getMessage());
        }
        return "result"; // Страница результата
    }
}
