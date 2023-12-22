package com.star.starpolythene.controller;

import com.star.starpolythene.dao.ProductDao;
import com.star.starpolythene.dao.ProductionDao;
import com.star.starpolythene.entity.Production;
import com.star.starpolythene.entity.Product;
import com.star.starpolythene.entity.Production;
import com.star.starpolythene.entity.Productionproduct;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/productions")
public class ProductionController {

    @Autowired
    private ProductionDao productionDao;

    @Autowired
    private ProductDao productDao;

    @GetMapping(produces = "application/json")
    public List<Production> get(@RequestParam HashMap<String, String> params){

        String date = params.get("date");
        String employeeid = params.get("employeeid");
        String proorderid = params.get("proorderid");


        List<Production> productions = this.productionDao.findAll();

//        return productions;
        if (params.isEmpty()) return productions;

        //System.out.println("1111111111");
        Stream<Production> pstream = productions.stream();
        if (date != null) pstream = pstream.filter(e -> e.getDate().toString().equals(date));
        if (employeeid != null) pstream = pstream.filter(e -> e.getEmployee().getId() == Integer.parseInt(employeeid));
        if (proorderid != null) pstream = pstream.filter(e -> e.getProorder().getId() == Integer.parseInt(proorderid));


        return pstream.collect(Collectors.toList());
    }

//    @PostMapping
//    @ResponseStatus(HttpStatus.CREATED)
//    public HashMap<String,String> add(@RequestBody Production production){
//        HashMap<String,String> response = new HashMap<>();
//        String errors = "";
//
//            for(Productionproduct pm : production.getProductionproducts()) pm.setProduction(production);
//            productionDao.save(production);
//
//        response.put("id",String.valueOf(production.getId()));
//        response.put("url","/productions/" + production.getId());
//        response.put("errors",errors);
//
//        return response;
//    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Production production) {
        HashMap<String, String> response = new HashMap<>();
        StringBuilder errors = new StringBuilder();

        // Iterate through the Productionproducts in Production and set the Production reference
        for (Productionproduct productionProduct : production.getProductionproducts()) {
            productionProduct.setProduction(production);
        }

        // Iterate through the Productionproducts again to update Product qty
        for (Productionproduct productionProduct : production.getProductionproducts()) {
            Product product = productionProduct.getProduct();
            BigDecimal qtyToIncrease = productionProduct.getQty();

            // Find the existing product or create a new one if not found
            Product existingProduct = productDao.findById(product.getId()).orElse(product);

            // Calculate the updated qty for the product
            BigDecimal increasedQty = existingProduct.getQty().add(qtyToIncrease);

            // Update the product's qty
            existingProduct.setQty(increasedQty);

            // Save the product with the updated qty
            productDao.save(existingProduct);
        }

        // Save the Production along with the updated Productionproducts
        productionDao.save(production);

        response.put("id", String.valueOf(production.getId()));
        response.put("url", "/productions/" + production.getId());
        response.put("errors", errors.toString());

        return response;
    }


    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Production production) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Production extProduction = productionDao.findByMyId(production.getId());

        if (extProduction != null) {

            try {
                extProduction.getProductionproducts().clear();
                extProduction.getProductionproducts().forEach(newproductionproducts -> {
                    newproductionproducts.setProduction(extProduction);
                    extProduction.getProductionproducts().add(newproductionproducts);
                    newproductionproducts.setProduction(extProduction);
                });

                BeanUtils.copyProperties(production, extProduction, "id","productionproducts");

                productionDao.save(extProduction); // Save the updated extUser object

                response.put("id", String.valueOf(production.getId()));
                response.put("url", "/productions/" + production.getId());
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

        Production emp1 = productionDao.findByMyId(id);

        if(emp1==null)
            errors = errors+"<br> Production Does Not Existed";

        if(errors=="") productionDao.delete(emp1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/productions/"+id);
        responce.put("errors",errors);

        return responce;

    }

}
