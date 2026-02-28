import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import List "mo:core/List";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // User Roles
  type UserRole = {
    #patient : ();
    #doctor : ();
    #admin : ();
  };

  // Verification Status
  type VerificationStatus = {
    #pending : ();
    #approved : ();
    #rejected : ();
  };

  // User Profile
  type UserProfile = {
    id : Principal;
    name : Text;
    role : UserRole;
    specialty : ?Text;
    verificationStatus : VerificationStatus;
    languagePreference : Text;
    largeTextMode : Bool;
    bio : Text;
    consentDataSharing : Bool;
    rating : Float;
    reviewCount : Nat;
  };

  // Appointment Status
  type AppointmentStatus = {
    #pending : ();
    #confirmed : ();
    #cancelled : ();
    #completed : ();
  };

  // Appointment
  type Appointment = {
    id : Text;
    doctorId : Principal;
    patientId : Principal;
    date : Text;
    timeSlot : Text;
    status : AppointmentStatus;
    reason : Text;
    doctorNotes : Text;
  };

  // Message
  type Message = {
    id : Text;
    from : Principal;
    to : Principal;
    content : Text;
    timestamp : Int;
    isRead : Bool;
  };

  // Prescription
  type Medicine = {
    medicineName : Text;
    dosage : Text;
    frequency : Text;
  };

  type Prescription = {
    id : Text;
    doctorId : Principal;
    patientId : Principal;
    blobId : Text;
    notes : Text;
    dateIssued : Text;
    medicineList : [Medicine];
  };

  // Medical History
  type MedicalHistory = {
    id : Text;
    patientId : Principal;
    title : Text;
    description : Text;
    date : Text;
    category : Text;
    blobId : ?Text;
  };

  // Medicine Reminder
  type MedicineReminder = {
    id : Text;
    patientId : Principal;
    medicineName : Text;
    dosage : Text;
    frequency : Text;
    startDate : Text;
    endDate : Text;
    active : Bool;
  };

  // Symptom Checker
  type SymptomCheckerInput = {
    symptoms : [Text];
    age : ?Nat;
    gender : ?Text;
  };

  type SymptomCheckerResult = {
    relatedConditions : [Text];
    recommendedAction : Text;
    severityHint : Text;
    disclaimer : Text;
  };

  type SymptomQuery = {
    patientId : Principal;
    input : SymptomCheckerInput;
    result : SymptomCheckerResult;
    timestamp : Int;
  };

  // Notification
  type Notification = {
    id : Text;
    userId : Principal;
    title : Text;
    body : Text;
    notifType : Text;
    isRead : Bool;
    timestamp : Int;
  };

  // Hospital
  type Hospital = {
    id : Text;
    name : Text;
    address : Text;
    phone : Text;
    city : Text;
    hospitalType : Text;
  };

  // System Stats
  type SystemStats = {
    totalUsers : Nat;
    totalDoctors : Nat;
    totalPatients : Nat;
    totalAppointments : Nat;
    totalPrescriptions : Nat;
  };

  // Internal Storage
  let profiles = Map.empty<Principal, UserProfile>();
  let appointments = Map.empty<Text, Appointment>();
  let messages = Map.empty<Text, Message>();
  let prescriptions = Map.empty<Text, Prescription>();
  let medicalHistories = Map.empty<Text, MedicalHistory>();
  let medicineReminders = Map.empty<Text, MedicineReminder>();
  let notifications = Map.empty<Text, Notification>();
  let symptomQueries = Map.empty<Text, SymptomQuery>();
  let hospitals = Map.empty<Text, Hospital>();

  var nextAppointmentId : Nat = 0;
  var nextMessageId : Nat = 0;
  var nextPrescriptionId : Nat = 0;
  var nextMedicalHistoryId : Nat = 0;
  var nextReminderId : Nat = 0;
  var nextNotificationId : Nat = 0;
  var nextSymptomQueryId : Nat = 0;

  // Mixins
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Helper Functions
  func isDoctor(profile : ?UserProfile) : Bool {
    switch (profile) {
      case (?p) {
        switch (p.role) {
          case (#doctor) { true };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  func isPatient(profile : ?UserProfile) : Bool {
    switch (profile) {
      case (?p) {
        switch (p.role) {
          case (#patient) { true };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  func isDoctorApproved(profile : ?UserProfile) : Bool {
    switch (profile) {
      case (?p) {
        switch (p.role, p.verificationStatus) {
          case (#doctor, #approved) { true };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  func generateId(prefix : Text, counter : Nat) : Text {
    prefix # "-" # Nat.toText(counter);
  };

  // Core Functions

  // Get Caller Profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    profiles.get(caller);
  };

  // Get User Profile
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  // Save User Profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  // APPOINTMENTS

  // Create Appointment
  public shared ({ caller }) func createAppointment(
    doctorId : Principal,
    date : Text,
    timeSlot : Text,
    reason : Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create appointments");
    };

    let callerProfile = profiles.get(caller);
    if (not isPatient(callerProfile)) {
      Runtime.trap("Unauthorized: Only patients can create appointments");
    };

    let doctorProfile = profiles.get(doctorId);
    if (not isDoctorApproved(doctorProfile)) {
      Runtime.trap("Invalid: Doctor must be approved");
    };

    let appointmentId = generateId("apt", nextAppointmentId);
    nextAppointmentId += 1;

    let appointment : Appointment = {
      id = appointmentId;
      doctorId = doctorId;
      patientId = caller;
      date = date;
      timeSlot = timeSlot;
      status = #pending;
      reason = reason;
      doctorNotes = "";
    };

    appointments.add(appointmentId, appointment);
    appointmentId;
  };

  // Confirm Appointment
  public shared ({ caller }) func confirmAppointment(appointmentId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can confirm appointments");
    };

    switch (appointments.get(appointmentId)) {
      case (?appointment) {
        if (appointment.doctorId != caller) {
          Runtime.trap("Unauthorized: Only the assigned doctor can confirm appointments");
        };

        let callerProfile = profiles.get(caller);
        if (not isDoctorApproved(callerProfile)) {
          Runtime.trap("Unauthorized: Only approved doctors can confirm appointments");
        };

        appointments.add(
          appointmentId,
          {
            appointment with
            status = #confirmed;
          },
        );
      };
      case (null) {
        Runtime.trap("Appointment not found");
      };
    };
  };

  // Cancel Appointment
  public shared ({ caller }) func cancelAppointment(appointmentId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel appointments");
    };

    switch (appointments.get(appointmentId)) {
      case (?appointment) {
        if (appointment.doctorId != caller and appointment.patientId != caller) {
          Runtime.trap("Unauthorized: Only the doctor or patient can cancel appointments");
        };

        appointments.add(
          appointmentId,
          {
            appointment with
            status = #cancelled;
          },
        );
      };
      case (null) {
        Runtime.trap("Appointment not found");
      };
    };
  };

  // Complete Appointment
  public shared ({ caller }) func completeAppointment(appointmentId : Text, doctorNotes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete appointments");
    };

    switch (appointments.get(appointmentId)) {
      case (?appointment) {
        if (appointment.doctorId != caller) {
          Runtime.trap("Unauthorized: Only the assigned doctor can complete appointments");
        };

        let callerProfile = profiles.get(caller);
        if (not isDoctorApproved(callerProfile)) {
          Runtime.trap("Unauthorized: Only approved doctors can complete appointments");
        };

        appointments.add(
          appointmentId,
          {
            appointment with
            status = #completed;
            doctorNotes = doctorNotes;
          },
        );
      };
      case (null) {
        Runtime.trap("Appointment not found");
      };
    };
  };

  // Get Appointments for User
  public query ({ caller }) func getAppointmentsForUser(userId : Principal) : async [Appointment] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own appointments");
    };

    let filteredAppointments = appointments.values().toArray().filter(
      func(appointment) { appointment.doctorId == userId or appointment.patientId == userId }
    );
    filteredAppointments;
  };

  // MESSAGES

  // Send Message
  public shared ({ caller }) func sendMessage(to : Principal, content : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    let messageId = generateId("msg", nextMessageId);
    nextMessageId += 1;

    let message : Message = {
      id = messageId;
      from = caller;
      to = to;
      content = content;
      timestamp = Time.now();
      isRead = false;
    };

    messages.add(messageId, message);
    messageId;
  };

  // Get Conversation
  public query ({ caller }) func getConversation(otherUser : Principal) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view conversations");
    };

    let filteredMessages = messages.values().toArray().filter(
      func(message) {
        (message.from == caller and message.to == otherUser) or (message.from == otherUser and message.to == caller)
      }
    );
    filteredMessages;
  };

  // Mark Message as Read
  public shared ({ caller }) func markMessageRead(messageId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark messages as read");
    };

    switch (messages.get(messageId)) {
      case (?message) {
        if (message.to != caller) {
          Runtime.trap("Unauthorized: Only the recipient can mark messages as read");
        };
        messages.add(
          messageId,
          {
            message with
            isRead = true;
          },
        );
      };
      case (null) {
        Runtime.trap("Message not found");
      };
    };
  };

  // PRESCRIPTIONS

  // Create Prescription
  public shared ({ caller }) func createPrescription(
    patientId : Principal,
    blobId : Text,
    notes : Text,
    dateIssued : Text,
    medicineList : [Medicine],
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create prescriptions");
    };

    let callerProfile = profiles.get(caller);
    if (not isDoctorApproved(callerProfile)) {
      Runtime.trap("Unauthorized: Only approved doctors can create prescriptions");
    };

    let prescriptionId = generateId("presc", nextPrescriptionId);
    nextPrescriptionId += 1;

    let prescription : Prescription = {
      id = prescriptionId;
      doctorId = caller;
      patientId = patientId;
      blobId = blobId;
      notes = notes;
      dateIssued = dateIssued;
      medicineList = medicineList;
    };

    prescriptions.add(prescriptionId, prescription);
    prescriptionId;
  };

  // Get Prescriptions for Patient
  public query ({ caller }) func getPrescriptionsForPatient(patientId : Principal) : async [Prescription] {
    if (caller != patientId and not AccessControl.isAdmin(accessControlState, caller)) {
      let callerProfile = profiles.get(caller);
      if (not isDoctorApproved(callerProfile)) {
        Runtime.trap("Unauthorized: Only the patient, their doctors, or admins can view prescriptions");
      };
    };

    let filteredPrescriptions = prescriptions.values().toArray().filter(
      func(prescription) { prescription.patientId == patientId }
    );
    filteredPrescriptions;
  };

  // MEDICAL HISTORY

  // Add Medical History Entry
  public shared ({ caller }) func addMedicalHistoryEntry(
    title : Text,
    description : Text,
    date : Text,
    category : Text,
    blobId : ?Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add medical history");
    };

    let callerProfile = profiles.get(caller);
    if (not isPatient(callerProfile)) {
      Runtime.trap("Unauthorized: Only patients can add medical history entries");
    };

    let historyId = generateId("hist", nextMedicalHistoryId);
    nextMedicalHistoryId += 1;

    let history : MedicalHistory = {
      id = historyId;
      patientId = caller;
      title = title;
      description = description;
      date = date;
      category = category;
      blobId = blobId;
    };

    medicalHistories.add(historyId, history);
    historyId;
  };

  // Get Medical History for Patient
  public query ({ caller }) func getMedicalHistoryForPatient(patientId : Principal) : async [MedicalHistory] {
    if (caller != patientId and not AccessControl.isAdmin(accessControlState, caller)) {
      let callerProfile = profiles.get(caller);
      if (not isDoctorApproved(callerProfile)) {
        Runtime.trap("Unauthorized: Only the patient, their doctors, or admins can view medical history");
      };
    };

    let filteredHistories = medicalHistories.values().toArray().filter(
      func(history) { history.patientId == patientId }
    );
    filteredHistories;
  };

  // MEDICINE REMINDERS

  // Add Medicine Reminder
  public shared ({ caller }) func addMedicineReminder(
    medicineName : Text,
    dosage : Text,
    frequency : Text,
    startDate : Text,
    endDate : Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add medicine reminders");
    };

    let callerProfile = profiles.get(caller);
    if (not isPatient(callerProfile)) {
      Runtime.trap("Unauthorized: Only patients can add medicine reminders");
    };

    let reminderId = generateId("rem", nextReminderId);
    nextReminderId += 1;

    let reminder : MedicineReminder = {
      id = reminderId;
      patientId = caller;
      medicineName = medicineName;
      dosage = dosage;
      frequency = frequency;
      startDate = startDate;
      endDate = endDate;
      active = true;
    };

    medicineReminders.add(reminderId, reminder);
    reminderId;
  };

  // Update Reminder Active Status
  public shared ({ caller }) func updateReminderActiveStatus(reminderId : Text, active : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update reminders");
    };

    switch (medicineReminders.get(reminderId)) {
      case (?reminder) {
        if (reminder.patientId != caller) {
          Runtime.trap("Unauthorized: Only the owner can update their reminders");
        };
        medicineReminders.add(
          reminderId,
          {
            reminder with
            active = active;
          },
        );
      };
      case (null) {
        Runtime.trap("Reminder not found");
      };
    };
  };

  // Get Reminders for Patient
  public query ({ caller }) func getRemindersForPatient(patientId : Principal) : async [MedicineReminder] {
    if (caller != patientId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the patient or admins can view reminders");
    };

    let filteredReminders = medicineReminders.values().toArray().filter(
      func(reminder) { reminder.patientId == patientId }
    );
    filteredReminders;
  };

  // SYMPTOM CHECKER

  // Check Symptoms
  public shared ({ caller }) func checkSymptoms(input : SymptomCheckerInput) : async SymptomCheckerResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can use symptom checker");
    };

    let callerProfile = profiles.get(caller);
    if (not isPatient(callerProfile)) {
      Runtime.trap("Unauthorized: Only patients can use symptom checker");
    };

    // Simple rule-based logic
    let result : SymptomCheckerResult = {
      relatedConditions = ["Common Cold", "Flu", "Allergies"];
      recommendedAction = "Consult with a doctor if symptoms persist";
      severityHint = "low";
      disclaimer = "This is not a medical diagnosis. Please consult a healthcare professional for accurate diagnosis and treatment.";
    };

    // Log the query
    let queryId = generateId("symq", nextSymptomQueryId);
    nextSymptomQueryId += 1;

    let queryEntry : SymptomQuery = {
      patientId = caller;
      input = input;
      result = result;
      timestamp = Time.now();
    };

    symptomQueries.add(queryId, queryEntry);

    result;
  };

  // Get Symptom Query Log for Patient
  public query ({ caller }) func getSymptomQueryLog(patientId : Principal) : async [SymptomQuery] {
    if (caller != patientId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the patient or admins can view symptom query logs");
    };

    let filteredQueries = symptomQueries.values().toArray().filter(
      func(queryEntry) { queryEntry.patientId == patientId }
    );
    filteredQueries;
  };

  // NOTIFICATIONS

  // Create Notification
  public shared ({ caller }) func createNotification(
    userId : Principal,
    title : Text,
    body : Text,
    notifType : Text,
  ) : async Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create notifications");
    };

    let notificationId = generateId("notif", nextNotificationId);
    nextNotificationId += 1;

    let notification : Notification = {
      id = notificationId;
      userId = userId;
      title = title;
      body = body;
      notifType = notifType;
      isRead = false;
      timestamp = Time.now();
    };

    notifications.add(notificationId, notification);
    notificationId;
  };

  // Get Notifications for User
  public query ({ caller }) func getNotificationsForUser(userId : Principal) : async [Notification] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the user or admins can access notifications");
    };

    let filteredNotifications = notifications.values().toArray().filter(
      func(notification) { notification.userId == userId }
    );
    filteredNotifications;
  };

  // Mark Notification as Read
  public shared ({ caller }) func markNotificationRead(notificationId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark notifications as read");
    };

    switch (notifications.get(notificationId)) {
      case (?notification) {
        if (notification.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the owner can mark notifications as read");
        };
        notifications.add(
          notificationId,
          {
            notification with
            isRead = true;
          },
        );
      };
      case (null) {
        Runtime.trap("Notification not found");
      };
    };
  };

  // HOSPITALS

  // Query Hospitals by City
  public query func getHospitalsByCity(city : Text) : async [Hospital] {
    let filteredHospitals = hospitals.values().toArray().filter(
      func(hospital) { hospital.city == city }
    );
    filteredHospitals;
  };

  // ADMIN FUNCTIONS

  // Get System Stats
  public query ({ caller }) func getSystemStats() : async SystemStats {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view system stats");
    };

    var totalDoctors : Nat = 0;
    var totalPatients : Nat = 0;

    for (profile in profiles.values()) {
      switch (profile.role) {
        case (#doctor) { totalDoctors += 1 };
        case (#patient) { totalPatients += 1 };
        case (_) {};
      };
    };

    {
      totalUsers = profiles.size();
      totalDoctors = totalDoctors;
      totalPatients = totalPatients;
      totalAppointments = appointments.size();
      totalPrescriptions = prescriptions.size();
    };
  };

  // Approve Doctor
  public shared ({ caller }) func approveDoctor(doctorId : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can approve doctors");
    };

    switch (profiles.get(doctorId)) {
      case (?profile) {
        switch (profile.role) {
          case (#doctor) {
            profiles.add(
              doctorId,
              {
                profile with
                verificationStatus = #approved;
              },
            );
          };
          case (_) {
            Runtime.trap("User is not a doctor");
          };
        };
      };
      case (null) {
        Runtime.trap("Doctor profile not found");
      };
    };
  };

  // Reject Doctor
  public shared ({ caller }) func rejectDoctor(doctorId : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can reject doctors");
    };

    switch (profiles.get(doctorId)) {
      case (?profile) {
        switch (profile.role) {
          case (#doctor) {
            profiles.add(
              doctorId,
              {
                profile with
                verificationStatus = #rejected;
              },
            );
          };
          case (_) {
            Runtime.trap("User is not a doctor");
          };
        };
      };
      case (null) {
        Runtime.trap("Doctor profile not found");
      };
    };
  };
};
