package com.star.starpolythene.controller;

import com.star.starpolythene.dao.MaterialDao;
import com.star.starpolythene.dao.MatissueDao;
import com.star.starpolythene.entity.Material;
import com.star.starpolythene.entity.Matissue;
import com.star.starpolythene.entity.Matissuematerial;
import com.star.starpolythene.entity.Proorder;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.math.BigDecimal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@CrossOrigin
@RestController
@RequestMapping(value = "/matissues")
public class MatissueController {

    @Autowired
    private MatissueDao matissueDao;

    @Autowired
    private MaterialDao materialDao;

    @GetMapping(produces = "application/json")
    public List<Matissue> get(@RequestParam HashMap<String, String> params){

        String employeeid = params.get("employeeid");
        String proorderid = params.get("proorderid");


        List<Matissue> matissues = this.matissueDao.findAll();
//        return matissues;
        if (params.isEmpty()) return matissues;

        //System.out.println("1111111111");
        Stream<Matissue> pstream = matissues.stream();
        if (employeeid != null) pstream = pstream.filter(e -> e.getEmployee().getId() == Integer.parseInt(employeeid));
        if (proorderid != null) pstream = pstream.filter(e -> e.getProorder().getId() == Integer.parseInt(proorderid));


        return pstream.collect(Collectors.toList());
    }

//    @PostMapping
//    @ResponseStatus(HttpStatus.CREATED)
//    public HashMap<String,String> add(@RequestBody Matissue matissue){
//        HashMap<String,String> response = new HashMap<>();
//        String errors = "";
//
//            for(Matissuematerial pm : matissue.getMatissuematerials()) pm.setMatissue(matissue);
//            matissueDao.save(matissue);
//
//        response.put("id",String.valueOf(matissue.getId()));
//        response.put("url","/matissues/" + matissue.getId());
//        response.put("errors",errors);
//
//        return response;
//    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Matissue matissue) {
        HashMap<String, String> response = new HashMap<>();
        StringBuilder errors = new StringBuilder();

        for (Matissuematerial pm : matissue.getMatissuematerials()) {
            pm.setMatissue(matissue);

            Material material = pm.getMaterial();
            BigDecimal qtyToReduce = pm.getQty();

            // Find the existing material or create a new one if not found
            Material existingMaterial = materialDao.findById(material.getId()).orElse(material);

            // Calculate the reduced qty for the material
            BigDecimal reducedQty = existingMaterial.getQty().subtract(qtyToReduce);

//            if (reducedQty.compareTo(BigDecimal.ZERO) < 0) {
//                // Handle the case where the qty would become negative (if needed)
//                throw new IllegalArgumentException("Insufficient material quantity.");
//            }

            // Check if the quantity after reduction is less than the reorder point (ROP)
            if (reducedQty.compareTo(existingMaterial.getRop()) < 0) {
                // Append the error message to the errors variable
                errors.append(material.getName()).append("  - Material quantity will be less than the reorder point (ROP) ")
                        .append(". <br>");
            } else {
                // Update the material's qty if there's no error
                existingMaterial.setQty(reducedQty);

                // Save the material with the updated qty
                materialDao.save(existingMaterial);
            }
        }

        if (errors.length() == 0) {
            // Save the Matissue along with the updated Matissuematerials only if there are no errors
            matissueDao.save(matissue);
        }

        response.put("id", String.valueOf(matissue.getId()));
        response.put("url", "/matissues/" + matissue.getId());
        response.put("errors", errors.toString());

        return response;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Matissue matissues) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Matissue extMatissues = matissueDao.findByMyId(matissues.getId());

        if (extMatissues != null) {

            try {
                extMatissues.getMatissuematerials().clear();
                matissues.getMatissuematerials().forEach(newmatissues -> {
                    newmatissues.setMatissue(extMatissues);
                    extMatissues.getMatissuematerials().add(newmatissues);
                    newmatissues.setMatissue(extMatissues);
                });

                BeanUtils.copyProperties(matissues, extMatissues, "id","matissuematerials");

                matissueDao.save(extMatissues); // Save the updated extUser object

                response.put("id", String.valueOf(matissues.getId()));
                response.put("url", "/matissues/" + matissues.getId());
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
//        HashMap<String,String> responce = new HashMap<>();
//        String errors="";
//
//        Matissue emp1 = matissueDao.findByMyId(id);
//
//        if(emp1==null)
//            errors = errors+"<br> Matissue Does Not Existed";
//
//        if(errors=="") matissueDao.delete(emp1);
//        else errors = "Server Validation Errors : <br> "+errors;
//
//        responce.put("id",String.valueOf(id));
//        responce.put("url","/matissues/"+id);
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

        Matissue matissueToDelete = matissueDao.findByMyId(id);

        if (matissueToDelete == null)
            errors = errors + "<br> Matissue Does Not Exist";

        if (errors.isEmpty()) {
            // Step 2: Get associated Matissuematerial records
            Collection<Matissuematerial> matissuematerials = matissueToDelete.getMatissuematerials();

            // Step 3: Update Material entities' qty
            for (Matissuematerial matissuematerial : matissuematerials) {
                Material materialToUpdate = matissuematerial.getMaterial();
                BigDecimal currentQty = materialToUpdate.getQty();
                BigDecimal matissuematerialQty = matissuematerial.getQty();
                materialToUpdate.setQty(currentQty.add(matissuematerialQty));
                // Step 4: Save the updated Material entities to the database
                materialDao.save(materialToUpdate);
            }

            // Step 5: Finally, delete the Matissue entity
            matissueDao.delete(matissueToDelete);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("id", String.valueOf(id));
        response.put("url", "/matissues/" + id);
        response.put("errors", errors);

        return response;
    }

}
