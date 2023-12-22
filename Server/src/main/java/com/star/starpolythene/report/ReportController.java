package com.star.starpolythene.report;

import com.star.starpolythene.dao.ProductDao;
import com.star.starpolythene.entity.Product;
import com.star.starpolythene.report.dao.CountByDesignationDao;
import com.star.starpolythene.report.dao.InvoicebyshopDao;
import com.star.starpolythene.report.dao.ProductByYearDao;
import com.star.starpolythene.report.dao.ProductdemanInDao;
import com.star.starpolythene.report.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@CrossOrigin
@RestController
@RequestMapping(value = "/reports")
public class ReportController {

    @Autowired private CountByDesignationDao countByDesignationDao;
    @Autowired private ProductdemanInDao productdemanIndao;
    @Autowired private ProductDao productdao;
    @Autowired private InvoicebyshopDao invoicebyshopDao;
    @Autowired private ProductByYearDao productByYearDao;

    @GetMapping(path = "/countbydesignation", produces = "application/json")
    public List<CountByDesignation> getDesignationList() {

        List<CountByDesignation> designations = this.countByDesignationDao.countByDesignation();
        long totalCount = 0;

        for (CountByDesignation countByDesignation : designations){
            totalCount += countByDesignation.getCount();
        }

        for (CountByDesignation countByDesignation : designations){
            long count = countByDesignation.getCount();
            double percentage = (double) count / totalCount * 100;
            percentage = Math.round(percentage * 100.0) /100.0;
            countByDesignation.setPercentage(percentage);
        }
        return designations;
    }

    @GetMapping(path = "/invoicebyshop/{year}", produces = "application/json")
    public List<InvoiceByShop> getInvoiceTotalByShops(@PathVariable int year) {

        List<InvoiceByShop> invoiceByShops = this.invoicebyshopDao.getInvoiceByShop(year);

        return invoiceByShops;
    }

    @GetMapping(path = "/products/{year}", produces = "application/json")
    public List<ProductByYear> getProductByYear(@PathVariable int year) {
        List<ProductByYear> productByYears = this.productByYearDao.getProductByYear(year);

        BigDecimal totalQuantity = BigDecimal.ZERO;
        for (ProductByYear productByYear : productByYears) {
            totalQuantity = totalQuantity.add(productByYear.getQuantity());
        }

        // Calculate and set the percentage for each product
        for (ProductByYear productByYear : productByYears) {
            BigDecimal quantity = productByYear.getQuantity();
            double percentage = (quantity.doubleValue() / totalQuantity.doubleValue()) * 100;
            percentage = Math.round(percentage * 100.0) / 100.0;
            productByYear.setPercentage(percentage);
        }

        return productByYears;
    }



    //    @GetMapping(path ="/productdeman" ,produces = "application/json")
//    public List<ProductDeman> getProductdemanList() {
//
//        List<ProductdemanIn> productdemanin = this.productdemanIndao.getProductSummaryByYear();
//
//        List<Product> products = this.productdao.findByIdNameCode();
//
//        List<ProductDeman> productdemans = new ArrayList<>();
//
//        for (Product prd: products) {
//
//            ProductDeman productdeman = new ProductDeman();
//            productdeman.setPrductid(prd.getId());
//            productdeman.setProductName(prd.getName());
//            productdeman.setCode(prd.getCode());
//
//            for ( ProductdemanIn pdin: productdemanin) {
//                System.out.println(pdin.getYear().equals(2022));
//               if( productdeman.getPrductId() == pdin.getPrductId() ) {
//                   if (pdin.getYear().equals(2021)) productdeman.setQty2021(pdin.getSum());
//                   if (pdin.getYear().equals(2022)) productdeman.setQty2022(pdin.getSum());
//               }
//            }
//
//           productdemans.add(productdeman);
//
//        }
//
//        return productdemans;
//    }

    @GetMapping(path = "/productdeman", produces = "application/json")
    public List<ProductDeman> getProductdemanList(@RequestParam HashMap<String, String> params) {
        List<ProductDeman> productdemans = new ArrayList<>();
        List<ProductdemanIn> productdemanin = this.productdemanIndao.getProductSummaryByYear();

        if (!params.isEmpty()) {

            int startYear = Integer.parseInt(params.get("startyear"));
            int endYear = Integer.parseInt(params.get("endyear"));

            List<Product> products = this.productdao.findByIdNameCode();

            for (Product prd : products) {
                ProductDeman productdeman = new ProductDeman();
                productdeman.setPrductid(prd.getId());
                productdeman.setProductName(prd.getName());
                productdeman.setCode(prd.getCode());

                for ( ProductdemanIn pdin: productdemanin) {
                    if (Objects.equals(productdeman.getPrductId(), pdin.getPrducttionId())) {
                        if (pdin.getYear() == startYear) productdeman.setqtyStartYear(pdin.getSum());
                        if (pdin.getYear() == endYear) productdeman.setQtyEndYear(pdin.getSum());
                    }
                }

                productdemans.add(productdeman);
            }

            return productdemans; // Moved this line outside the loop
        }else {
            return null;
        }
    }
}
