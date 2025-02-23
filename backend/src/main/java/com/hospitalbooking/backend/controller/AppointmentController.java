package com.hospitalbooking.backend.controller;

import com.hospitalbooking.backend.constant.AppointmentStatus;
import com.hospitalbooking.backend.models.Appointment;
import com.hospitalbooking.backend.models.Doctor;
import com.hospitalbooking.backend.models.Patient;
import com.hospitalbooking.backend.repository.AppointmentRepos;
import com.hospitalbooking.backend.repository.PatientRepos;
import com.hospitalbooking.backend.repository.UserRepos;
import com.hospitalbooking.backend.specification.DBSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class AppointmentController {
    
    @Autowired
    private AppointmentRepos appointmentRepos;

    @Autowired
    private PatientRepos patientRepos;

    @Autowired
    private UserRepos userRepos;

    @GetMapping("/appointments/{id}")
    public ResponseEntity<Appointment> one(@PathVariable Long id){
        return appointmentRepos.findById(id).map(appointment -> new ResponseEntity<>(appointment, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> all(){
        Specification<?> spec = DBSpecification.createSpecification(Boolean.FALSE);
        return new ResponseEntity<List<Appointment>>(appointmentRepos.findAll(spec), HttpStatus.OK);
    }

    @GetMapping("/appointments-doctor/{username}")
    public ResponseEntity<List<Appointment>> allByDoctor(@PathVariable String username){
        return userRepos.findByUsername(username).map(user ->
                        new ResponseEntity<>(user.getEmployee().getDoctor().getAppointments(false), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/appointments-patient/{username}")
    public ResponseEntity<List<Appointment>> allByPatient(@PathVariable String username){
        return userRepos.findByUsername(username).map(user ->
                        new ResponseEntity<>(user.getPatient().getAppointments(false), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/appointments/cancel/{id}")
    public ResponseEntity<Appointment> cancelByDoctor(@PathVariable Long id) {
        Optional<Appointment> optional = appointmentRepos.findById(id);
        return optional.map(model -> {
            model.setStatus(AppointmentStatus.CANCELED);
            return new ResponseEntity<>(appointmentRepos.save(model), HttpStatus.OK);
        }).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }


    @GetMapping("/appointments-pending")
    public ResponseEntity<List<Appointment>> allPending(){
        Specification<?> spec = DBSpecification.createSpecification(Boolean.FALSE).and((root, cq, cb) -> cb.equal(root.get("status"), AppointmentStatus.PENDING));
        return new ResponseEntity<List<Appointment>>(appointmentRepos.findAll(spec), HttpStatus.OK);
    }

    @PostMapping("/appointments")
    public ResponseEntity<Appointment> add(@RequestBody Appointment appointment){

        return new ResponseEntity<>(appointmentRepos.save(appointment), HttpStatus.OK);
    }

    @PutMapping("/appointments/{id}")
    public ResponseEntity<Appointment> update(@RequestBody Appointment appointment, @PathVariable Long id){
        Optional<Appointment> optional = appointmentRepos.findById(id);
        return optional.map(model -> {
            appointment.setId(model.getId());
            Patient patient = appointment.getPatient();
            patientRepos.findById(patient.getId()).map(pat -> {
                pat.setEmail(patient.getEmail());
                pat.setPhoneNumber(patient.getPhoneNumber());
                return patientRepos.save(pat);
            });
            return new ResponseEntity<>(appointmentRepos.save(appointment), HttpStatus.OK);
        }).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<Appointment> delete(@PathVariable Long id){
        Optional<Appointment> optional = appointmentRepos.findById(id);
        return optional.map(model -> {
            model.setRetired(true);
            return new ResponseEntity<>(appointmentRepos.save(model), HttpStatus.OK);
        }).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }


}
