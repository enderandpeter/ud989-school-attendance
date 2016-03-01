/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText || this.textContent;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {
   var model = {
       init: function(){
           this.attendance = JSON.parse(localStorage.attendance);
       },
       getAttendance: function(){
           return this.attendance;
       },
       setAttendance: function(data){
           this.attendance = data;
           localStorage.attendance = JSON.stringify(data);
       }
   };
   var octopus = {
       init: function(){
           model.init();
           view.init();
       },
       getAttendance: function(){
           return model.getAttendance();
       },
       setAttendance: function(newAttendance){
           var data = this.getAttendance();
           
           data[newAttendance.name][newAttendance.day] = newAttendance.attended;
           model.setAttendance(data);
       }
   };
   var view = {
       init: function(){
           this.studentRows = $('.student');
           this.studentHeader = $('thead');
           this.render();
       },
       render: function(){
           var attendance = octopus.getAttendance();
           this.studentRows.each(function(studentRowIndex, studentRowElement){
              function updateDaysMissed(){
                 missed_col.text($.grep(octopus.getAttendance()[studentName], function(element, index){
                       return element;
                  }).length);
               }
               var studentName = $(studentRowElement).find('.name-col').text();
               var studentAttendance = attendance[studentName];
               var missed_col = $(studentRowElement).find('.missed-col');
               var missedDays = 0;

               $.each(studentAttendance, function(day, attended){
                   var headerFilled = view.studentHeader.find('.name-col').hasClass('filled');

                   if(!headerFilled){
                      var th = $(document.createElement('th'));
                      th.text(day + 1);
                      view.studentHeader.find('.missed-col').before(th);

                      if(day === 11){
                         view.studentHeader.find('.name-col').addClass('filled');
                      }
                   }

                   var attend_col = $(document.createElement('td'));
                   var checkbox = $(document.createElement('input'));
                   checkbox.attr('type', 'checkbox').prop('checked', attended);
                   
                   checkbox.on('change', function(){
                         var newAttendance = {
                           name: studentName,
                           day: day,
                           attended: checkbox.prop('checked')
                         };

                         octopus.setAttendance(newAttendance);

                         updateDaysMissed();
                   });
                   
                   attend_col.attr('class', 'attend-col').append(checkbox);                            
                   missed_col.before(attend_col);
               });
               updateDaysMissed();               
           });
       }
   };
   
   octopus.init();
}());
