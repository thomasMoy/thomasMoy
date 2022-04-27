window.onload = (event) =>{

  const toastError = document.getElementById("toastError");
  window.toastError = new bootstrap.Toast(toastError);
  const toastSuccess = document.getElementById("toastSuccess");
  window.toastSuccess = new bootstrap.Toast(toastSuccess);

}

function refresh() {    
  setTimeout(function () {
      location.reload()
  }, 4000);
}

let currentData;

function getLocationData() {

  $.ajax({
    type: "GET",
    url: 'php/getAllLocations.php',
    dataType: "json",
    success: function(data){
    
    let locations = data.data;
    console.log(locations);
    

    let locationsListAccordionNumber = 1
    
    locations.forEach(function(position){

    
    
      $('#location-results-accordion').append(`<div class="accordion-item">
      <h2 class="accordion-header" id="heading${locationsListAccordionNumber}">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${locationsListAccordionNumber}" aria-expanded="false" aria-controls="collapse${locationsListAccordionNumber}">
          ${position.name}
        </button>
      </h2>
      <div id="collapse${locationsListAccordionNumber}" class="accordion-collapse collapse" aria-labelledby="heading${locationsListAccordionNumber}" data-bs-parent="#location-results-accordion">
        <div class="accordion-body" id="locations-list-${position.id}">
        </div>
      </div>
    </div>`);
    
    locationsListAccordionNumber++;

    $('#adddeptlocationlist').append(`<option value="${position.id}">${position.name}</option>`);
    $('#editdeptlocationlist').append(`<option value="${position.id}">${position.name}</option>`);
    $('#edit-location-list').append(`<option value="${position.id}">${position.name}</option>`);
  
  });
}
  })
  
}

function getDeptData() {

  $.ajax({
    type: "GET",
    url: "php/getAllDepartments.php",
    dataType: "json",
    success: function(data){

      let departments = data.data;
        console.log(departments);
        
      
        
      let departmentsListAccordionNumber = 1;

      departments.forEach(function(position){


        $("#add-employee-dept-list").append(`<option value="${position.id}">${position.name}</option>`);
        
        $("#editdeptlist").append(`<option value="${position.id}, ${position.locationID}, ${position.location}">${position.name}</option>`);
    
        $("#edit-employee-dept-list").append(`<option value="${position.id}">${position.name}</option>`);
        
        $("#department-results-accordion").append(
        `<div class="accordion-item">
                        <h2 class="accordion-header" id="heading${departmentsListAccordionNumber}">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${departmentsListAccordionNumber}" aria-expanded="true" aria-controls="collapse${departmentsListAccordionNumber}">
                            ${position.name}
                        </h2>
                        <div id="collapse${departmentsListAccordionNumber}" class="accordion-collapse collapse" aria-labelledby="heading${departmentsListAccordionNumber}" data-bs-parent="#department-results-accordion">
                          <div class="accordion-body" id="dept-list-${position.id}">
                          </div>
                        </div>
                      </div>`);
        
        departmentsListAccordionNumber++;
    
        $(`#locations-list-${position.locationID}`).append(`
          <div class="accordion-body">
            <div class="location-results-container">
                <div class="location-results-header">
                  <h6 class="department-id-in-location">${position.id}</h6><h6 class="location-results-department-name">${position.name}</h6>
                </div>
            <div class="location-results-body" id="dept-in-location-${position.id}">
          </div>
              </div>`)
        
      });
    }
  })
  $.getJSON("php/getAllDepartments.php", function (data) {
        

  
  });
}

