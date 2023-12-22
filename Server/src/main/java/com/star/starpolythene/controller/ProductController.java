package com.star.starpolythene.controller;

import com.star.starpolythene.dao.ProductDao;
import com.star.starpolythene.entity.Gender;
import com.star.starpolythene.entity.Product;
import com.star.starpolythene.entity.Productmaterial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/products")
public class ProductController {

    @Autowired
    private ProductDao productDao;

    @GetMapping(produces = "application/json")
    public List<Product> get(@RequestParam HashMap<String, String> params){

        String code = params.get("code");
        String colorid = params.get("colorid");
        String unitprice = params.get("unitprice");
        String sizeid = params.get("sizeid");
        String thicknessid = params.get("thicknessid");


        List<Product> products = this.productDao.findAll();
        if (params.isEmpty()) return products;

        //System.out.println("1111111111");
        Stream<Product> pstream = products.stream();
        if (code != null){
            pstream = pstream.filter(e -> e.getCode().equalsIgnoreCase(code));
            //System.out.println("222222222222");
        }
        if (colorid != null) pstream = pstream.filter(e -> e.getColor().getId() == Integer.parseInt(colorid));
        if (unitprice != null) pstream = pstream.filter(e -> e.getUnitprice().toString().contains(unitprice));
        if (sizeid != null) pstream = pstream.filter(e -> e.getSize().getId() == Integer.parseInt(sizeid));
        if (thicknessid != null) pstream = pstream.filter(e -> e.getThickness().getId() == Integer.parseInt(thicknessid));


        return pstream.collect(Collectors.toList());
    }

    @GetMapping(path ="/list", produces = "application/json")
    public List<Product> get(){
        List<Product> products = this.productDao.findAllList();
        return products;
    }

    @GetMapping(path ="/list/qty", produces = "application/json")
    public List<Product> getQty(){
        List<Product> products = this.productDao.findByIdAndQty();

        return products;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> add(@RequestBody Product product){
        HashMap<String,String> response = new HashMap<>();
        String errors = "";


        if (productDao.findByCode(product.getCode()) != null)
            errors = errors + "<br> Existing Code";

        if (errors != "")   errors = "Server Validation Errors : <br> " + errors;

            for(Productmaterial pm : product.getProductmaterials()) pm.setProduct(product);
            productDao.save(product);

        response.put("id",String.valueOf(product.getId()));
        response.put("url","/products/" + product.getId());
        response.put("errors",errors);

        return response;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> update(@RequestBody Product product){
        HashMap<String,String> response = new HashMap<>();
        String errors = "";

        Product emp1 = productDao.findByCode(product.getCode());

        if (emp1 != null && product.getId() != emp1.getId())
            errors = errors + "<br> Existing Code";

        if (errors == "")
            productDao.save(product);
        else
            errors = "Server validation Errors : <br> " + errors;

        response.put("id",String.valueOf(product.getId()));
        response.put("url","/products/" + product.getId());
        response.put("errors",errors);

        return response;

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){
        System.out.println(id);
        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Product emp1 = productDao.findByMyId(id);

        if(emp1==null)
            errors = errors+"<br> Product Does Not Existed";

        if(errors=="") productDao.delete(emp1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/products/"+id);
        responce.put("errors",errors);

        return responce;

    }

}
