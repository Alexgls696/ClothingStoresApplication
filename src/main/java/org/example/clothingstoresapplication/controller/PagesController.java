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

    @RequestMapping("/customers")
    public String showCustomers(){
        return "customers";
    }

    @RequestMapping("/employees")
    public String showEmployees(){
        return "employees";
    }

    @RequestMapping("/orders")
    public String showOrders(){
        return "orders";
    }

    @RequestMapping("/orderProducts")
    public String showOrderProducts(){
        return "order_products";
    }

    @RequestMapping("/orderStatuses")
    public String showOrderStatuses(){
        return "order_statuses";
    }

    @RequestMapping("/products")
    public String showProducts(){
        return "products";
    }

    @RequestMapping("/productTypes")
    public String showProductTypes(){
        return "product_types";
    }

    @RequestMapping("/stores")
    public String shoStores(){
        return "stores";
    }

    @RequestMapping("/suppliers")
    public String showSuppliers(){
        return "suppliers";
    }
}
