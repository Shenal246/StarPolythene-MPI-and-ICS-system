package com.star.starpolythene.controller;

import com.star.starpolythene.dao.MaterialcategoryDao;
import com.star.starpolythene.entity.Materialcategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/materialcategories")
public class MaterialcategoryController {
    @Autowired
    private MaterialcategoryDao materialcategoryDao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Materialcategory> get(){
        List<Materialcategory> materialcategories = this.materialcategoryDao.findAll();
        
        materialcategories = materialcategories.stream().map(
                materialcategory -> {
                    Materialcategory d = new Materialcategory();
                    d.setId(materialcategory.getId());
                    d.setName(materialcategory.getName());
                    return d;}
        ).collect(Collectors.toList());
        return materialcategories;
    }
}
