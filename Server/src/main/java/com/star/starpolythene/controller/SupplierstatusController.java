package com.star.starpolythene.controller;

import com.star.starpolythene.dao.SupplierstatusDao;
import com.star.starpolythene.entity.Supplierstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/supplierstatuses")
public class SupplierstatusController {
    @Autowired
    private SupplierstatusDao supplierstatusDao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Supplierstatus> get(){
        List<Supplierstatus> supplierstatuses = this.supplierstatusDao.findAll();
        
        supplierstatuses = supplierstatuses.stream().map(
                supplierstatus -> {
                    Supplierstatus d = new Supplierstatus();
                    d.setId(supplierstatus.getId());
                    d.setName(supplierstatus.getName());
                    return d;}
        ).collect(Collectors.toList());
        return supplierstatuses;
    }
}
