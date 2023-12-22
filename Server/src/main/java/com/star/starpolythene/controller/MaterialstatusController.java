package com.star.starpolythene.controller;

import com.star.starpolythene.dao.MaterialstatusDao;
import com.star.starpolythene.entity.Materialstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/materialstatuses")
public class MaterialstatusController {
    @Autowired
    private MaterialstatusDao materialstatusDao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Materialstatus> get(){
        List<Materialstatus> materialstatuses = this.materialstatusDao.findAll();
        
        materialstatuses = materialstatuses.stream().map(
                materialstatus -> {
                    Materialstatus d = new Materialstatus();
                    d.setId(materialstatus.getId());
                    d.setName(materialstatus.getName());
                    return d;}
        ).collect(Collectors.toList());
        return materialstatuses;
    }
}
