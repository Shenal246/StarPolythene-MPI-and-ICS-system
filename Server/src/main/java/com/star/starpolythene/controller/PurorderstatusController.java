package com.star.starpolythene.controller;

import com.star.starpolythene.dao.PurorderstatusDao;
import com.star.starpolythene.entity.Purorderstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/purorderstatuses")
public class PurorderstatusController {
    @Autowired
    private PurorderstatusDao purorderstatusDao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Purorderstatus> get(){
        List<Purorderstatus> purorderstatuses = this.purorderstatusDao.findAll();

        purorderstatuses = purorderstatuses.stream().map(
                productstatus -> {
                    Purorderstatus d = new Purorderstatus();
                    d.setId(productstatus.getId());
                    d.setName(productstatus.getName());
                    return d;}
        ).collect(Collectors.toList());
        return purorderstatuses;
    }
}
