package com.star.starpolythene.entity;

import com.star.starpolythene.util.RegexPattern;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Time;
import java.util.Objects;

@Entity
public class Payment {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "date")
    @RegexPattern(reg = "^\\d{2}-\\d{2}-\\d{2}$", msg = "Invalid Date Format")
    private Date date;
    @Basic
    @Column(name = "amount")
    @RegexPattern(reg = "^[0-9]+$", msg = "Invalid Price Format")
    private BigDecimal amount;
    @Basic
    @Column(name = "chequeno")
    @RegexPattern(reg = "^[0-9]+$", msg = "Invalid Cheque No")
    private String chequeno;
    @Basic
    @Column(name = "time")
    private Time time;
    @Basic
    @Column(name = "dorealized")
    @RegexPattern(reg = "^\\d{2}-\\d{2}-\\d{2}$", msg = "Invalid Date Format")
    private Date dorealized;
    @Basic
    @Column(name = "description")
    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;
    @ManyToOne
    @JoinColumn(name = "paymenttype_id", referencedColumnName = "id", nullable = false)
    private Paymenttype paymenttype;
    @ManyToOne
    @JoinColumn(name = "paymentstatus_id", referencedColumnName = "id", nullable = false)
    private Paymentstatus paymentstatus;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;

//    @ManyToOne
//    @JoinColumn(name = "employeelist_id", referencedColumnName = "id", nullable = false)
//    private Employeelist employeelist;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getChequeno() {
        return chequeno;
    }

    public void setChequeno(String chequeno) {
        this.chequeno = chequeno;
    }

    public Time getTime() {
        return time;
    }

    public void setTime(Time time) {
        this.time = time;
    }

    public Date getDorealized() {
        return dorealized;
    }

    public void setDorealized(Date dorealized) {
        this.dorealized = dorealized;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Payment payment = (Payment) o;
        return Objects.equals(id, payment.id) && Objects.equals(date, payment.date) && Objects.equals(amount, payment.amount) && Objects.equals(chequeno, payment.chequeno) && Objects.equals(time, payment.time) && Objects.equals(dorealized, payment.dorealized) && Objects.equals(description, payment.description);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, date, amount, chequeno, time, dorealized, description);
    }

    public Paymenttype getPaymenttype() {
        return paymenttype;
    }

    public void setPaymenttype(Paymenttype paymenttype) {
        this.paymenttype = paymenttype;
    }

    public Paymentstatus getPaymentstatus() {
        return paymentstatus;
    }

    public void setPaymentstatus(Paymentstatus paymentstatus) {
        this.paymentstatus = paymentstatus;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

//    public Employeelist getEmployeelist() {
//        return employeelist;
//    }
//
//    public void setEmployeelist(Employeelist employeelist) {
//        this.employeelist = employeelist;
//    }
}
