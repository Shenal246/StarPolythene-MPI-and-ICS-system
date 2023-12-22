package com.star.starpolythene.controller;

import com.star.starpolythene.dao.PaymenttypeDao;
import com.star.starpolythene.entity.Paymenttype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/paymenttypes")
public class PaymenttypeController {
    @Autowired
    private PaymenttypeDao paymenttypeDao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Paymenttype> get(){
        List<Paymenttype> paymenttypes = this.paymenttypeDao.findAll();
        
        paymenttypes = paymenttypes.stream().map(
                paymenttype -> {
                    Paymenttype d = new Paymenttype();
                    d.setId(paymenttype.getId());
                    d.setName(paymenttype.getName());
                    return d;}
        ).collect(Collectors.toList());
        return paymenttypes;
    }
}
