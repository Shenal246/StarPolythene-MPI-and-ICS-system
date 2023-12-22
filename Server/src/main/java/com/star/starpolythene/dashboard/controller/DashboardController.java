package com.star.starpolythene.dashboard.controller;

import com.star.starpolythene.dashboard.dao.ProductdashboardDao;
import com.star.starpolythene.dashboard.dao.SalesdashboardDao;
import com.star.starpolythene.dashboard.entity.Productdashboard;
import com.star.starpolythene.dashboard.entity.Salesdashboard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;



@CrossOrigin
@RestController
@RequestMapping(value = "/dashboard")
public class DashboardController {

    @Autowired private ProductdashboardDao productdashboardDao;
    @Autowired private SalesdashboardDao salesdashboardDao;


    @GetMapping(path = "/productdashboard", produces = "application/json")
    public Productdashboard getTotal() {
        return productdashboardDao.findTotal();
    }

    @GetMapping(path = "/salesdashboard", produces = "application/json")
    public Salesdashboard getTotalSales() {
        return salesdashboardDao.findTotal();
    }
}
