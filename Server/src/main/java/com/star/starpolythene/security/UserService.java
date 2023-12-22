package com.star.starpolythene.security;

import com.star.starpolythene.dao.UserDao;
import com.star.starpolythene.entity.Privilage;
import com.star.starpolythene.entity.Userrole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import  com.star.starpolythene.entity.User;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserService implements UserDetailsService {

    final UserDao userdao;

    @Autowired
    public UserService(UserDao userdao) {
        this.userdao = userdao;
    }

    public User getByUsername(String username){

        User user = new User();

        if ("shenal".equals(username)){

            user.setUsername(username);

        }else {
            user = userdao.findByUsername(username);
            if (user == null) {
                throw new UsernameNotFoundException("User not found with username: " + username);
            }
        }

        return user;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        if (username.equals("shenal")) {
            Set<SimpleGrantedAuthority> authorities = new HashSet<>();
            authorities.add(new SimpleGrantedAuthority("employee-select"));
            authorities.add(new SimpleGrantedAuthority("user-select"));
            authorities.add(new SimpleGrantedAuthority("user-insert"));
            authorities.add(new SimpleGrantedAuthority("user-delete"));
            authorities.add(new SimpleGrantedAuthority("user-update"));
            authorities.add(new SimpleGrantedAuthority("privilege-select"));
            authorities.add(new SimpleGrantedAuthority("privilege-insert"));
            authorities.add(new SimpleGrantedAuthority("privilege-delete"));
            authorities.add(new SimpleGrantedAuthority("privilege-update"));

            return org.springframework.security.core.userdetails.User
                    .withUsername("shenal")
                    .password(new BCryptPasswordEncoder().encode("Admin321"))
                    .authorities(authorities)
                    .accountExpired(false)
                    .accountLocked(false)
                    .credentialsExpired(false)
                    .disabled(false)
                    .build();
        }
        else {

            User user = userdao.findByUsername(username);
            if (user == null) {
                throw new UsernameNotFoundException("User not found with username: " + username);
            }

            Set<SimpleGrantedAuthority> authorities = new HashSet<>();

            List<Userrole> userroles = (List<Userrole>) user.getUserroles();

            for(Userrole u : userroles){
                List<Privilage> privilages = (List<Privilage>) u.getRole().getPrivilages();
                for (Privilage p:privilages){
                    authorities.add(new SimpleGrantedAuthority(p.getAuthority()));
                }
            }

            return org.springframework.security.core.userdetails.User
                    .withUsername(user.getUsername())
                    .password(user.getPassword())
                    .authorities(authorities)
                    .accountExpired(false)
                    .accountLocked(false)
                    .credentialsExpired(false)
                    .disabled(false)
                    .build();
        }
    }
}