function getEmployeeData() {
  $.ajax({
    type: "GET",
    url: "php/getAll.php",
    dataType: "json",
    success: function(data){
      let employees = data.data;
      console.log(employees);
      
      currentData = employees;

      employees.forEach(function(position){

        $("#employee-results").append(`<div class="card" style="width: 18rem;">
          <div class="card-body">
            <div class="individual-result"><i class="fa-solid fa-user fa-xl"></i><h5 class="card-title record"><span id="first-name-${position.id}">${position.firstName}</span>&nbsp<span id="last-name-${position.id}">${position.lastName}</span></h5></div>
            <div class="individual-result"><i class="fa-solid fa-id-badge"></i><h6 id="employee-id-${position.id}" class="card-subtitle mb-2 text-muted record">${position.id}</h6></div>
            <div class="individual-result"><i class="fa-solid fa-at"></i><p id="email-${position.id}">${position.email}<p></div>
            <p id="department-id-${position.id}" class="department-id">${position.departmentID}</p>
            <div class="dept-location"><div class="individual-result"><i class="fa-solid fa-building"></i><h6 class="record" id="department-${position.id}">${position.department}</h5></div>
            <div class="individual-result"><i class="fa-solid fa-map-location"></i><h6 class="record" id="location-${position.id}">${position.location}</h5></div>
            
          </div>
          <button id="${position.id}" class="edit-employee-button" data-bs-toggle="modal" data-bs-target="#editEmployeeModal" onclick="populateEditModalWithCurrentInfo(this.id);"><i class="fa-solid fa-pen-to-square"></i></button>
          </div>
        </div>`);

        $(`#dept-list-${position.departmentID}`).append(`<div class="card" style="width: 18rem;">
        <div class="card-body">
          <div class="individual-result"><i class="fa-solid fa-user fa-xl"></i><h5 class="card-title record"><span id="first-name-${position.id}">${position.firstName}</span>&nbsp<span id="last-name-${position.id}">${position.lastName}</span></h5></div>
          <div class="individual-result"><i class="fa-solid fa-id-badge"></i><h6 id="employee-id-${position.id}" class="card-subtitle mb-2 text-muted record">${position.id}</h6></div>
          <div class="individual-result"><i class="fa-solid fa-at"></i><p>${position.email}<p></div>
          <p id="department-id-${position.id}" class="department-id">${position.departmentID}</p>
          <div class="dept-location"><div class="individual-result"><i class="fa-solid fa-building"></i><h6 class="record" id="department-${position.id}">${position.department}</h5></div>
          <div class="individual-result"><i class="fa-solid fa-map-location"></i><h6 class="record" id="location-${position.id}">${position.location}</h5></div>
          
        </div>
        <button id="${position.id}" class="edit-employee-button" data-bs-toggle="modal" data-bs-target="#editEmployeeModal" onclick="populateEditModalWithCurrentInfo(this.id);"><i class="fa-solid fa-pen-to-square"></i></button>
        </div>
      </div>`);

      $(`#dept-in-location-${position.departmentID}`).append(`<div class="card" style="width: 18rem;">
        <div class="card-body">
          <div class="individual-result"><i class="fa-solid fa-user fa-xl"></i><h5 class="card-title record"><span id="first-name-${position.id}">${position.firstName}</span>&nbsp<span id="last-name-${position.id}">${position.lastName}</span></h5></div>
          <div class="individual-result"><i class="fa-solid fa-id-badge"></i><h6 id="employee-id-${position.id}" class="card-subtitle mb-2 text-muted record">${position.id}</h6></div>
          <div class="individual-result"><i class="fa-solid fa-at"></i><p>${position.email}<p></div>
          <p id="department-id-${position.id}" class="department-id">${position.departmentID}</p>
          <div class="dept-location"><div class="individual-result"><i class="fa-solid fa-building"></i><h6 class="record" id="department-${position.id}">${position.department}</h5></div>
          <div class="individual-result"><i class="fa-solid fa-map-location"></i><h6 class="record" id="location-${position.id}">${position.location}</h5></div>
          
        </div>
        <button id="${position.id}" class="edit-employee-button" data-bs-toggle="modal" data-bs-target="#editEmployeeModal" onclick="populateEditModalWithCurrentInfo(this.id);"><i class="fa-solid fa-pen-to-square"></i></button>
        </div>
      </div>`
        );
    
      })
    }
  })
}

  getLocationData();
  getDeptData();
  getEmployeeData();

  
