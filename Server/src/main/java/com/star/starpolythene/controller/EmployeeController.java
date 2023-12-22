package com.star.starpolythene.controller;

import com.star.starpolythene.dao.EmployeeDao;
import com.star.starpolythene.entity.Employee;
import com.star.starpolythene.entity.Gender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/employees")
public class EmployeeController {
    @Autowired
    private EmployeeDao employeeDao;

    @GetMapping(produces = "application/json")
    @PreAuthorize("hasAuthority('employee-select')")
        public List<Employee> get(@RequestParam HashMap<String, String> params){

            String number = params.get("number");
            String genderid = params.get("genderid");
            String fullname = params.get("fullname");
            String callingname = params.get("callingname");
            String designationid = params.get("designationid");
            String nic = params.get("nic");


            List<Employee> employees = this.employeeDao.findAll();
            if (params.isEmpty()) return employees;

            Stream<Employee> estream = employees.stream();
                        if (number != null) estream = estream.filter(e -> e.getNumber().equals(number));
                        if (genderid != null) estream = estream.filter(e -> e.getGender().getId() == Integer.parseInt(genderid));
                        if (fullname != null) estream = estream.filter(e -> e.getFullname().contains(fullname));
                        if (callingname != null) estream = estream.filter(e -> e.getCallingname().contains(callingname));
                        if (designationid != null) estream = estream.filter(e -> e.getDesignation().getId() == Integer.parseInt(designationid));
                        if (nic != null) estream = estream.filter(e -> e.getNic().contains(nic));


            return estream.collect(Collectors.toList());
    }

    @GetMapping(path ="/list",produces = "application/json")
    public List<Employee> get() {

        List<Employee> employees = this.employeeDao.findAllNameId();

        employees = employees.stream().map(
                employee -> {
                    Employee e = new Employee(employee.getId(), employee.getCallingname());
                    return  e;
                }
        ).collect(Collectors.toList());

        return employees;

    }

    @GetMapping(path ="/list/des",produces = "application/json")
    public List<Employee> getEmDes() {

        List<Employee> employees = this.employeeDao.findAllDes();

        employees = employees.stream().map(
                employee -> {
                    Employee e = new Employee(employee.getId(), employee.getCallingname(),employee.getDesignation());
                    return  e;
                }
        ).collect(Collectors.toList());

        return employees;

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> add(@RequestBody Employee employee){
        HashMap<String,String> response = new HashMap<>();
        String errors = "";

        if (employeeDao.findByNumber(employee.getNumber()) != null)
            errors = errors + "<br> Existing Number";
        if (employeeDao.findByNic(employee.getNic()) != null)
            errors = errors + "<br> Existing NIC";

        if (errors == "")
            employeeDao.save(employee);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",String.valueOf(employee.getId()));
        response.put("url","/employees/" + employee.getId());
        response.put("errors",errors);

        return response;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> update(@RequestBody Employee employee){
        HashMap<String,String> response = new HashMap<>();
        String errors = "";

        Employee emp1 = employeeDao.findByNumber(employee.getNumber());
        Employee emp2 = employeeDao.findByNic(employee.getNic());

        if (emp1 != null && employee.getId() != emp1.getId())
            errors = errors + "<br> Existing Number";
        if (emp2 != null && employee.getId() != emp2.getId())
            errors = errors + "<br> Existing NIC";

        if (errors == "")
            employeeDao.save(employee);
        else
            errors = "Server validation Errors : <br> " + errors;

        response.put("id",String.valueOf(employee.getId()));
        response.put("url","/employees/" + employee.getId());
        response.put("errors",errors);

        return response;

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){
        System.out.println(id);
        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Employee emp1 = employeeDao.findByMyId(id);

        if(emp1==null)
            errors = errors+"<br> Employee Does Not Existed";

        if(errors=="") employeeDao.delete(emp1);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/employees/"+id);
        responce.put("errors",errors);

        return responce;

    }

}


