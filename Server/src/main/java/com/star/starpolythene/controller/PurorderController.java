package com.star.starpolythene.controller;


import com.star.starpolythene.dao.PurorderDao;
import com.star.starpolythene.entity.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@CrossOrigin
@RestController
@RequestMapping(value = "/purorders")
public class PurorderController {

    @Autowired
    private PurorderDao purorderdao;

    @GetMapping(produces = "application/json")
    public List<Purorder> get(@RequestParam HashMap<String, String> params) {

        List<Purorder> purorders = this.purorderdao.findAll();

        if(params.isEmpty())  return purorders;

        String supplierid = params.get("supplierid");
        String employeeid = params.get("employeeid");
        String statusid= params.get("statusid");


        Stream<Purorder> istream = purorders.stream();

        if(supplierid!=null) istream = istream.filter(i -> i.getSupplier().getId()==Integer.parseInt(supplierid));
        if(employeeid!=null) istream = istream.filter(i -> i.getEmployee().getId()==Integer.parseInt(employeeid));
        if(statusid!=null) istream = istream.filter(i -> i.getPurorderstatus().getId()==Integer.parseInt(statusid));


        return istream.collect(Collectors.toList());

    }

    @GetMapping(path ="/list",produces = "application/json")
    public List<Purorder> getList() {

        List<Purorder> purorders = this.purorderdao.findAllList();

        return purorders;

    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Purorder purorder) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if(purorderdao.findPurorderByCode(purorder.getCode())!=null)
            errors = errors+"<br> Existing Code";

        for (Purordermaterial i : purorder.getPurordermaterials()) i.setPurorder(purorder);

        purorderdao.save(purorder);

        response.put("id", String.valueOf(purorder.getId()));
        response.put("url", "/purorders/" + purorder.getId());
        response.put("errors", errors);

        return response;

    }


    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Purorder purorder) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Purorder extPurorder = purorderdao.findByMyId(purorder.getId());


        if (extPurorder != null) {

            try {
                extPurorder.getPurordermaterials().clear();
                purorder.getPurordermaterials().forEach(newpurorderitem -> {
                    newpurorderitem.setPurorder(extPurorder);
                    extPurorder.getPurordermaterials().add(newpurorderitem);
                    newpurorderitem.setPurorder(extPurorder);
                });

                BeanUtils.copyProperties(purorder, extPurorder, "id","purordermaterials");

                purorderdao.save(extPurorder); // Save the updated extPurorder object

                response.put("id", String.valueOf(purorder.getId()));
                response.put("url", "/purorders/" + purorder.getId());
                response.put("errors", errors);


            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return response;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Purorder inv1 = purorderdao.findByMyId(id);

        if(inv1==null)
            errors = errors+"<br> Purorder Does Not Existed";

        if(errors=="") purorderdao.delete(inv1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("code",String.valueOf(id));
        responce.put("url","/purorders/"+id);
        responce.put("errors",errors);

        return responce;
    }



}