function addEmployeeToDatabase() {

  
  let firstName = $('#newFirstName').val();
  let lastName = $('#newLastName').val();
  let email = $('#newEmail').val();
  let departmentID = $('#add-employee-dept-list').val();
  
  $.ajax({
    type: "POST",
    url: 'php/addNewEmployee.php',
    dataType: "json",
    data: {
      fname: firstName,
      lname: lastName,
      email: email,
      department: departmentID
    },
    success: function(data) {
      
      $('#addEmployeeModal').modal('hide');
      $('#addEmployeeForm').trigger('reset');
      $('#toastSuccessMessage').html(`${firstName} ${lastName} successfully added.`);
      $('#toastSuccess').toast('show');
      $('#newFirstName').attr("disabled", false);
      $('#newLastName').attr("disabled", false);
      $('#newEmail').attr("disabled", false);
      $('#add-employee-dept-list').attr("disabled", false);
      $('#add-employee-confirmation-modal-footer').hide();
      $('#add-employee-modal-footer').show();
      refresh();

    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('#addEmployeeModal').modal('hide');
      $('#toastErrorMessage').html(`${firstName} ${lastName} not added.<br>${errorThrown}<br>${jqXHR}<br>${textStatus}.`);
      $('#toastError').toast('show');
    }
      
    
      
    
  });
}

function addEmployee(){

  $('#addEmployeeForm').on("submit", function(event) {
  event.preventDefault();
  $('#newFirstName').attr("disabled", true);
  $('#newLastName').attr("disabled", true);
  $('#newEmail').attr("disabled", true);
  $('#add-employee-dept-list').attr("disabled", true);
  $('#add-employee-modal-footer').hide();
  $('#add-employee-confirmation-modal-footer').show();
  let newFirstName = $('#newFirstName').val();
  let newLastName = $('#newLastName').val();
  $('#employeeToAdd').html(`Are you sure you wish to add ${newFirstName} ${newLastName} to employee's?`);
  
  })
  
  
}

$('#add-employee-proceed-button').on('click', function(){
  addEmployeeToDatabase();
});

$('#add-employee-go-back-button').on('click', function(){
  $('#add-employee-confirmation-modal-footer').hide();
  $('#newFirstName').attr("disabled", false);
  $('#newLastName').attr("disabled", false);
  $('#newEmail').attr("disabled", false);
  $('#add-employee-dept-list').attr("disabled", false);
  $('#add-employee-modal-footer').show();
});
  

$('#delete-employee-step-one-button').on('click', function(){

  let employeeToDelete = `${$('#editemployeefirstname').val()} ${$('#editemployeelastname').val()}` 

  $('#editemployeefirstname').attr("disabled", true);
  $('#editemployeelastname').attr("disabled", true);
  $('#editemployeeemail').attr("disabled", true);
  $('#edit-employee-dept-list').attr("disabled", true);
  $('#edit-employee-modal-footer').hide();
  $('#employeeToDelete').html(`Are you sure you wish to delete ${employeeToDelete}`);
  $('#delete-employee-confirmation-modal-footer').show();

});

$('#delete-employee-go-back-button').on('click', function(){
  $('#editemployeefirstname').attr("disabled", false);
  $('#editemployeelastname').attr("disabled", false);
  $('#editemployeeemail').attr("disabled", false);
  $('#edit-employee-dept-list').attr("disabled", false);
  $('#delete-employee-confirmation-modal-footer').hide();
  $('#edit-employee-modal-footer').show();
});

