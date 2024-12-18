package org.example.clothingstoresapplication.controller;

import org.example.clothingstoresapplication.entity.Category;
import org.example.clothingstoresapplication.entity.Store;
import org.example.clothingstoresapplication.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stores")
@Transactional
public class StoreController {
    private StoreRepository storeRepository;

    @Autowired
    public StoreController(StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    @GetMapping
    public Iterable<Store> getStores() {
        return storeRepository.findAll(Pageable.unpaged());
    }

    @GetMapping("/{id}")
    public Store getStoreById(@PathVariable("id") int id){
        return storeRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Store addStore(@RequestBody Store store) {
        return storeRepository.save(store);
    }

    @PostMapping("/updateAll")
    public void updateAll(@RequestBody List<Store> stores){
        storeRepository.saveAll(stores);
    }

    @PostMapping("/deleteAll")
    public void deleteAll(@RequestBody List<Integer>ids){
        storeRepository.deleteAllById(ids);
    }

    @DeleteMapping("/{id}")
    public void deleteStore(@PathVariable("id") int id){
        storeRepository.deleteById(id);
    }

    private Pageable pageable(Sort sort){
        return Pageable.unpaged(sort);
    }

    @GetMapping("orderById/{type}")
    public Iterable<Store> getCategoriesById(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"storeId");
        return storeRepository.findAllOrderById(pageable(sort));
    }

    @GetMapping("orderByLocation/{type}")
    public Iterable<Store> getCategoriesByLocation(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"location");
        return storeRepository.findAllOrderByLocation(pageable(sort));
    }

    @GetMapping("/findBy")
    public Iterable<Store> getStoresBy(@RequestParam Map<String, String> parameters) {
        String sortType = parameters.get("sortType");
        String sortBy = parameters.get("sortBy");
        String findBy = parameters.get("findBy");
        String findValue = parameters.get("findValue");

        Sort sort = Sort.by(sortType.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);

        return switch (findBy) {
            case "id" -> storeRepository.findAll(pageable(sort));
            case "location" -> storeRepository.findAllByLocationLikeIgnoreCase("%"+findValue+"%", pageable(sort));
            default -> throw new IllegalStateException("Unexpected value: " + findBy);
        };
    }
}