package com.star.starpolythene.controller;

import com.star.starpolythene.dao.InvoicestatusDao;
import com.star.starpolythene.entity.Invoicestatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/invoicestatuses")
public class InvoicestatusController {
    @Autowired
    private InvoicestatusDao invoicestatusDao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Invoicestatus> get(){
        List<Invoicestatus> invoicestatuss = this.invoicestatusDao.findAll();
        
        invoicestatuss = invoicestatuss.stream().map(
                invoicestatus -> {
                    Invoicestatus d = new Invoicestatus();
                    d.setId(invoicestatus.getId());
                    d.setName(invoicestatus.getName());
                    return d;}
        ).collect(Collectors.toList());
        return invoicestatuss;
    }
}
