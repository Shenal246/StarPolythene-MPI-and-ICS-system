package com.star.starpolythene.controller;

import com.star.starpolythene.dao.PaymentDao;
import com.star.starpolythene.entity.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/payments")
public class PaymentController {

    @Autowired
    private PaymentDao paymentDao;

    @GetMapping(produces = "application/json")
    public List<Payment> get(@RequestParam HashMap<String, String> params){

        String date = params.get("date");
        String chequeno = params.get("chequeno");
        String dorealized = params.get("dorealized");
        String paymentstatusid = params.get("paymentstatusid");


        List<Payment> payments = this.paymentDao.findAll();
//        return payments;
        if (params.isEmpty()) return payments;

        //System.out.println("1111111111");
        Stream<Payment> pstream = payments.stream();
        if (date != null){
            pstream = pstream.filter(e -> e.getDate().toString().equals(date));
            //System.out.println("222222222222");
        }
        if (chequeno != null) pstream = pstream.filter(e -> e.getChequeno().toString().contains(chequeno));
        if (dorealized != null) pstream = pstream.filter(e -> e.getDorealized().equals(dorealized));
        if (paymentstatusid != null) pstream = pstream.filter(e -> e.getPaymentstatus().getId() == Integer.parseInt(paymentstatusid));


        return pstream.collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> add(@RequestBody Payment payment){
        HashMap<String,String> response = new HashMap<>();
        String errors = "";

        if (paymentDao.findByChequeno(payment.getChequeno()) != null)
            errors = errors + "<br> Existing Cheque No. Payment Already done!";
//        if (paymentDao.findById(payment.getId()) != null)
//            errors = errors + "<br> Existing Id";

        if (errors == "")
            paymentDao.save(payment);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",String.valueOf(payment.getId()));
        response.put("url","/payments/" + payment.getId());
        response.put("errors",errors);

        return response;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> update(@RequestBody Payment payment){
        HashMap<String,String> response = new HashMap<>();
        String errors = "";

        Payment emp1 = paymentDao.findByChequeno(payment.getChequeno());

        if (emp1 != null && payment.getId() != emp1.getId())
            errors = errors + "<br> Existing Code";

        if (errors == "")
            paymentDao.save(payment);
        else
            errors = "Server validation Errors : <br> " + errors;

        response.put("id",String.valueOf(payment.getId()));
        response.put("url","/payments/" + payment.getId());
        response.put("errors",errors);

        return response;

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){
        System.out.println(id);
        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Payment emp1 = paymentDao.findByMyId(id);

        if(emp1==null)
            errors = errors+"<br> Payment Does Not Existed";

        if(errors=="") paymentDao.delete(emp1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/payments/"+id);
        responce.put("errors",errors);

        return responce;

    }

}
