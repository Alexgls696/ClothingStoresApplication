package org.example.clothingstoresapplication.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/pages")
public class PagesController {

    @RequestMapping("/categories")
    public String showCategories(){
        return "categories";
    }
}
