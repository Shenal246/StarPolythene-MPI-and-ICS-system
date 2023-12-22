package com.star.starpolythene.controller;


import com.star.starpolythene.dao.PrivilageDao;
import com.star.starpolythene.entity.Privilage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
    @RequestMapping(value = "/privileges")
public class PrivilageController {

    @Autowired
    private PrivilageDao privilagedao;

    @GetMapping(produces = "application/json")
    public List<Privilage> get(@RequestParam HashMap<String, String> params) {

        List<Privilage> privilages = this.privilagedao.findAll();

        if(params.isEmpty())  return privilages;

        String roleid= params.get("roleid");
        String moduleid= params.get("moduleid");
        String operationid= params.get("operationid");

        Stream<Privilage> pstream = privilages.stream();

        if(roleid!=null) pstream = pstream.filter(p -> p.getRole().getId()==Integer.parseInt(roleid));
        if(moduleid!=null) pstream = pstream.filter(p -> p.getModule().getId()==Integer.parseInt(moduleid));
        if(operationid!=null) pstream = pstream.filter(p -> p.getOperation().getId()==Integer.parseInt(operationid));

        return pstream.collect(Collectors.toList());

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> add(@RequestBody Privilage privilage){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";


        if(errors=="")
            privilagedao.save(privilage);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(privilage.getId()));
        responce.put("url","/privilages/"+privilage.getId());
        responce.put("errors",errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> update(@RequestBody Privilage privilage){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        if(errors=="") privilagedao.save(privilage);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(privilage.getId()));
        responce.put("url","/employees/"+privilage.getId());
        responce.put("errors",errors);

        return responce;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        System.out.println(id);

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Privilage prv = privilagedao.findByMyId(id);

        if(prv==null)
            errors = errors+"<br> Employee Does Not Existed";

        if(errors=="") privilagedao.delete(prv);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/privileges/"+id);
        responce.put("errors",errors);

        return responce;
    }

}


