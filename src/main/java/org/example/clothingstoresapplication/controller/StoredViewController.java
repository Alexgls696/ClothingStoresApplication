package org.example.clothingstoresapplication.controller;

import org.example.clothingstoresapplication.entity.Employee;
import org.example.clothingstoresapplication.entity.stored_views.CustomerAndHisProduct;
import org.example.clothingstoresapplication.entity.stored_views.CustomersAndCountProductsView;
import org.example.clothingstoresapplication.entity.stored_views.StoresAndEmployeesCount;
import org.example.clothingstoresapplication.repository.stored_views.StoredViewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/storedViews")
public class StoredViewController {
    private StoredViewsRepository storedViewsRepository;

    @Autowired
    public StoredViewController(StoredViewsRepository storedViewsRepository) {
        this.storedViewsRepository = storedViewsRepository;
    }

    @GetMapping("/employersAndCountProducts")
    public List<CustomersAndCountProductsView> getEmployersAndCountProducts() {
        return storedViewsRepository.getEmployersAndCountProducts();
    }

    @GetMapping("/storedAndEmployeesCount")
    public List<StoresAndEmployeesCount> getStoredAndEmployeesCount() {
        return storedViewsRepository.getStoresAndEmployeesCount();
    }

    @GetMapping("customersAndTheirProducts")
    public List<CustomerAndHisProduct> getCustomersAndTheirProducts() {
        return storedViewsRepository.getCustomerAndHisProduct();
    }
}
