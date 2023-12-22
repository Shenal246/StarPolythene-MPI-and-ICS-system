package com.star.starpolythene.controller;

import com.star.starpolythene.dao.SupplyDao;
import com.star.starpolythene.entity.Supply;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/supplies")
public class SupplyController {
    @Autowired
    private SupplyDao supplyDao;

    @GetMapping( path = "/list", produces = "application/json")
    public List<Supply> get() {

        List<Supply> supplies = this.supplyDao.findAll();

//        supplies = supplies.stream().map(
//                supply -> { supplies sf = new Supply();
//                    sf.setId(supply.getId());
//                    sf.setSupplier(supply.getSupplier());
//                    sf.setFertilizer(supply.getFertilizer());
//                    return sf; }
//        ).collect(Collectors.toList());

        return supplies;
    }

}


