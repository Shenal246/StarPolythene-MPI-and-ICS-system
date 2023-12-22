package com.star.starpolythene.controller;

import com.star.starpolythene.entity.*;
import com.star.starpolythene.util.RegexProvider;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@CrossOrigin
@RestController
@RequestMapping(value = "/regexes")
public class RegexController {
    @GetMapping(path ="/employee", produces = "application/json")

    public HashMap<String, HashMap<String, String>> employee() { return RegexProvider.get(new Employee());}

    @GetMapping(path ="/product", produces = "application/json")

    public HashMap<String, HashMap<String, String>> product() { return RegexProvider.get(new Product());}

    @GetMapping(path ="/users", produces = "application/json")
    public HashMap<String, HashMap<String, String>> user() {return RegexProvider.get(new User());}

    @GetMapping(path ="/material", produces = "application/json")

    public HashMap<String, HashMap<String, String>> material() { return RegexProvider.get(new Material());}

    @GetMapping(path ="/supplier", produces = "application/json")

    public HashMap<String, HashMap<String, String>> supplier() { return RegexProvider.get(new Supplier());}

    @GetMapping(path ="/shop", produces = "application/json")

    public HashMap<String, HashMap<String, String>> shop() { return RegexProvider.get(new Shop());}

    @GetMapping(path ="/payment", produces = "application/json")

    public HashMap<String, HashMap<String, String>> payment() { return RegexProvider.get(new Payment());}

    @GetMapping(path ="/purorder", produces = "application/json")

    public HashMap<String, HashMap<String, String>> purorder() { return RegexProvider.get(new Purorder());}

    @GetMapping(path ="/invoice", produces = "application/json")

    public HashMap<String, HashMap<String, String>> invoice() { return RegexProvider.get(new Invoice());}
}
