package com.csit314.backend.UserProfile;

import java.sql.SQLException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequestMapping(path = "/updateuserprofile")
public class UpdateUserProfileController {

    @PutMapping(path = "/update/{id}")
    public ResponseEntity<?> update(@RequestBody UserProfile user, @PathVariable Integer id) throws SQLException {

        UserProfile up = new UserProfile();
        UserProfile existingUser = up.findByProfileName(user.getProfileName());
        if (existingUser != null && existingUser.getId() != user.getId()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Profile name already exists");
        }

        try {

            up.update(user);
            return ResponseEntity.ok("Saved");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
