package org.example.clothingstoresapplication.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/pages")
public class PagesController {

    public String getCurrentUser(){
        try {
            return DatabaseController.currentUser;
        }catch (Exception e){
            return null;
        }
    }

    @RequestMapping("/categories")
    public String showCategories(Model model){
        var user = getCurrentUser();
        model.addAttribute("user",user);
        return "categories";
    }

    @RequestMapping("/customers")
    public String showCustomers(Model model){
        var user = getCurrentUser();
        model.addAttribute("user",user);
        return "customers";
    }

    @RequestMapping("/employees")
    public String showEmployees(Model model){
        var user = getCurrentUser();
        model.addAttribute("user",user);
        return "employees";
    }

    @RequestMapping("/orders")
    public String showOrders(Model model){
        var user = getCurrentUser();
        model.addAttribute("user",user);
        return "orders";
    }

    @RequestMapping("/orderProducts")
    public String showOrderProducts(Model model){
        var user = getCurrentUser();
        model.addAttribute("user",user);
        return "order_products";
    }

    @RequestMapping("/orderStatuses")
    public String showOrderStatuses(Model model){
        var user = getCurrentUser();
        model.addAttribute("user",user);
        return "order_statuses";
    }

    @RequestMapping("/products")
    public String showProducts(Model model){
        var user = getCurrentUser();
        model.addAttribute("user",user);
        return "products";
    }

    @RequestMapping("/productTypes")
    public String showProductTypes(Model model){
        var user = getCurrentUser();
        model.addAttribute("user",user);
        return "product_types";
    }

    @RequestMapping("/stores")
    public String shoStores(Model model){
        var user = getCurrentUser();
        model.addAttribute("user",user);
        return "stores";
    }

    @RequestMapping("/suppliers")
    public String showSuppliers(Model model){
        var user = getCurrentUser();
        model.addAttribute("user",user);
        return "suppliers";
    }
}
