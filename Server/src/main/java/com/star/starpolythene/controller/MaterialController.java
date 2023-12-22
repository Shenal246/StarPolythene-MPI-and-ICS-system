package com.star.starpolythene.controller;

import com.star.starpolythene.dao.MaterialDao;
import com.star.starpolythene.entity.Employee;
import com.star.starpolythene.entity.Material;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/materials")
public class MaterialController {

    @Autowired
    private MaterialDao materialDao;

    @GetMapping(produces = "application/json")
    public List<Material> get(@RequestParam HashMap<String, String> params){

        String code = params.get("code");
        String name = params.get("name");
        String qty = params.get("qty");
        String materialcategoryid = params.get("materialcategoryid");
        String materialstatusid = params.get("materialstatusid");


        List<Material> materials = this.materialDao.findAll();
        if (params.isEmpty()) return materials;

        //System.out.println("1111111111");
        Stream<Material> mstream = materials.stream();
        if (code != null){
            mstream = mstream.filter(e -> e.getCode().equalsIgnoreCase(code));
            //System.out.println("222222222222");
        }

        if (name != null) mstream = mstream.filter(e -> e.getName().toLowerCase().contains(name.toLowerCase()));
        if (qty != null) mstream = mstream.filter(e -> e.getQty().toString().contains(qty));
        if (materialcategoryid != null) mstream = mstream.filter(e -> e.getMaterialcategory().getId() == Integer.parseInt(materialcategoryid));
        if (materialstatusid != null) mstream = mstream.filter(e -> e.getMaterialstatus().getId() == Integer.parseInt(materialstatusid));


        return mstream.collect(Collectors.toList());
    }

    @GetMapping(path ="/list",produces = "application/json")
    public List<Material> getList() {

        List<Material> materials = this.materialDao.findAllNameId();
//
//        materials = materials.stream().map(
//                material -> {
//                    Material e = new Material(material.getId(), material.getCode(),material.getName());
//                    return  e;
//                }
//        ).collect(Collectors.toList());

        return materials;

    }

    @GetMapping(path ="/list/list",produces = "application/json")
    public List<Material> getListList() {

        List<Material> materials = this.materialDao.findAllLit();

        return materials;

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> add(@RequestBody Material material){
        HashMap<String,String> response = new HashMap<>();
        String errors = "";

        if (materialDao.findByCode(material.getCode()) != null)
            errors = errors + "<br> Existing Code";
//        if (materialDao.findById(material.getId()) != null)
//            errors = errors + "<br> Existing Id";

        if (errors == "")
            materialDao.save(material);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",String.valueOf(material.getId()));
        response.put("url","/materials/" + material.getId());
        response.put("errors",errors);

        return response;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> update(@RequestBody Material material){
        HashMap<String,String> response = new HashMap<>();
        String errors = "";

        Material emp2 = materialDao.findByCode(material.getCode());

        if (emp2 != null && material.getId() != emp2.getId())
            errors = errors + "<br> Existing Code";

        if (errors == "")
            materialDao.save(material);
        else
            errors = "Server validation Errors : <br> " + errors;

        response.put("id",String.valueOf(material.getId()));
        response.put("url","/materials/" + material.getId());
        response.put("errors",errors);

        return response;

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){
        System.out.println(id);
        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Material emp1 = materialDao.findByMyId(id);

        if(emp1==null)
            errors = errors+"<br> Material Does Not Existed";

        if(errors=="") materialDao.delete(emp1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/materials/"+id);
        responce.put("errors",errors);

        return responce;

    }

}
