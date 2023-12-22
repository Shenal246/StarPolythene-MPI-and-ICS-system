package com.star.starpolythene.controller;

import com.star.starpolythene.dao.ProducttypeDao;
import com.star.starpolythene.entity.Producttype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/producttypes")
public class ProducttypeController {
    @Autowired
    private ProducttypeDao producttypeDao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Producttype> get(){
        List<Producttype> producttypes = this.producttypeDao.findAll();
        
        producttypes = producttypes.stream().map(
                producttype -> {
                    Producttype d = new Producttype();
                    d.setId(producttype.getId());
                    d.setName(producttype.getName());
                    return d;}
        ).collect(Collectors.toList());
        return producttypes;
    }
}
