package com.star.starpolythene.controller;

import com.star.starpolythene.dao.ProductstatusDao;
import com.star.starpolythene.entity.Productstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/productstatuses")
public class ProductstatusController {
    @Autowired
    private ProductstatusDao productstatusDao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Productstatus> get(){
        List<Productstatus> productstatuses = this.productstatusDao.findAll();
        
        productstatuses = productstatuses.stream().map(
                productstatus -> {
                    Productstatus d = new Productstatus();
                    d.setId(productstatus.getId());
                    d.setName(productstatus.getName());
                    return d;}
        ).collect(Collectors.toList());
        return productstatuses;
    }
}
