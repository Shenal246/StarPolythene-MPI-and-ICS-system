package com.star.starpolythene.controller;

import com.star.starpolythene.dao.SupplierDao;
import com.star.starpolythene.entity.Supplier;
import com.star.starpolythene.entity.Supply;
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
@RequestMapping(value = "/suppliers")
public class SupplierController {
    @Autowired
    private SupplierDao supplierDao;

    @GetMapping(produces = "application/json")
        public List<Supplier> get(@RequestParam HashMap<String, String> params){

            String name = params.get("name");
            String tpnumber = params.get("tpnumber");
            String supplierstatusid = params.get("supplierstatusid");
            String materialid = params.get("materialid");


            List<Supplier> suppliers = this.supplierDao.findAll();
            if (params.isEmpty()) return suppliers;
//        return suppliers;

            Stream<Supplier> supstream = suppliers.stream();
                        if (name != null) supstream = supstream.filter(e -> e.getName().toLowerCase().contains(name.toLowerCase()));
                        if (tpnumber != null) supstream = supstream.filter(e -> e.getTpnumber().contains(tpnumber));
                        if (supplierstatusid != null) supstream = supstream.filter(e -> e.getSupplierstatus().getId() == Integer.parseInt(supplierstatusid));
                        if (materialid != null) supstream = supstream.filter(s -> s.getSupplies().stream().anyMatch(sf -> sf.getMaterial().getId()==Integer.parseInt(materialid)));

            return supstream.collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> add(@RequestBody Supplier supplier){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        if(supplierDao.findByPhoneNo(supplier.getTpnumber())!= null)
            errors = errors+"<br> Existing Phone number";

        if(errors==""){
            for(Supply s : supplier.getSupplies()) s.setSupplier(supplier);
            supplierDao.save(supplier);

            responce.put("id",String.valueOf(supplier.getId()));
            responce.put("url","/suppliers/"+supplier.getId());
            responce.put("errors",errors);

            return responce;
        }

        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(supplier.getId()));
        responce.put("url","/suppliers/"+supplier.getId());
        responce.put("errors",errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Supplier supplier) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";


        Supplier extsupplier = supplierDao.findByMyId(supplier.getId());

        if (extsupplier != null) {
            try {
                extsupplier.getSupplies().clear();
                supplier.getSupplies().forEach(newsupply -> {
                    newsupply.setSupplier(extsupplier);
                    extsupplier.getSupplies().add(newsupply);
                    newsupply.setSupplier(extsupplier);
                });

                // Update basic user properties
                BeanUtils.copyProperties(supplier, extsupplier, "id","supplies");

                supplierDao.save(extsupplier); // Save the updated extUser object

                response.put("id", String.valueOf(supplier.getId()));
                response.put("url", "/suppliers/" + supplier.getId());
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

        Supplier existsupplier = supplierDao.findByMyId(id);

        if(existsupplier==null)
            errors = errors+"<br> Supplier Does Not Existed";

        if(errors=="") supplierDao.delete(existsupplier);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/suppliers/"+id);
        responce.put("errors",errors);

        return responce;
    }

}


