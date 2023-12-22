package com.star.starpolythene.controller;

import com.star.starpolythene.dao.ThicknessDao;
import com.star.starpolythene.entity.Thickness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/thicknesses")
public class ThicknessController {
    @Autowired
    private ThicknessDao thicknessDao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Thickness> get(){
        List<Thickness> thicknesses = this.thicknessDao.findAll();
        
        thicknesses = thicknesses.stream().map(
                thickness -> {
                    Thickness d = new Thickness();
                    d.setId(thickness.getId());
                    d.setName(thickness.getName());
                    return d;}
        ).collect(Collectors.toList());
        return thicknesses;
    }
}
