package com.star.starpolythene.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.star.starpolythene.util.RegexPattern;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.sql.Date;
import java.util.Arrays;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Employee {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "number")
    @Pattern(regexp = "^\\d{4}$", message = "Invalid Number")
    private String number;
    @Basic
    @Column(name = "fullname")
    @Pattern(regexp = "^([A-Z][a-z]*[.]?[\\s]?)*([A-Z][a-z]*)$", message = "Invalid Fullname")
    private String fullname;
    @Basic
    @Column(name = "callingname")
    @Pattern(regexp = "^([A-Z][a-z]+)$", message = "Invalid Callingname")
    private String callingname;
    @Basic
    @Column(name = "photo")
    private byte[] photo;
    @Basic
    @Column(name = "dobirth")
    @RegexPattern(reg = "^\\d{2}-\\d{2}-\\d{2}$", msg = "Invalid Date Format")
    private Date dobirth;
    @Basic
    @Column(name = "nic")
    @Pattern(regexp = "^(([\\d]{9}[vVxX])|([\\d]{12}))$", message = "Invalid NIC")
    private String nic;
    @Basic
    @Column(name = "address")
    @Pattern(regexp = "^([\\w\\/\\-,\\s]{2,})$", message = "Invalid Address")
    private String address;
    @Basic
    @Column(name = "mobile")
    @Pattern(regexp = "^0\\d{9}$", message = "Invalid Mobilephone Number")
    private String mobile;
    @Basic
    @Column(name = "land")
    @Pattern(regexp = "^|\\d{10}$", message = "Invalid Landphone Number")
    private String land;
    @Basic
    @Column(name = "doassignment")
    private Date doassignment;
    @Basic
    @Column(name = "description")
    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;
    @ManyToOne
    @JoinColumn(name = "gender_id", referencedColumnName = "id", nullable = false)
    private Gender gender;
    @ManyToOne
    @JoinColumn(name = "designation_id", referencedColumnName = "id", nullable = false)
    private Designation designation;
    @ManyToOne
    @JoinColumn(name = "employeestatus_id", referencedColumnName = "id", nullable = false)
    private Employeestatus employeestatus;

    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private Collection<Payment> payments;

    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private Collection<User> users;

    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private Collection<Purorder> purorders;


    @OneToMany(mappedBy = "employee")
    @JsonIgnore
    private Collection<Proorder> employee;

    @OneToMany(mappedBy = "supervisor")
    @JsonIgnore
    private Collection<Proorder> supervisor;

    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private Collection<Matissue> matissues;

    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private Collection<Production> productions;

    public Employee() {
    }

    public Employee(Integer id, String callingname, Designation designation) {
        this.id = id;
        this.callingname = callingname;
        this.designation = designation;
    }

    public Employee(Integer id, String callingname) {
        this.id = id;
        this.callingname = callingname;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getCallingname() {
        return callingname;
    }

    public void setCallingname(String callingname) {
        this.callingname = callingname;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public Date getDobirth() {
        return dobirth;
    }

    public void setDobirth(Date dobirth) {
        this.dobirth = dobirth;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getLand() {
        return land;
    }

    public void setLand(String land) {
        this.land = land;
    }

    public Date getDoassignment() {
        return doassignment;
    }

    public void setDoassignment(Date doassignment) {
        this.doassignment = doassignment;
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
        Employee employee = (Employee) o;
        return Objects.equals(id, employee.id) && Objects.equals(number, employee.number) && Objects.equals(fullname, employee.fullname) && Objects.equals(callingname, employee.callingname) && Arrays.equals(photo, employee.photo) && Objects.equals(dobirth, employee.dobirth) && Objects.equals(nic, employee.nic) && Objects.equals(address, employee.address) && Objects.equals(mobile, employee.mobile) && Objects.equals(land, employee.land) && Objects.equals(doassignment, employee.doassignment) && Objects.equals(description, employee.description);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(id, number, fullname, callingname, dobirth, nic, address, mobile, land, doassignment, description);
        result = 31 * result + Arrays.hashCode(photo);
        return result;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Designation getDesignation() {
        return designation;
    }

    public void setDesignation(Designation designation) {
        this.designation = designation;
    }

    public Employeestatus getEmployeestatus() {
        return employeestatus;
    }

    public void setEmployeestatus(Employeestatus employeestatus) {
        this.employeestatus = employeestatus;
    }

    public Collection<Payment> getPayments() {
        return payments;
    }

    public void setPayments(Collection<Payment> payments) {
        this.payments = payments;
    }

    public Collection<User> getUsers() {
        return users;
    }

    public void setUsers(Collection<User> users) {
        this.users = users;
    }

    public Collection<Purorder> getPurorders() {
        return purorders;
    }

    public void setPurorders(Collection<Purorder> purorders) {
        this.purorders = purorders;
    }

    public Collection<Matissue> getMatissues() {
        return matissues;
    }

    public void setMatissues(Collection<Matissue> matissues) {
        this.matissues = matissues;
    }

    public Collection<Production> getProductions() {
        return productions;
    }

    public void setProductions(Collection<Production> productions) {
        this.productions = productions;
    }

    public Collection<Proorder> getEmployee() {
        return employee;
    }

    public void setEmployee(Collection<Proorder> employee) {
        this.employee = employee;
    }

    public Collection<Proorder> getSupervisor() {
        return supervisor;
    }

    public void setSupervisor(Collection<Proorder> supervisor) {
        this.supervisor = supervisor;
    }
}
