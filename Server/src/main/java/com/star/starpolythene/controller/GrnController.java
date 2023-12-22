package com.star.starpolythene.controller;

import com.star.starpolythene.dao.GrnDao;

import com.star.starpolythene.dao.MaterialDao;
import com.star.starpolythene.entity.Employee;
import com.star.starpolythene.entity.Grn;
import com.star.starpolythene.entity.Grnmaterial;
import com.star.starpolythene.entity.Material;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/grns")
public class GrnController {
    @Autowired
    private GrnDao grndao;

    @Autowired
    private MaterialDao materialDao;

    @GetMapping(produces = "application/json")
    public List<Grn> get(@RequestParam HashMap<String,String> params){

        String sotorekeeperid = params.get("sotorekeeperid");
        String ordate  = params.get("date");
        String statusid = params.get("statusid");

        List<Grn> grns = this.grndao.findAll();
        if (params.isEmpty()) return grns;

        Stream<Grn> gstream = grns.stream();
        if (sotorekeeperid != null) gstream = gstream.filter(g -> g.getEmployee().getId() == Integer.parseInt(sotorekeeperid));
        if (ordate != null) gstream = gstream.filter(g -> g.getPurorder().getDate().toString().equals(ordate));
        if (statusid != null) gstream = gstream.filter(g -> g.getGrnstatus().getId() == Integer.parseInt(statusid));

        return gstream.collect(Collectors.toList());

    }

//    @PostMapping
//    @ResponseStatus(HttpStatus.CREATED)
//    public HashMap<String,String> add(@RequestBody Grn grn){
//        HashMap<String,String> response = new HashMap<>();
//
//        String errors = "";
//        for (Grnmaterial m : grn.getGrnmaterials()) m.setGrn(grn);
//        grndao.save(grn);
//
//        response.put("id",String.valueOf(grn.getId()));
//        response.put("url","/grns/" + grn.getId());
//        response.put("errors",errors);
//
//        return response;
//    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Grn grn) {
        HashMap<String, String> response = new HashMap<>();
        StringBuilder errors = new StringBuilder();

        // Iterate through the Grnmaterials in Grn and set the Grn reference
        for (Grnmaterial grnMaterial : grn.getGrnmaterials()) {
            grnMaterial.setGrn(grn);
        }

        // Iterate through the Grnmaterials again to update Material unitprice and qty
        for (Grnmaterial grnMaterial : grn.getGrnmaterials()) {
            Material material = grnMaterial.getMaterial();
            BigDecimal unitCost = grnMaterial.getUnitcost();
            BigDecimal qtyToIncrease = grnMaterial.getQty();

            // Find the existing material or create a new one if not found
            Material existingMaterial = materialDao.findById(material.getId()).orElse(material);

            // Calculate the updated qty for the material
            BigDecimal increasedQty = existingMaterial.getQty().add(qtyToIncrease);

            // Update the material's qty and unitprice
            existingMaterial.setQty(increasedQty);
            existingMaterial.setUnitprice(unitCost); // Set unitprice as unitcost for simplicity, you can customize the logic here.

            // Save the material with the updated qty and unitprice
            materialDao.save(existingMaterial);
        }

        // Save the Grn along with the updated Grnmaterials
        grndao.save(grn);

        response.put("id", String.valueOf(grn.getId()));
        response.put("url", "/grns/" + grn.getId());
        response.put("errors", errors.toString());

        return response;
    }



    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Grn grn) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Grn extGrn = grndao.findByMyId(grn.getId());

        if (extGrn != null) {

            try {
                extGrn.getGrnmaterials().clear();
                extGrn.getGrnmaterials().forEach(newgrnmaterials -> {
                    newgrnmaterials.setGrn(extGrn);
                    extGrn.getGrnmaterials().add(newgrnmaterials);
                    newgrnmaterials.setGrn(extGrn);
                });

                BeanUtils.copyProperties(grn, extGrn, "id","grnmaterials");

                grndao.save(extGrn); // Save the updated extUser object

                response.put("id", String.valueOf(grn.getId()));
                response.put("url", "/grns/" + grn.getId());
                response.put("errors", errors);


            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return response;
    }


//    @DeleteMapping("/{id}")
//    @ResponseStatus(HttpStatus.CREATED)
//    public HashMap<String,String> delete(@PathVariable Integer id){
//
//        HashMap<String,String> responce = new HashMap<>();
//        String errors="";
//
//        Grn grn1 = grndao.findByMyId(id);
//
//        if(grn1==null)
//            errors = errors+"<br> GRN Does Not Existed";
//
//        if(errors=="") grndao.delete(grn1);
//        else errors = "Server Validation Errors : <br> "+errors;
//
//        responce.put("id",String.valueOf(id));
//        responce.put("url","/grns/"+id);
//        responce.put("errors",errors);
//
//        return responce;
//
//    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Grn grnToDelete = grndao.findByMyId(id);

        if (grnToDelete == null)
            errors = errors + "<br> GRN Does Not Exist";

        if (errors.isEmpty()) {
            // Step 2: Get associated Grnmaterial records
            Collection<Grnmaterial> grnmaterials = grnToDelete.getGrnmaterials();

            // Step 3: Update Material entities' qty
            for (Grnmaterial grnmaterial : grnmaterials) {
                Material materialToUpdate = grnmaterial.getMaterial();
                BigDecimal currentQty = materialToUpdate.getQty();
                BigDecimal grnmaterialQty = grnmaterial.getQty();
                materialToUpdate.setQty(currentQty.subtract(grnmaterialQty));
                // Step 4: Save the updated Material entities to the database
                materialDao.save(materialToUpdate);
            }

            // Step 5: Finally, delete the Grn entity
            grndao.delete(grnToDelete);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("id", String.valueOf(id));
        response.put("url", "/grns/" + id);
        response.put("errors", errors);

        return response;
    }

}


