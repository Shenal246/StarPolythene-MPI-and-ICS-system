package com.star.starpolythene.controller;

import com.star.starpolythene.dao.OperationDao;
import com.star.starpolythene.entity.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/operations")
public class OperationController {

    @Autowired
    private OperationDao operationdao;

    @GetMapping(path ="/list",produces = "application/json")
    public List<Operation> get() {

        List<Operation> operations = this.operationdao.findAll();

        operations = operations.stream().map(operation -> {
            Operation o = new Operation();
            o.setId(operation.getId());
            o.setName(operation.getName());
            o.setModule(operation.getModule());

            return o;
        }).collect(Collectors.toList());


        return operations;

    }

}