$('#delete-employee-proceed-button').on('click', function(){

    let employeeToDelete = `${$('#editemployeefirstname').val()} ${$('#editemployeelastname').val()}` 

    employeeID = $('#editemployeeid').val();

    $.ajax({
      type: "POST",
      url: 'php/deleteEmployeeByID.php',
      dataType: "json",
      data: {
        employeeID: employeeID
      },
      success: function(data) {
        
        $('#editEmployeeModal').modal('hide');
          $('#editEmployeeForm').trigger('reset');
          $('#toastSuccessMessage').html(`${employeeToDelete} successfully deleted.`);
          $('#toastSuccess').toast('show');
          $('#editemployeefirstname').attr("disabled", false);
          $('#editemployeelastname').attr("disabled", false);
          $('#editemployeeemail').attr("disabled", false);
          $('#edit-employee-dept-list').attr("disabled", false);
          $('#delete-employee-confirmation-modal-footer').hide();
          $('#edit-employee-modal-footer').show();
          refresh();
  
      },
      error: function(jqXHR, textStatus, errorThrown) {
        $('#editEmployeeModal').modal('hide');
        $('#toastErrorMessage').html(`${employeeToDelete} not deleted.<br>${errorThrown}<br>${jqXHR}<br>${textStatus}.`);
        $('#toastError').toast('show');
      }
        
      
        
      
    });

    
  
});



$('#edit-employee-step-one-button').on('click', function(){
  
  $('#editemployeefirstname').attr("disabled", true);
  $('#editemployeelastname').attr("disabled", true);
  $('#editemployeeemail').attr("disabled", true);
  $('#edit-employee-dept-list').attr("disabled", true);
  $('#edit-employee-modal-footer').hide();
  $('#edit-employee-confirmation-modal-footer').show();
  let editedFirstName = $('#editemployeefirstname').val();
  let editedLastName = $('#editemployeelastname').val();
  $('#employeeToEdit').html(`Are you sure you wish to save the changes you've made to ${editedFirstName} ${editedLastName}?`);
  
});

$('#edit-employee-go-back-button').on('click', function(){
  $('#edit-employee-confirmation-modal-footer').hide();
  $('#editemployeefirstname').attr("disabled", false);
  $('#editemployeelastname').attr("disabled", false);
  $('#editemployeeemail').attr("disabled", false);
  $('#edit-employee-dept-list').attr("disabled", false);
  $('#edit-employee-modal-footer').show();
});

$('#edit-employee-proceed-button').on('click', function(){
  let employeeID = $('#editemployeeid').val();
  let firstName = $('#editemployeefirstname').val();
  let lastName = $('#editemployeelastname').val();
  let email = $('#editemployeeemail').val();
  let department = $('#edit-employee-dept-list').val();

  $.ajax({
    type: "POST",
    url: 'php/updateEmployeeByID.php',
    dataType: "json",
    data: {
      employeeID: employeeID,
      firstName: firstName,
      lastName: lastName,
      email: email,
      department: department
    },
    success: function(data) {
      
      $('#editEmployeeModal').modal('hide');
        $('#editEmployeeForm').trigger('reset');
        $('#toastSuccessMessage').html(`${firstName} ${lastName} successfully updated.`);
        $('#toastSuccess').toast('show');
        $('#editemployeefirstname').attr("disabled", false);
        $('#editemployeelastname').attr("disabled", false);
        $('#editemployeeemail').attr("disabled", false);
        $('#edit-employee-dept-list').attr("disabled", false);
        $('#delete-employee-confirmation-modal-footer').hide();
        $('#edit-employee-modal-footer').show();
        refresh();

    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('#editEmployeeModal').modal('hide');
      $('#toastErrorMessage').html(`${firstName} ${lastName} not updated.<br>${errorThrown}<br>${jqXHR}<br>${textStatus}.`);
      $('#toastError').toast('show');
    }
      
    
      
    
  });
});

function populateEditModalWithCurrentInfo(employeeID) {
  console.log(employeeID);
  let employeeFirstName = $(`#first-name-${employeeID}`).html();
  let employeeLastName = $(`#last-name-${employeeID}`).html();
  let departmentID = $(`#department-id-${employeeID}`).html();
  let department = $(`#department-${employeeID}`).html();
  let email = $(`#email-${employeeID}`).html();

  $('#editemployeefirstname').val(employeeFirstName);
  $('#editemployeelastname').val(employeeLastName);
  $('#editemployeeid').val(employeeID);
  $('#edit-employee-dept-list').prepend(`<option value="${departmentID}" selected>${department}</option>`);
  $('#editemployeeemail').val(email);
  $('#delete-employee-button').click(function(){
    deleteEmployee(employeeID);
  }
  );

}

