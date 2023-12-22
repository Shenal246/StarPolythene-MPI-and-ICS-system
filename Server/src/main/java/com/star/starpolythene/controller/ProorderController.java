package com.star.starpolythene.controller;

import com.star.starpolythene.dao.ProorderDao;
import com.star.starpolythene.entity.Employee;
import com.star.starpolythene.entity.Proorder;
import com.star.starpolythene.entity.Proorderproduct;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;


import java.sql.Date;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/proorders")
public class ProorderController {

    @Autowired
    private ProorderDao proorderDao;

    @GetMapping(produces = "application/json")
    public List<Proorder> get(@RequestParam HashMap<String, String> params) {

        List<Proorder> proorders = this.proorderDao.findAll();

        if(params.isEmpty())  return proorders;

        String manager = params.get("employee");
        String supervisor = params.get("supervisor");
        String statusid= params.get("statusid");


        Stream<Proorder> istream = proorders.stream();

        if(manager!=null) istream = istream.filter(i -> i.getEmployee().getCallingname().equals(manager));
        if(supervisor!=null) istream = istream.filter(i -> i.getSupervisor().getCallingname().equals(supervisor));
        if(statusid!=null) istream = istream.filter(i -> i.getProorderstatus().getId()==Integer.parseInt(statusid));


        return istream.collect(Collectors.toList());

    }

    @GetMapping(path ="/list",produces = "application/json")
    public List<Proorder> getList() {

        List<Proorder> proorders = this.proorderDao.findAllCodeDate();

        return proorders;

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Proorder proorder) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if(proorderDao.findProorderByCode(proorder.getCode())!=null)
            errors = errors+"<br> Existing Code";

        LocalDate today = LocalDate.now();
        proorder.setDate(Date.valueOf(today));

        for (Proorderproduct i : proorder.getProorderproducts()) {
            i.setProorder(proorder);
            //System.out.println("ppppppp-" + i.getItem().getName() + "-" + i.getLinetotal() );
        }

        proorderDao.save(proorder);

        response.put("id", String.valueOf(proorder.getId()));
        response.put("url", "/proorders/" + proorder.getId());
        response.put("errors", errors);

        return response;

    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Proorder proorder) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Proorder extProorders = proorderDao.findProorderByCode(proorder.getCode());
        System.out.println(extProorders.getId());

        if (extProorders != null) {

            try {
                extProorders.getProorderproducts().clear();
                proorder.getProorderproducts().forEach(newproorders -> {
                    newproorders.setProorder(extProorders);
                    extProorders.getProorderproducts().add(newproorders);
                    newproorders.setProorder(extProorders);
                });

                BeanUtils.copyProperties(proorder, extProorders, "id","code","proorderproducts");

                proorderDao.save(extProorders); // Save the updated extUser object

                response.put("id", String.valueOf(proorder.getId()));
                response.put("url", "/proorders/" + proorder.getId());
                response.put("errors", errors);


            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return response;
    }


    @DeleteMapping("/{code}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable String code){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";
        System.out.println(code);
        Proorder proorder1 = proorderDao.findProorderByCode(code);

        if(proorder1==null)
            errors = errors+"<br> Invoice Does Not Existed";

        if(errors=="") proorderDao.delete(proorder1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("code",String.valueOf(code));
        responce.put("url","/code/"+code);
        responce.put("errors",errors);

        return responce;
    }

}
