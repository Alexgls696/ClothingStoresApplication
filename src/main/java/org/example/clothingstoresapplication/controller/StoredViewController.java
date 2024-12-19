package org.example.clothingstoresapplication.controller;

import org.example.clothingstoresapplication.entity.stored_views_and_functions.CustomerAndHisProduct;
import org.example.clothingstoresapplication.entity.stored_views_and_functions.CustomersAndCountProductsView;
import org.example.clothingstoresapplication.entity.stored_views_and_functions.StoresAndEmployeesCount;
import org.example.clothingstoresapplication.repository.stored_views.StoredViewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/storedViews")
@Transactional
public class StoredViewController {
    private StoredViewsRepository storedViewsRepository;

    @Autowired
    public StoredViewController(StoredViewsRepository storedViewsRepository) {
        this.storedViewsRepository = storedViewsRepository;
    }

    @GetMapping("/customersAndCountProducts")
    public List<CustomersAndCountProductsView> getCusAndCountProducts() {
        return storedViewsRepository.getCustomersAndCountProducts();
    }

    @GetMapping("/storesAndEmployeesCount")
    public List<StoresAndEmployeesCount> getStoredAndEmployeesCount() {
        return storedViewsRepository.getStoresAndEmployeesCount();
    }

    @GetMapping("customersAndTheirProducts")
    public List<CustomerAndHisProduct> getCustomersAndTheirProducts() {
        return storedViewsRepository.getCustomerAndHisProduct();
    }
}