$('#add-department-step-one-button').on('click', function(){
  
  $('#addDeptName').attr("disabled", true);
  $('#adddeptlocationlist').attr("disabled", true);
  $('#add-department-modal-footer').hide();
  $('#add-department-confirmation-modal-footer').show();
  let addDeptName = $('#addDeptName').val();
  let addDeptLocation = $('#adddeptlocationlist').val();
  $('#departmentToAdd').html(`Are you sure you wish to add ${addDeptName}?`);
  
});

$('#add-department-go-back-button').on('click', function(){
  $('#add-department-confirmation-modal-footer').hide();
  $('#addDeptName').attr("disabled", false);
  $('#adddeptlocationlist').attr("disabled", false);
  $('#add-department-modal-footer').show();
});


function addDept() {

  $('#adddeptform').on("submit", function(event) {
    event.preventDefault();
    
    let deptName = $('#addDeptName').val();
    let location = $('#adddeptlocationlist').val();

  $.ajax({
    type: "POST",
    url: 'php/insertDepartment.php',
    dataType: "json",
    data: {
      deptName: deptName,
      location: location
    },
    success: function(data) {
      
      $('#addDepartmentModal').modal('hide');
      $('#adddeptform').trigger('reset');
      $('#toastSuccessMessage').html(`${deptName} successfully added.`);
      $('#toastSuccess').toast('show');
      $('#addDeptName').attr("disabled", false);
      $('#adddeptlocationlist').attr("disabled", false);
      $('#add-department-confirmation-modal-footer').hide();
      $('#add-department-modal-footer').show();
      refresh();

    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('#addDepartmentModal').modal('hide');
      $('#toastErrorMessage').html(`${deptName} not added.<br>${errorThrown}<br>${jqXHR}<br>${textStatus}.`);
      $('#toastError').toast('show');
    }
      
    
      
    
  });
  })
}

$('#editdeptlist').on('change', function(){
  let locationID = $('#editdeptlist').val().split(',')[1];
  let location = $('#editdeptlist').val().split(',')[2];
  $('#editdeptlocationlist').prepend(`<option value="${locationID}" selected>${location}</option>`);
  $('#edit-dept-options').show();
});


$('#edit-department-step-one-button').on('click', function(){
  $('#editdeptlist').attr("disabled", true);
  $('#updated-department-name').attr("disabled", true);
  $('#editdeptlocationlist').attr("disabled", true);
  $('#edit-department-modal-footer').hide();
  $('#edit-department-delete-button').hide();
  $('#edit-department-confirmation-modal-footer').show();
  let updatedDeptName = $('#updated-department-name').val();
  $('#departmentToEdit').html(`Are you sure you wish to update the department ${updatedDeptName}?`);
  
});

$('#edit-department-go-back-button').on('click', function(){
  $('#edit-department-confirmation-modal-footer').hide();
  $('#edit-department-delete-button').show();
  $('#editdeptlist').attr("disabled", false);
  $('#updated-department-name').attr("disabled", false);
  $('#editdeptlocationlist').attr("disabled", false);
  $('#edit-department-modal-footer').show();
});


function editDepartment() {
$('#editDepartmentForm').on("submit", function(event) {
    event.preventDefault();
  let departmentID = $('#editdeptlist').val().split(',')[0];
  let currentlocationID = $('#editdeptlist').val().split(',')[1];
  let updatedDepartmentName = $('#updated-department-name').val();
  if (updatedDepartmentName == "") {
    updatedDepartmentName = $('#editdeptlist option:selected').text();
  }
  let updatedLocation = $('#editdeptlocationlist').val();
  if (updatedLocation == null) {
    updatedLocation = currentlocationID;
  };

  $.ajax({
    type: "POST",
    url: 'php/updateDepartmentByID.php',
    dataType: "json",
    data: {
      departmentID: departmentID,
      updatedDepartmentName: updatedDepartmentName,
      updatedLocation: updatedLocation
    },
    success: function(data) {
      
      $('#editDepartmentModal').modal('hide');
      $('#editDepartmentForm').trigger('reset');
      $('#toastSuccessMessage').html(`${updatedDepartmentName} successfully updated.`);
      $('#toastSuccess').toast('show');
      $('#edit-department-confirmation-modal-footer').hide();
      $('#edit-department-delete-button').show();
      $('#editdeptlist').attr("disabled", false);
      $('#updated-department-name').attr("disabled", false);
      $('#editdeptlocationlist').attr("disabled", false);
      $('#edit-department-modal-footer').show();
      refresh();

    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('#editDepartmentModal').modal('hide');
      $('#toastErrorMessage').html(`${updatedDepartmentName} not updated.<br>${errorThrown}<br>${jqXHR}<br>${textStatus}.`);
      $('#toastError').toast('show');
    }
      
    
      
    
  });
})
}

