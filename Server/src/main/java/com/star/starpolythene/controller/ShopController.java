package com.star.starpolythene.controller;

import com.star.starpolythene.dao.ShopDao;
import com.star.starpolythene.entity.Shop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/shops")
public class ShopController {
    @Autowired
    private ShopDao shopDao;

    @GetMapping(produces = "application/json")
        public List<Shop> get(@RequestParam HashMap<String, String> params){

            String name = params.get("name");
            String tpnumber = params.get("tpnumber");
            String contactperson = params.get("contactperson");
            String contactpno = params.get("contactpno");
            String shopstatusid = params.get("shopstatusid");


            List<Shop> shops = this.shopDao.findAll();
            if (params.isEmpty()) return shops;
//        return shops;

            Stream<Shop> estream = shops.stream();
                        if (name != null) estream = estream.filter(e -> e.getName().contains(name));
                        if (tpnumber != null) estream = estream.filter(e -> e.getTpnumber().contains(tpnumber));
                        if (contactperson != null) estream = estream.filter(e -> e.getContactperson().contains(contactperson));
                        if (contactpno != null) estream = estream.filter(e -> e.getContactpno().contains(contactpno));
                        if (shopstatusid != null) estream = estream.filter(e -> e.getShopstatus().getId() == Integer.parseInt(shopstatusid));


            return estream.collect(Collectors.toList());
    }

    @GetMapping(path ="/list",produces = "application/json")
    public List<Shop> get() {

        List<Shop> shops = this.shopDao.findAll();

        shops = shops.stream().map(
                shop -> { Shop c = new Shop();
                    c.setId(shop.getId());
                    c.setName(shop.getName());
                    return c; }
        ).collect(Collectors.toList());

        return shops;

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> add(@RequestBody Shop shop){
        HashMap<String,String> response = new HashMap<>();
        String errors = "";

        if (shopDao.findByTpnumber(shop.getTpnumber()) != null)
            errors = errors + "<br> Existing Phone Number";
//        if (shopDao.findByNic(shop.getNic()) != null)
//            errors = errors + "<br> Existing NIC";

        if (errors == "")
            shopDao.save(shop);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",String.valueOf(shop.getId()));
        response.put("url","/shops/" + shop.getId());
        response.put("errors",errors);

        return response;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> update(@RequestBody Shop shop){
        HashMap<String,String> response = new HashMap<>();
        String errors = "";

        Shop emp1 = shopDao.findByTpnumber( shop.getTpnumber());

        if (emp1 != null && shop.getId() != emp1.getId())
            errors = errors + "<br> Existing Tpnumber";

        if (errors == "")
            shopDao.save(shop);
        else
            errors = "Server validation Errors : <br> " + errors;

        response.put("id",String.valueOf(shop.getId()));
        response.put("url","/shops/" + shop.getId());
        response.put("errors",errors);

        return response;

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){
        System.out.println(id);
        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Shop emp1 = shopDao.findByMyId(id);

        if(emp1==null)
            errors = errors+"<br> Shop Does Not Existed";

        if(errors=="") shopDao.delete(emp1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/shops/"+id);
        responce.put("errors",errors);

        return responce;

    }

}


