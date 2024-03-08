package com.csit314.backend.UserAccount;

import java.sql.SQLException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;

@Controller // This means that this class is a Controller
@RequestMapping(path = "/suspenduseraccount") // This means URL's start with /useraccount (after Application path)
public class SuspendUserAccountController {

    @DeleteMapping("/{id}")
    public ResponseEntity<?> suspend(@PathVariable Integer id) throws SQLException {
        UserAccount ua = new UserAccount();
        if (ua.suspend(id)) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/unsuspend/{id}")
    public ResponseEntity<?> unsuspend(@PathVariable Integer id) throws SQLException {
        UserAccount ua = new UserAccount();
        if (ua.unsuspend(id)) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