$('#edit-department-delete-button').on('click', function(){
  
  let departmentID = $('#editdeptlist').val().split(',')[0];
  let departmentName = $('#editdeptlist option:selected').text();
  
  const areThereEmployeesAssignedToDept = currentData.some((element) => element.departmentID === departmentID); 

  if(areThereEmployeesAssignedToDept) {
    $('#editdeptlist').attr("disabled", true);
    $('#edit-department-delete-button').hide();
    $('#edit-department-modal-footer').hide();
    $('#departmentToEditError').html(`This department still has employees assigned to it. You must either delete these employees or assign them to another department.`);
    $('#delete-department-error-modal-footer').show();
  } else {
    $('#editdeptlist').attr("disabled", true);
    $('#edit-department-delete-button').hide();
    $('#edit-department-modal-footer').hide();
    $('#delete-department-confirmation-modal-footer').show();
  }

  
  $('#delete-department-proceed-button').on('click', function(){

    $.ajax({
      type: "POST",
      url: 'php/deleteDepartmentByID.php',
      dataType: "json",
      data: {
        departmentID: departmentID
      },
      success: function(data) {
        
        $('#editDepartmentModal').modal('hide');
        $('#editDepartmentForm').trigger('reset');
        $('#toastSuccessMessage').html(`${departmentName} successfully deleted.`);
        $('#toastSuccess').toast('show');
        $('#edit-department-confirmation-modal-footer').hide();
        $('#edit-department-delete-button').show();
        $('#editdeptlist').attr("disabled", false);
        $('#updated-department-name').attr("disabled", false);
        $('#editdeptlocationlist').attr("disabled", false);
        $('#edit-department-modal-footer').show();
        refresh();
  
      },
      error: function(jqXHR, textStatus, errorThrown) {
        $('#editDepartmentModal').modal('hide');
        $('#toastErrorMessage').html(`${updatedDepartmentName} not deleted.<br>${errorThrown}<br>${jqXHR}<br>${textStatus}.`);
        $('#toastError').toast('show');
      }
        
      
        
      
    });


  })


    
  
    $('#delete-department-error-go-back-button').on('click', function(){
      $('#editdeptlist').attr("disabled", false);
      $('#edit-department-delete-button').show();
      $('#delete-department-error-modal-footer').hide();
      $('#edit-department-modal-footer').show();
    });
  
    $('#delete-department-go-back-button').on('click', function(){
      $('#editdeptlist').attr("disabled", false);
      $('#edit-department-delete-button').show();
      $('#delete-department-confirmation-modal-footer').hide();
      $('#edit-department-modal-footer').show();
    });
  
});

$('#add-location-step-one-button').on('click', function(){
  
  $('#newLocationName').attr("disabled", true);
  $('#add-location-modal-footer').hide();
  $('#add-location-confirmation-modal-footer').show();
  let newLocation = $('#newLocationName').val();
  $('#locationToAdd').html(newLocation);
  
});

$('#add-location-go-back-button').on('click', function(){
  $('#add-location-confirmation-modal-footer').hide();
  $('#newLocationName').attr("disabled", false);
  $('#add-location-modal-footer').show();
});


