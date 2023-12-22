package com.star.starpolythene.controller;

import com.star.starpolythene.dao.InvoiceDao;
import com.star.starpolythene.dao.ProductDao;
import com.star.starpolythene.entity.Invoice;
import com.star.starpolythene.entity.Invoiceproduct;
import com.star.starpolythene.entity.Matissue;
import com.star.starpolythene.entity.Product;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.transaction.annotation.Transactional;


@CrossOrigin
@RestController
@RequestMapping(value = "/invoices")
public class InvoiceController {

    @Autowired
    private InvoiceDao invoicedao;

    @Autowired
    private ProductDao productDao;

    @GetMapping(produces = "application/json")
    public List<Invoice> get(@RequestParam HashMap<String, String> params) {

        List<Invoice> invoices = this.invoicedao.findAll();

        if(params.isEmpty())  return invoices;

        String shopid = params.get("shopid");
        String statusid= params.get("statusid");


        Stream<Invoice> istream = invoices.stream();


        if(shopid!=null) istream = istream.filter(i -> i.getShop().getId()==Integer.parseInt(shopid));
        if(statusid!=null) istream = istream.filter(i -> i.getInvoicestatus().getId()==Integer.parseInt(statusid));


        return istream.collect(Collectors.toList());

    }


//    @PostMapping
//    @ResponseStatus(HttpStatus.CREATED)
//    public HashMap<String, String> add(@RequestBody Invoice invoice) {
//        HashMap<String, String> response = new HashMap<>();
//        String errors = "";
//
//        for (Invoiceproduct i : invoice.getInvoiceproducts()) i.setInvoice(invoice);
//
//        invoicedao.save(invoice);
//
//        response.put("id", String.valueOf(invoice.getId()));
//        response.put("url", "/invoices/" + invoice.getId());
//        response.put("errors", errors);
//
//        return response;
//
//    }


// ...

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Invoice invoice) {
        HashMap<String, String> response = new HashMap<>();
        StringBuilder errors = new StringBuilder();

        if (invoice.getInvoicestatus().getId() == 1) {
            // Set the invoice reference in Invoiceproduct
            for (Invoiceproduct invoiceproduct : invoice.getInvoiceproducts()) {
                invoiceproduct.setInvoice(invoice);
            }

            // Calculate and update the product quantities if invoicestatus id is 1
            if (invoice.getInvoicestatus().getId() == 1) {
                for (Invoiceproduct invoiceproduct : invoice.getInvoiceproducts()) {
                    Product product = invoiceproduct.getProduct();
                    BigDecimal quantityToReduce = invoiceproduct.getQty();

                    // Check if the product exists in the database
                    Optional<Product> optionalProduct = productDao.findById(product.getId());

                    if (optionalProduct.isPresent()) {
                        Product existingProduct = optionalProduct.get();

                        // Check if the product quantity is sufficient for the sale
                        if (existingProduct.getQty().compareTo(quantityToReduce) >= 0) {
                            existingProduct.setQty(existingProduct.getQty().subtract(quantityToReduce));

                            // Save the updated product with reduced quantity
                            productDao.save(existingProduct);
                        } else {
                            // Append an error message to the errors variable
                            errors.append("Insufficient quantity for Product Code: ").append(product.getCode()).append(". <br>");
                        }
                    } else {
                        // Append an error message to the errors variable
                        errors.append("Product not found with ID: ").append(product.getId()).append(". <br>");
                    }
                }

                // Save the invoice only if there are no errors
                if (errors.length() == 0) {
                    invoicedao.save(invoice);
                    response.put("id", String.valueOf(invoice.getId()));
                    response.put("url", "/invoices/" + invoice.getId());
                    response.put("errors", errors.toString());
                } else {
                    errors.insert(0, "Server validation Errors: <br>" + errors);
                    response.put("errors", errors.toString());
                }
            } else {
                // Save the invoice if invoicestatus id is not 1
                invoicedao.save(invoice);
                response.put("id", String.valueOf(invoice.getId()));
                response.put("url", "/invoices/" + invoice.getId());
                response.put("errors", errors.toString());
            }

            return response;
        }else {
            for (Invoiceproduct i : invoice.getInvoiceproducts()) i.setInvoice(invoice);

            invoicedao.save(invoice);

            response.put("id", String.valueOf(invoice.getId()));
            response.put("url", "/invoices/" + invoice.getId());
            response.put("errors", errors.toString());

            return response;
        }
    }


    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Invoice invoice) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Invoice extInvoice = invoicedao.findByMyId(invoice.getId());


        if (extInvoice != null) {

            try {
                extInvoice.getInvoiceproducts().clear();
                invoice.getInvoiceproducts().forEach(newinvoices -> {
                    newinvoices.setInvoice(extInvoice);
                    extInvoice.getInvoiceproducts().add(newinvoices);
                    newinvoices.setInvoice(extInvoice);
                });

                BeanUtils.copyProperties(invoice, extInvoice, "id","invoiceproduct");

                invoicedao.save(extInvoice); // Save the updated extUser object

                response.put("id", String.valueOf(invoice.getId()));
                response.put("url", "/invoices/" + invoice.getId());
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
//        Invoice emp1 = invoicedao.findByMyId(id);
//
//        if(emp1==null)
//            errors = errors+"<br> Invoice Does Not Existed";
//
//        if(errors=="") invoicedao.delete(emp1);
//        else errors = "Server Validation Errors : <br> "+errors;
//
//        responce.put("id",String.valueOf(id));
//        responce.put("url","/invoices/"+id);
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

        Invoice invoiceToDelete = invoicedao.findByMyId(id);

        if (invoiceToDelete == null) {
            errors = errors + "<br> Invoice Does Not Exist";
        }

        if (errors.isEmpty()) {
            // Retrieve the Invoiceproducts associated with the Invoice
            Collection<Invoiceproduct> invoiceProducts = invoiceToDelete.getInvoiceproducts();

            // Increase the quantity of products for each Invoiceproduct
            for (Invoiceproduct invoiceProduct : invoiceProducts) {
                Product product = invoiceProduct.getProduct();
                BigDecimal currentQty = product.getQty();
                BigDecimal additionalQty = invoiceProduct.getQty();
                product.setQty(currentQty.add(additionalQty));
//            BigDecimal newQty = currentQty.add(additionalQty);
//            product.setQty(newQty);
                productDao.save(product);
            }

            // Delete the invoice record
            invoicedao.delete(invoiceToDelete);
        }else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("id", String.valueOf(id));
        response.put("url", "/invoices/" + id);
        response.put("errors", errors);
        return response;
    }


}
