package com.star.starpolythene.controller;

import com.star.starpolythene.dao.ProductstatusDao;
import com.star.starpolythene.dao.ProorderstatusDao;
import com.star.starpolythene.entity.Productstatus;
import com.star.starpolythene.entity.Proorderstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/proorderstatuses")
public class ProoderstatusController {

    @Autowired
    private ProorderstatusDao proorderstatusDao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Proorderstatus> get(){
        List<Proorderstatus> proorderstatuses = this.proorderstatusDao.findAll();

        proorderstatuses = proorderstatuses.stream().map(
                productstatus -> {
                    Proorderstatus d = new Proorderstatus();
                    d.setId(productstatus.getId());
                    d.setName(productstatus.getName());
                    return d;}
        ).collect(Collectors.toList());
        return proorderstatuses;
    }
}