function addLocation() {
  $('#addLocationForm').on("submit", function(event) {
    event.preventDefault();

  let newLocation = $('#newLocationName').val();

  $.ajax({
    type: "POST",
    url: 'php/insertLocation.php',
    dataType: "json",
    data: {
      newLocation: newLocation
    },
    success: function(data) {
      
      $('#addLocationModal').modal('hide');
      $('#addLocationForm').trigger('reset');
      $('#toastSuccessMessage').html(`${newLocation} successfully added.`);
      $('#toastSuccess').toast('show');
      $('#add-location-confirmation-modal-footer').hide();
      $('#newLocationName').attr("disabled", false);
      $('#add-location-modal-footer').show();
      refresh();

    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('#addLocationModal').modal('hide');
      $('#toastErrorMessage').html(`${newLocation} not added.<br>${errorThrown}<br>${jqXHR}<br>${textStatus}.`);
      $('#toastError').toast('show');
    }
      
    
      
    
  });
  })
  
}

$('#edit-location-list').on('change', function(){
  $('#edit-location-options').show();
});

$('#edit-location-step-one-button').on('click', function(){
  $('#edit-location-list').attr("disabled", true);
  $('#updatedLocation').attr("disabled", true);
  $('#delete-location-button').hide();
  $('#edit-location-modal-footer').hide();
  $('#locationToEdit').html("Are you sure you wish to update this location?")
  $('#edit-location-confirmation-modal-footer').show();
});

$('#update-location-go-back-button').on('click', function(){
  $('#edit-location-list').attr("disabled", false);
  $('#updatedLocation').attr("disabled", false);
  $('#delete-location-button').show();
  $('#edit-location-confirmation-modal-footer').hide();
  $('#edit-location-modal-footer').show();
});

$('#update-location-proceed-button').on('click', function(){

  let updatedLocation = $('#updatedLocation').val();
  let locationID = $('#edit-location-list').val();

  $.ajax({
    type: "POST",
    url: 'php/updateLocationByID.php',
    dataType: "json",
    data: {
      updatedLocation: updatedLocation,
      locationID: locationID
    },
    success: function(data) {
      
      $('#editLocationModal').modal('hide');
      $('#edit-location-form').trigger('reset');
      $('#toastSuccessMessage').html(`${updatedLocation} successfully updated.`);
      $('#toastSuccess').toast('show');
      $('#edit-location-confirmation-modal-footer').hide();
      $('#edit-location-list').attr("disabled", false);
      $('#updatedLocation').attr("disabled", false);
      $('#edit-location-modal-footer').show();
      refresh();

    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('#editLocationModal').modal('hide');
      $('#toastErrorMessage').html(`${updatedLocation} not added.<br>${errorThrown}<br>${jqXHR}<br>${textStatus}.`);
      $('#toastError').toast('show');
    }
      
    
      
    
  });
});

$('#delete-location-button').on('click', function(){
  
  let locationID = $('#edit-location-list').val();
  
  const areThereEmployeesAssignedToLocation = currentData.some((element) => element.locationID === locationID);

  console.log(areThereEmployeesAssignedToLocation);
  
  if(areThereEmployeesAssignedToLocation){
    $('#edit-location-list').attr("disabled", true);
    $('#updatedLocation').attr("disabled", true);
    $('#delete-location-button').hide();
    $('#edit-location-modal-footer').hide();
    $('#locationToDeleteError').html("This location still has departments assigned to it. You must either delete these departments or assign them to another location.");
    $('#delete-location-error-modal-footer').show();
  } else{
    $('#edit-location-list').attr("disabled", true);
    $('#updatedLocation').attr("disabled", true);
    $('#delete-location-button').hide();
    $('#edit-location-modal-footer').hide();
    $('#locationToDelete').html("Are you sure you want to delete this location?");
    $('#delete-location-confirmation-modal-footer').show();
  }
  
});

$('#delete-location-go-back-button').on('click', function(){
  $('#edit-location-list').attr("disabled", false);
    $('#updatedLocation').attr("disabled", false);
    $('#delete-location-button').show();
    $('#delete-location-confirmation-modal-footer').hide();
    $('#edit-location-modal-footer').show();
});

