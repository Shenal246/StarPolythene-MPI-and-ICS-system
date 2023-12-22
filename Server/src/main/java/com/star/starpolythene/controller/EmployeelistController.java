//package com.star.starpolythene.controller;
//
//import com.star.starpolythene.dao.EmployeeDao;
//import com.star.starpolythene.entity.Employeelist;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@CrossOrigin
//@RestController
//@RequestMapping(value = "/employeelists")
//public class EmployeelistController {
//    @Autowired
//    private EmployeeDao employeedao;
//
//    @GetMapping(path ="/list", produces = "application/json")
//    public List<Employeelist> get(){
//        List<Employeelist> employeelists = this.employeedao.findAllList();
//
//        employeelists = employeelists.stream().map(
//                employeelist -> {
//                    Employeelist d = new Employeelist();
//                    d.setId(employeelist.getId());
//                    d.setCallingname(employeelist.getCallingname());
//                    return d;}
//        ).collect(Collectors.toList());
//        return employeelists;
//    }
//}
