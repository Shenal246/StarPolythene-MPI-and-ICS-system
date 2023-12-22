package com.star.starpolythene.controller;

import com.star.starpolythene.dao.ShopstatusDao;
import com.star.starpolythene.entity.Shopstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/shopstatuses")
public class ShopstatusController {
    @Autowired
    private ShopstatusDao shopstatusDao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Shopstatus> get(){
        List<Shopstatus> shopstatuses = this.shopstatusDao.findAll();
        
        shopstatuses = shopstatuses.stream().map(
                shopstatus -> {
                    Shopstatus d = new Shopstatus();
                    d.setId(shopstatus.getId());
                    d.setName(shopstatus.getName());
                    return d;}
        ).collect(Collectors.toList());
        return shopstatuses;
    }
}