$('#delete-location-error-go-back-button').on('click', function(){
  $('#edit-location-list').attr("disabled", false);
    $('#updatedLocation').attr("disabled", false);
    $('#delete-location-button').show();
    $('#edit-location-modal-footer').show();
    $('#delete-location-error-modal-footer').hide();
});


$('#delete-location-proceed-button').on('click', function(){
  let updatedLocation = $('#updatedLocation').val();
  let locationID = $('#edit-location-list').val();

    $.ajax({
      type: "POST",
      url: 'php/deleteLocationByID.php',
      dataType: "json",
      data: {
        locationID: locationID
      },
      success: function(data) {
        
        $('#editLocationModal').modal('hide');
        $('#edit-location-form').trigger('reset');
        $('#toastSuccessMessage').html(`${updatedLocation} successfully deleted.`);
        $('#toastSuccess').toast('show');
        $('#delete-location-confirmation-modal-footer').hide();
        $('#edit-location-list').attr("disabled", false);
        $('#updatedLocation').attr("disabled", false);
        $('#delete-location-button').show();
        $('#edit-location-modal-footer').show();
        refresh();
  
      },
      error: function(jqXHR, textStatus, errorThrown) {
        $('#editLocationModal').modal('hide');
        $('#toastErrorMessage').html(`${updatedLocation} not deleted.<br>${errorThrown}<br>${jqXHR}<br>${textStatus}.`);
        $('#toastError').toast('show');
      }
        
      
        
      
    });

});

$('#search-bar').on('click', function(){
  $('#employee-results').hide();
  $('#search-results').css('display', 'flex');
});

$('#quit-search-button').on('click', function(){
  $('#employee-results').show();
  $('#search-results').html("");
  $('#search-results').hide();
});

$('#search-bar').on('keyup', function(){
  $('#search-results').html("");
  let searchTerm = $('#search-bar').val();
  console.log(searchTerm);
  
  let searchResults = [];

  currentData.forEach(function(position){
    
    let firstNameRegex = new RegExp(searchTerm,'gi');
    let lastNameRegex = new RegExp(searchTerm,'gi');
    
    let firstNameMatches = position.firstName.match(firstNameRegex);
    let lastNameMatches = position.lastName.match(lastNameRegex);
    

    if(firstNameMatches==null && lastNameMatches==null){
      return
    
    } else {
      searchResults.unshift({id:position.id, firstName:position.firstName, lastName:position.lastName, department:position.department, location:position.location, email:position.email
      
      });
      
      

    }
  });

console.log(searchResults);

  if(searchResults.length == 0){
    $('#no-results').show();
  } else {
    $('#no-results').hide();
  }

  searchResults.forEach(function(position){
    $('#search-results').append(`<div class="card" style="width: 18rem;">
    <div class="card-body">
      <div class="individual-result"><i class="fa-solid fa-user fa-xl"></i><h5 class="card-title record"><span id="first-name-${position.id}">${position.firstName}</span>&nbsp<span id="last-name-${position.id}">${position.lastName}</span></h5></div>
      <div class="individual-result"><i class="fa-solid fa-id-badge"></i><h6 id="employee-id-${position.id}" class="card-subtitle mb-2 text-muted record">${position.id}</h6></div>
      <div class="individual-result"><i class="fa-solid fa-at"></i><p>${position.email}<p></div>
      <p id="department-id-${position.id}" class="department-id">${position.departmentID}</p>
      <div class="dept-location"><div class="individual-result"><i class="fa-solid fa-building"></i><h6 class="record" id="department-${position.id}">${position.department}</h5></div>
      <div class="individual-result"><i class="fa-solid fa-map-location"></i><h6 class="record" id="location-${position.id}">${position.location}</h5></div>
      
    </div>
    <button id="${position.id}" class="edit-employee-button" data-bs-toggle="modal" data-bs-target="#editEmployeeModal" onclick="populateEditModalWithCurrentInfo(this.id);"><i class="fa-solid fa-pen-to-square"></i></button>
    </div>
  </div>`);
  });
  
  
});




















